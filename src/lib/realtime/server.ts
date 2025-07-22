import { Server } from "socket.io";
import { createServer } from "http";
import { generateRealisticTransaction } from "../utils/transaction-generator";
import { calculateRiskScore } from "../utils/risk-calculator";
import { prisma } from "../database/prisma";
import type { TransactionInput } from "@/types/models";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

console.log("🚀 Starting GuardChain realtime server...");

// Increased frequency for more realistic real-time data
const MIN_INTERVAL = 800; // 0.8 seconds
const MAX_INTERVAL = 2000; // 2 seconds

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

async function updateRealTimeAnalytics() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Get various analytics data
  const [totalTransactions, riskDistribution, alertTrends, recentAlerts] =
    await Promise.all([
      prisma.transaction.count({
        where: { createdAt: { gte: last24Hours } },
      }),
      prisma.transaction.groupBy({
        by: ["status"],
        where: { createdAt: { gte: last24Hours } },
        _count: true,
      }),
      prisma.alert.groupBy({
        by: ["severity"],
        where: { createdAt: { gte: last24Hours } },
        _count: true,
      }),
      prisma.alert.findMany({
        where: { createdAt: { gte: last24Hours } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { transaction: true },
      }),
    ]);

  return {
    totalTransactions,
    riskDistribution,
    alertTrends,
    recentAlerts,
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

// Start generating transactions
generateAndBroadcastTransaction();
