#!/usr/bin/env node

// Test metadata handling in database
const { PrismaClient } = require("@prisma/client");

async function testMetadata() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Testing metadata handling...");

    // Test transaction metadata
    const transaction = await prisma.transaction.findFirst({
      where: {
        metadata: { not: null },
      },
    });

    if (transaction && transaction.metadata) {
      console.log("✅ Transaction metadata stored as string");
      console.log(
        "   Raw metadata:",
        transaction.metadata.substring(0, 100) + "..."
      );

      try {
        const parsed = JSON.parse(transaction.metadata);
        console.log("✅ Transaction metadata parses correctly:", parsed);
      } catch (e) {
        console.error("❌ Failed to parse transaction metadata:", e.message);
      }
    }

    // Test alert metadata
    const alert = await prisma.alert.findFirst({
      where: {
        metadata: { not: null },
      },
    });

    if (alert && alert.metadata) {
      console.log("✅ Alert metadata stored as string");
      console.log("   Raw metadata:", alert.metadata.substring(0, 100) + "...");

      try {
        const parsed = JSON.parse(alert.metadata);
        console.log("✅ Alert metadata parses correctly:", parsed);
      } catch (e) {
        console.error("❌ Failed to parse alert metadata:", e.message);
      }
    }

    console.log("🎉 Metadata handling test completed!");
  } catch (error) {
    console.error("❌ Metadata test failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testMetadata();
