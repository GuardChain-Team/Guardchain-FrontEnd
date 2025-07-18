// src/app/api/analytics/risk-distribution/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get risk score distribution for alerts
    const alertRiskDistribution = await getAlertRiskDistribution(
      startDate,
      endDate
    );

    // Get risk score distribution for transactions
    const transactionRiskDistribution = await getTransactionRiskDistribution(
      startDate,
      endDate
    );

    // Get severity breakdown with risk score ranges
    const severityBreakdown = await getSeverityRiskBreakdown(
      startDate,
      endDate
    );

    // Get geographic risk distribution
    const geographicDistribution = await getGeographicRiskDistribution(
      startDate,
      endDate
    );

    // Get risk score trends over time
    const riskTrends = await getRiskScoreTrends(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        alertRiskDistribution,
        transactionRiskDistribution,
        severityBreakdown,
        geographicDistribution,
        riskTrends,
        timeRange: {
          start: startDate,
          end: endDate,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching risk distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk distribution" },
      { status: 500 }
    );
  }
}

async function getAlertRiskDistribution(startDate: Date, endDate: Date) {
  const riskBuckets = [
    { min: 0.0, max: 0.2, label: "Very Low Risk" },
    { min: 0.2, max: 0.4, label: "Low Risk" },
    { min: 0.4, max: 0.6, label: "Medium Risk" },
    { min: 0.6, max: 0.8, label: "High Risk" },
    { min: 0.8, max: 1.0, label: "Critical Risk" },
  ];

  const distribution = await Promise.all(
    riskBuckets.map(async (bucket) => {
      const count = await prisma.alert.count({
        where: {
          detectedAt: {
            gte: startDate,
            lte: endDate,
          },
          riskScore: {
            gte: bucket.min,
            lt: bucket.max,
          },
        },
      });

      const avgScore = await prisma.alert.aggregate({
        where: {
          detectedAt: {
            gte: startDate,
            lte: endDate,
          },
          riskScore: {
            gte: bucket.min,
            lt: bucket.max,
          },
        },
        _avg: {
          riskScore: true,
        },
      });

      return {
        range: `${bucket.min}-${bucket.max}`,
        label: bucket.label,
        count,
        avgRiskScore: avgScore._avg.riskScore || 0,
        minRisk: bucket.min,
        maxRisk: bucket.max,
      };
    })
  );

  return distribution;
}

async function getTransactionRiskDistribution(startDate: Date, endDate: Date) {
  const riskBuckets = [
    { min: 0.0, max: 0.2, label: "Very Low Risk" },
    { min: 0.2, max: 0.4, label: "Low Risk" },
    { min: 0.4, max: 0.6, label: "Medium Risk" },
    { min: 0.6, max: 0.8, label: "High Risk" },
    { min: 0.8, max: 1.0, label: "Critical Risk" },
  ];

  const distribution = await Promise.all(
    riskBuckets.map(async (bucket) => {
      const result = await prisma.transaction.aggregate({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          riskScore: {
            gte: bucket.min,
            lt: bucket.max,
          },
        },
        _count: true,
        _avg: {
          riskScore: true,
          amount: true,
        },
        _sum: {
          amount: true,
        },
      });

      return {
        range: `${bucket.min}-${bucket.max}`,
        label: bucket.label,
        count: result._count,
        avgRiskScore: result._avg.riskScore || 0,
        avgAmount: result._avg.amount || 0,
        totalAmount: result._sum.amount || 0,
        minRisk: bucket.min,
        maxRisk: bucket.max,
      };
    })
  );

  return distribution;
}

async function getSeverityRiskBreakdown(startDate: Date, endDate: Date) {
  const severityData = await prisma.alert.groupBy({
    by: ["severity"],
    where: {
      detectedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      severity: true,
    },
    _avg: {
      riskScore: true,
    },
    _min: {
      riskScore: true,
    },
    _max: {
      riskScore: true,
    },
  });

  return severityData.map((item) => ({
    severity: item.severity,
    count: item._count.severity,
    avgRiskScore: item._avg.riskScore || 0,
    minRiskScore: item._min.riskScore || 0,
    maxRiskScore: item._max.riskScore || 0,
  }));
}

async function getGeographicRiskDistribution(startDate: Date, endDate: Date) {
  // Get transactions with location data and risk scores
  const locationData = await prisma.$queryRaw`
    SELECT 
      json_extract(location, '$.city') as city,
      json_extract(location, '$.country') as country,
      COUNT(*) as transactionCount,
      AVG(riskScore) as avgRiskScore,
      COUNT(CASE WHEN riskScore > 0.7 THEN 1 END) as highRiskCount,
      SUM(amount) as totalAmount
    FROM Transaction 
    WHERE timestamp >= ${startDate} 
      AND timestamp <= ${endDate}
      AND location IS NOT NULL
      AND riskScore IS NOT NULL
    GROUP BY city, country
    ORDER BY avgRiskScore DESC
    LIMIT 20
  `;

  return locationData;
}

async function getRiskScoreTrends(startDate: Date, endDate: Date) {
  const trends = await prisma.$queryRaw`
    SELECT 
      date(timestamp) as date,
      AVG(riskScore) as avgRiskScore,
      MIN(riskScore) as minRiskScore,
      MAX(riskScore) as maxRiskScore,
      COUNT(*) as transactionCount,
      COUNT(CASE WHEN riskScore > 0.7 THEN 1 END) as highRiskCount
    FROM Transaction 
    WHERE timestamp >= ${startDate} 
      AND timestamp <= ${endDate}
      AND riskScore IS NOT NULL
    GROUP BY date(timestamp)
    ORDER BY date
  `;

  return trends;
}
