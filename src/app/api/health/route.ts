import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const transactionCount = await prisma.transaction.count();
    const alertCount = await prisma.alert.count();

    return NextResponse.json({
      status: "healthy",
      message: "GuardChain Backend is running successfully!",
      database: "connected",
      timestamp: new Date().toISOString(),
      stats: {
        users: userCount,
        transactions: transactionCount,
        alerts: alertCount,
      },
      endpoints: {
        auth: [
          "POST /api/auth/register",
          "POST /api/auth/login",
          "POST /api/auth/logout",
          "GET /api/auth/me",
        ],
        transactions: [
          "GET /api/transactions",
          "POST /api/transactions",
          "GET /api/transactions/[id]",
          "PUT /api/transactions/[id]",
        ],
        fraud: [
          "GET /api/fraud/alerts",
          "POST /api/fraud/alerts",
          "GET /api/fraud/alerts/[id]",
          "PUT /api/fraud/alerts/[id]",
          "GET /api/fraud/investigations",
          "POST /api/fraud/investigations",
        ],
        analytics: ["GET /api/analytics"],
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
