#!/usr/bin/env node

// Simple test script to verify database connection
const { PrismaClient } = require("@prisma/client");

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Count records
    const users = await prisma.user.count();
    const transactions = await prisma.transaction.count();
    const alerts = await prisma.alert.count();

    console.log("📊 Database Stats:");
    console.log(`   Users: ${users}`);
    console.log(`   Transactions: ${transactions}`);
    console.log(`   Alerts: ${alerts}`);

    // Test a user query
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      console.log(`👤 First user: ${firstUser.email} (${firstUser.role})`);
    }

    console.log("🎉 All tests passed! Your backend is ready.");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
