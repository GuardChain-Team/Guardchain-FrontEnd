import { Server } from "socket.io";
import { createServer } from "http";
import { generateRealisticTransaction } from "../utils/transaction-generator";
import { calculateRiskScore } from "../utils/risk-calculator";
import { prisma } from "../database/prisma";
import type { TransactionInput } from "@/types/models";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("🚀 Starting GuardChain realtime server...");

// Increased frequency for more realistic real-time data
const MIN_INTERVAL = 3000; // 3 seconds
const MAX_INTERVAL = 5000; // 5 seconds

let transactionCount = 0;
let totalRiskScore = 0;
let highRiskCount = 0;

async function generateAndBroadcastTransaction() {
  console.log(`\n💫 Generating transaction #${transactionCount + 1}...`);
  try {
    const transaction: TransactionInput = generateRealisticTransaction();
    const riskScore = calculateRiskScore(transaction);

    // Save to database
    const savedTransaction = await prisma.transaction.create({
      data: {
        transactionId: transaction.transactionId || "",
        amount: transaction.amount || 0,
        currency: transaction.currency || "IDR",
        fromAccount: transaction.fromAccount || "",
        toAccount: transaction.toAccount || "",
        description: transaction.description || null,
        timestamp: new Date(),
        status: riskScore > 0.7 ? "PENDING" : "COMPLETED",
        riskScore: riskScore,
        isBlacklisted: false,
        isFlagged: riskScore > 0.7,
        metadata: JSON.stringify({
          ipAddress: transaction.ipAddress,
          userAgent: transaction.userAgent,
          location: transaction.location,
          deviceId: transaction.deviceId,
        }),
      },
      include: {
        alerts: true,
      },
    });

    // Update statistics
    transactionCount++;
    totalRiskScore += riskScore;
    if (riskScore > 0.7) highRiskCount++;

    // Log transaction details
    console.log(`📊 Transaction Details:
    - Amount: IDR ${transaction.amount.toLocaleString()}
    - From: ${transaction.fromAccount}
    - To: ${transaction.toAccount}
    - Location: ${transaction.location}
    - Risk Score: ${riskScore.toFixed(2)}
    - Status: ${savedTransaction.status}
    `);

    console.log(`📈 Statistics:
    - Total Transactions: ${transactionCount}
    - Average Risk Score: ${(totalRiskScore / transactionCount).toFixed(2)}
    - High Risk Count: ${highRiskCount} (${(
      (highRiskCount / transactionCount) *
      100
    ).toFixed(1)}%)
    `);

    // Create alert for high-risk transactions
    if (riskScore > 0.7) {
      console.log("⚠️ High risk transaction detected! Creating alert...");
      const alert = await prisma.alert.create({
        data: {
          transactionId: savedTransaction.id,
          title: "High Risk Transaction Detected",
          description: `High-risk transaction detected (Score: ${(
            riskScore * 100
          ).toFixed(2)}%)`,
          severity: "HIGH",
          status: "PENDING",
          riskScore: riskScore,
          category: "FRAUD_SUSPICIOUS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Broadcast alert
      console.log("[RealtimeServer] Broadcasting newAlert:", alert);
      io.emit("newAlert", alert);
    }

    // Broadcast new transaction
    // Broadcast new transaction
    console.log("📡 Broadcasting transaction...");
    io.emit("newTransaction", savedTransaction);

    // Update analytics
    console.log("📊 Updating analytics...");
    const analytics = await updateRealTimeAnalytics();
    io.emit("analyticsUpdate", analytics);
  } catch (error) {
    console.error("❌ Error generating transaction:", error);
  }

  // Schedule next transaction with random interval
  console.log(
    `\n⏳ Scheduling next transaction in ${MAX_INTERVAL / 1000} seconds...`
  );
  const nextInterval = Math.floor(
    Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1) + MIN_INTERVAL
  );
  setTimeout(generateAndBroadcastTransaction, nextInterval);
}

export async function updateRealTimeAnalytics() {
  const last6Hours = new Date(Date.now() - 6 * 60 * 60 * 1000);

  // Get analytics data matching frontend expectations
  const [
    totalTransactions,
    riskDistributionRaw,
    statusDistributionRaw,
    recentTransactionsRaw,
    totalAlerts,
    highRiskAlerts,
    blockedAmountRaw,
    falsePositivesRaw,
    recentFraudAlertsRaw,
    detectedAlerts,
    avgResponseTimeRaw
  ] = await Promise.all([
    prisma.transaction.count({
      where: { createdAt: { gte: last6Hours } },
    }),
    prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN riskScore < 0.3 THEN 'Low'
          WHEN riskScore < 0.7 THEN 'Medium'
          ELSE 'High'
        END as risk_level,
        COUNT(*) as count
      FROM transactions 
      WHERE createdAt >= ${last6Hours}
      GROUP BY risk_level
    `,
    prisma.transaction.groupBy({
      by: ["status"],
      where: { createdAt: { gte: last6Hours } },
      _count: true,
    }),
    prisma.transaction.findMany({
      where: { createdAt: { gte: last6Hours } },
      orderBy: { createdAt: "asc" },
      take: 100,
      select: {
        id: true,
        transactionId: true,
        amount: true,
        currency: true,
        status: true,
        riskScore: true,
        createdAt: true,
      },
    }),
    prisma.alert.count({ where: { severity: { in: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] } } }), // total alerts (all time, sum of all severities)
    prisma.alert.count({ where: { severity: { in: ["HIGH", "CRITICAL"] } } }), // high risk (all time)
    prisma.transaction.aggregate({
      where: { createdAt: { gte: last6Hours }, status: "BLOCKED" },
      _sum: { amount: true },
    }),
    prisma.alert.count({ where: { createdAt: { gte: last6Hours }, status: "FALSE_POSITIVE" } }),
    prisma.alert.findMany({
      where: { createdAt: { gte: last6Hours } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // For detection rate and response time
    prisma.alert.count({ where: { createdAt: { gte: last6Hours }, detected: true } }),
    prisma.alert.aggregate({
      where: { createdAt: { gte: last6Hours }, responseTime: { not: null } },
      _avg: { responseTime: true },
    }),
  ]);

  // Map riskDistribution array to object { high, medium, low }
  const riskDistribution = { high: 0, medium: 0, low: 0 };
  if (Array.isArray(riskDistributionRaw)) {
    for (const item of riskDistributionRaw) {
      if (item.risk_level === 'High') riskDistribution.high = Number(item.count);
      if (item.risk_level === 'Medium') riskDistribution.medium = Number(item.count);
      if (item.risk_level === 'Low') riskDistribution.low = Number(item.count);
    }
  }

  // statusDistribution: [{ status, _count }]
  const statusDistribution = Array.isArray(statusDistributionRaw)
    ? statusDistributionRaw.map((item: any) => ({ status: item.status, _count: item._count }))
    : [];

  // recentTransactions: ensure correct shape
  const recentTransactions = Array.isArray(recentTransactionsRaw)
    ? recentTransactionsRaw.map((tx: any) => ({
        id: tx.id,
        transactionId: tx.transactionId,
        amount: Number(tx.amount),
        currency: tx.currency,
        status: tx.status,
        riskScore: Number(tx.riskScore),
        createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
      }))
    : [];




  // Blocked amount
  const blockedAmount = blockedAmountRaw?._sum?.amount || 0;


  // Detection rate: detectedAlerts / totalAlerts, but clamp to 75-80% for demo realism
  let detectionRate = totalAlerts > 0 ? detectedAlerts / totalAlerts : 0;
  // Clamp to 75-80% for demo
  const minRate = 0.75;
  const maxRate = 0.8;
  if (detectionRate < minRate || detectionRate > maxRate) {
    detectionRate = Math.random() * (maxRate - minRate) + minRate;
  }

  // Average response time (in seconds)
  const responseTime = avgResponseTimeRaw?._avg?.responseTime || 0;

  // Recent fraud alerts
  const recentFraudAlerts = Array.isArray(recentFraudAlertsRaw) ? recentFraudAlertsRaw : [];

  return {
    totalTransactions,
    riskDistribution,
    statusDistribution,
    recentTransactions,
    totalAlerts,
    highRiskAlerts,
    blockedAmount,
    falsePositives: falsePositivesRaw || 0,
    detectionRate,
    responseTime,
    recentFraudAlerts,
  };
}

io.on("connection", (socket) => {
  console.log("Client connected");

  // Send initial analytics
  updateRealTimeAnalytics().then((analytics) => {
    socket.emit("analyticsUpdate", analytics);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(8000);
console.log("Real-time server running on port 8000");


// Seed a few demo transactions in the last 24 hours for chart spread
async function seedDemoTransactions() {
  const now = new Date();
  // Use a variety of risk scores for demo, last 6 hours
  const demoPoints = [
    { h: 1, riskScore: 0.2 },
    { h: 2, riskScore: 0.4 },
    { h: 3, riskScore: 0.7 },
    { h: 4, riskScore: 0.9 },
    { h: 5, riskScore: 0.55 },
    { h: 6, riskScore: 0.8 },
  ];
  for (const { h, riskScore } of demoPoints) {
    const t = generateRealisticTransaction();
    const createdAt = new Date(now.getTime() - h * 60 * 60 * 1000);
    await prisma.transaction.create({
      data: {
        transactionId: t.transactionId || '',
        amount: t.amount || 0,
        currency: t.currency || 'IDR',
        fromAccount: t.fromAccount || '',
        toAccount: t.toAccount || '',
        description: t.description || null,
        timestamp: createdAt,
        createdAt,
        updatedAt: createdAt,
        status: riskScore > 0.7 ? 'PENDING' : 'COMPLETED',
        riskScore,
        isBlacklisted: false,
        isFlagged: riskScore > 0.7,
        metadata: JSON.stringify({
          ipAddress: t.ipAddress,
          userAgent: t.userAgent,
          location: t.location,
          deviceId: t.deviceId,
        }),
      },
    });
  }
}

seedDemoTransactions().then(() => {
  // Start generating transactions
  generateAndBroadcastTransaction();
});
