// test-app.js - Quick verification script
const { PrismaClient } = require("@prisma/client");

async function testApplication() {
  console.log("🧪 Testing Guardchain Application Setup...\n");

  const prisma = new PrismaClient();

  try {
    // Test 1: Database Connection
    console.log("1️⃣ Testing Database Connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful\n");

    // Test 2: Check Users
    console.log("2️⃣ Checking User Accounts...");
    const users = await prisma.user.findMany({
      select: { email: true, role: true },
    });
    console.log(`✅ Found ${users.length} users:`);
    users.forEach((user) => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    console.log();

    // Test 3: Check Transactions
    console.log("3️⃣ Checking Transaction Data...");
    const transactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        transactionId: true,
        amount: true,
        riskScore: true,
        status: true,
      },
    });
    console.log(`✅ Found transactions (showing latest 5):`);
    transactions.forEach((tx) => {
      const risk =
        tx.riskScore >= 0.7 ? "🔴" : tx.riskScore >= 0.3 ? "🟡" : "🟢";
      console.log(
        `   ${risk} ${tx.transactionId}: $${tx.amount} (Risk: ${tx.riskScore})`
      );
    });
    console.log();

    // Test 4: Check Alerts
    console.log("4️⃣ Checking Fraud Alerts...");
    const alerts = await prisma.alert.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        severity: true,
        status: true,
      },
    });
    console.log(`✅ Found ${alerts.length} alerts (showing latest 5):`);
    alerts.forEach((alert) => {
      const severity =
        alert.severity === "high"
          ? "🔴"
          : alert.severity === "medium"
          ? "🟡"
          : "🟢";
      console.log(`   ${severity} ${alert.type} - ${alert.status}`);
    });
    console.log();

    // Test 5: Check Investigations
    console.log("5️⃣ Checking Investigations...");
    const investigations = await prisma.investigation.count();
    console.log(`✅ Found ${investigations} investigations\n`);

    // Summary
    console.log("📊 Application Status Summary:");
    console.log("═".repeat(40));
    console.log(`👤 Users: ${users.length} accounts ready`);

    const totalTransactions = await prisma.transaction.count();
    console.log(`💳 Transactions: ${totalTransactions} records`);

    const totalAlerts = await prisma.alert.count();
    console.log(`🚨 Alerts: ${totalAlerts} fraud alerts`);

    console.log(`🔍 Investigations: ${investigations} records`);
    console.log("═".repeat(40));
    console.log("🎉 Application is ready to run!");
    console.log("");
    console.log("🚀 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Open: http://localhost:3000");
    console.log("   3. Login: admin@guardchain.com / admin123");
    console.log("   4. Explore the dashboard!");
  } catch (error) {
    console.error("❌ Error testing application:", error);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("   1. Run: npm run db:generate");
    console.log("   2. Run: npm run db:push");
    console.log("   3. Run: npm run db:seed");
    console.log("   4. Try again: node test-app.js");
  } finally {
    await prisma.$disconnect();
  }
}

testApplication();
