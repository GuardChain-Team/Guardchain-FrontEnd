// Script to trigger a high-risk transaction for real-time alert demo
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function triggerHighRiskTransaction() {
  const now = new Date();
  const transaction = await prisma.transaction.create({
    data: {
      transactionId: `DEMO-HIGH-RISK-${now.getTime()}`,
      amount: 10000000,
      currency: 'IDR',
      fromAccount: 'DEMO-ACCOUNT-1',
      toAccount: 'DEMO-ACCOUNT-2',
      description: 'Demo high risk transaction',
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      timestamp: now,
      riskScore: 0.9,
    },
  });
  console.log('Inserted high-risk transaction:', transaction);
}

triggerHighRiskTransaction().then(() => process.exit(0));
