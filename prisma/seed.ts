import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@guardchain.com" },
    update: {},
    create: {
      email: "admin@guardchain.com",
      username: "admin",
      password: adminPassword,
      firstName: "System",
      lastName: "Administrator",
      role: "ADMIN",
    },
  });

  // Create investigator user
  const investigatorPassword = await hashPassword("investigator123");
  const investigator = await prisma.user.upsert({
    where: { email: "investigator@guardchain.com" },
    update: {},
    create: {
      email: "investigator@guardchain.com",
      username: "investigator",
      password: investigatorPassword,
      firstName: "John",
      lastName: "Investigator",
      role: "INVESTIGATOR",
    },
  });

  // Create analyst user
  const analystPassword = await hashPassword("analyst123");
  const analyst = await prisma.user.upsert({
    where: { email: "analyst@guardchain.com" },
    update: {},
    create: {
      email: "analyst@guardchain.com",
      username: "analyst",
      password: analystPassword,
      firstName: "Jane",
      lastName: "Analyst",
      role: "ANALYST",
    },
  });

  console.log("Created users:", { admin, investigator, analyst });

  // Create sample transactions
  const transactions = [];
  for (let i = 1; i <= 50; i++) {
    const amount = Math.random() * 100000;
    const riskScore = Math.random();
    const timestamp = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Last 30 days

    const transaction = await prisma.transaction.create({
      data: {
        transactionId: `TXN-${Date.now()}-${i}`,
        amount,
        currency: "USD",
        fromAccount: `ACC-${Math.floor(Math.random() * 10000)}`,
        toAccount: `ACC-${Math.floor(Math.random() * 10000)}`,
        description: `Sample transaction ${i}`,
        timestamp,
        status: ["PENDING", "COMPLETED", "FAILED"][
          Math.floor(Math.random() * 3)
        ] as any,
        riskScore,
        isFlagged: riskScore > 0.7,
        metadata: JSON.stringify({
          channel: ["online", "mobile", "atm"][Math.floor(Math.random() * 3)],
          location: ["New York", "London", "Tokyo"][
            Math.floor(Math.random() * 3)
          ],
        }),
      },
    });

    transactions.push(transaction);

    // Create alerts for high-risk transactions
    if (riskScore > 0.7) {
      await prisma.alert.create({
        data: {
          title: `High-risk transaction detected`,
          description: `Transaction ${
            transaction.transactionId
          } has a risk score of ${riskScore.toFixed(2)}`,
          severity: riskScore > 0.9 ? "CRITICAL" : "HIGH",
          riskScore,
          category: "FRAUD_DETECTION",
          transactionId: transaction.id,
          assignedToId: [investigator.id, analyst.id][
            Math.floor(Math.random() * 2)
          ],
          metadata: JSON.stringify({
            amount: transaction.amount,
            fromAccount: transaction.fromAccount,
            toAccount: transaction.toAccount,
          }),
        },
      });
    }
  }

  console.log(`Created ${transactions.length} transactions`);

  // Create sample investigations
  const alerts = await prisma.alert.findMany({ take: 10 });
  for (const alert of alerts) {
    await prisma.investigation.upsert({
      where: { alertId: alert.id },
      update: {},
      create: {
        title: `Investigation for Alert ${alert.id}`,
        description: `Investigating ${alert.title}`,
        status: ["OPEN", "IN_PROGRESS", "CLOSED"][
          Math.floor(Math.random() * 3)
        ] as any,
        priority: ["LOW", "MEDIUM", "HIGH", "URGENT"][
          Math.floor(Math.random() * 4)
        ] as any,
        alertId: alert.id,
        investigatorId: investigator.id,
        transactionId: alert.transactionId,
      },
    });
  }

  console.log("Created sample investigations");

  // Create sample blacklist entries
  const blacklistEntries = [
    {
      type: "ACCOUNT",
      value: "ACC-SUSPICIOUS-001",
      reason: "Suspicious activity detected",
      addedBy: admin.id,
    },
    {
      type: "EMAIL",
      value: "suspicious@example.com",
      reason: "Associated with fraudulent activities",
      addedBy: admin.id,
    },
    {
      type: "IP_ADDRESS",
      value: "192.168.1.100",
      reason: "Multiple failed login attempts",
      addedBy: admin.id,
    },
  ];

  for (const entry of blacklistEntries) {
    await prisma.blacklistEntry.upsert({
      where: { value: entry.value },
      update: {},
      create: entry,
    });
  }

  console.log("Created blacklist entries");

  // Create sample analytics data
  const analyticsData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    analyticsData.push(
      {
        metric: "daily_transactions",
        value: Math.floor(Math.random() * 100) + 50,
        timestamp: date,
        category: "transactions",
        subcategory: "count",
      },
      {
        metric: "daily_fraud_alerts",
        value: Math.floor(Math.random() * 20) + 5,
        timestamp: date,
        category: "fraud",
        subcategory: "alerts",
      },
      {
        metric: "average_risk_score",
        value: Math.random() * 0.5 + 0.2, // 0.2 to 0.7
        timestamp: date,
        category: "risk",
        subcategory: "score",
      }
    );
  }

  await prisma.analytics.createMany({
    data: analyticsData,
  });

  console.log("Created analytics data");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
