import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";

async function handleGetAnalytics(request: NextRequest, { user }: any) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "7d"; // 7d, 30d, 90d, 1y
    const category = searchParams.get("category");

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get transaction analytics
    const [
      totalTransactions,
      totalAmount,
      averageAmount,
      highRiskTransactions,
      alertStats,
      investigationStats,
      transactionTrends,
      riskDistribution,
    ] = await Promise.all([
      // Total transactions
      prisma.transaction.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total amount
      prisma.transaction.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),

      // Average amount
      prisma.transaction.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _avg: { amount: true },
      }),

      // High risk transactions
      prisma.transaction.count({
        where: {
          createdAt: { gte: startDate },
          riskScore: { gte: 0.7 },
        },
      }),

      // Alert statistics
      prisma.alert.groupBy({
        by: ["severity", "status"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Investigation statistics
      prisma.investigation.groupBy({
        by: ["status", "priority"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Transaction trends (daily)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count,
          SUM(amount) as total_amount,
          AVG(riskScore) as avg_risk_score
        FROM transactions 
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

      // Risk score distribution
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN riskScore < 0.3 THEN 'Low'
            WHEN riskScore < 0.7 THEN 'Medium'
            ELSE 'High'
          END as risk_level,
          COUNT(*) as count
        FROM transactions 
        WHERE createdAt >= ${startDate}
        GROUP BY risk_level
      `,
    ]);

    const analytics = {
      summary: {
        totalTransactions,
        totalAmount: totalAmount._sum.amount || 0,
        averageAmount: averageAmount._avg.amount || 0,
        highRiskTransactions,
        fraudDetectionRate:
          totalTransactions > 0
            ? (highRiskTransactions / totalTransactions) * 100
            : 0,
      },
      alerts: {
        byStatus: alertStats.reduce((acc: any, item: any) => {
          if (!acc[item.status]) acc[item.status] = 0;
          acc[item.status] += item._count;
          return acc;
        }, {}),
        bySeverity: alertStats.reduce((acc: any, item: any) => {
          if (!acc[item.severity]) acc[item.severity] = 0;
          acc[item.severity] += item._count;
          return acc;
        }, {}),
      },
      investigations: {
        byStatus: investigationStats.reduce((acc: any, item: any) => {
          if (!acc[item.status]) acc[item.status] = 0;
          acc[item.status] += item._count;
          return acc;
        }, {}),
        byPriority: investigationStats.reduce((acc: any, item: any) => {
          if (!acc[item.priority]) acc[item.priority] = 0;
          acc[item.priority] += item._count;
          return acc;
        }, {}),
      },
      trends: transactionTrends,
      riskDistribution,
    };

    // Convert BigInt values to string recursively
    function convertBigIntToString(obj: any): any {
      if (typeof obj === 'bigint') return obj.toString();
      if (Array.isArray(obj)) return obj.map(convertBigIntToString);
      if (obj && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = convertBigIntToString(obj[key]);
        }
        return newObj;
      }
      return obj;
    }
    return Response.json(convertBigIntToString(analytics));
  } catch (error) {
    console.error("Get analytics error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = requireAuth(handleGetAnalytics);
