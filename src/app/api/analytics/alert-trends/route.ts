// src/app/api/analytics/alert-trends/route.ts
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
    const groupBy = searchParams.get("groupBy") || "day";

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

    // Get alert trends by time
    const alertTrends = await getAlertTrends(startDate, endDate, groupBy);

    // Get severity distribution
    const severityDistribution = await getSeverityDistribution(
      startDate,
      endDate
    );

    // Get alert type breakdown
    const alertTypeBreakdown = await getAlertTypeBreakdown(startDate, endDate);

    // Get resolution rate trends
    const resolutionTrends = await getResolutionTrends(
      startDate,
      endDate,
      groupBy
    );

    // Get top risk factors
    const topRiskFactors = await getTopRiskFactors(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        alertTrends,
        severityDistribution,
        alertTypeBreakdown,
        resolutionTrends,
        topRiskFactors,
        timeRange: {
          start: startDate,
          end: endDate,
          groupBy,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching alert trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch alert trends" },
      { status: 500 }
    );
  }
}

async function getAlertTrends(startDate: Date, endDate: Date, groupBy: string) {
  const dateFormat =
    groupBy === "hour"
      ? "%Y-%m-%d %H:00:00"
      : groupBy === "day"
      ? "%Y-%m-%d"
      : "%Y-%m";

  const alerts = await prisma.$queryRaw`
    SELECT 
      strftime(${dateFormat}, detectedAt) as period,
      COUNT(*) as alertCount,
      AVG(riskScore) as avgRiskScore,
      COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as criticalCount,
      COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as highCount,
      COUNT(CASE WHEN severity = 'MEDIUM' THEN 1 END) as mediumCount,
      COUNT(CASE WHEN severity = 'LOW' THEN 1 END) as lowCount
    FROM Alert 
    WHERE detectedAt >= ${startDate} AND detectedAt <= ${endDate}
    GROUP BY period
    ORDER BY period
  `;

  return alerts;
}

async function getSeverityDistribution(startDate: Date, endDate: Date) {
  const distribution = await prisma.alert.groupBy({
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
  });

  return distribution.map((item) => ({
    severity: item.severity,
    count: item._count.severity,
    avgRiskScore: item._avg.riskScore,
    percentage: 0, // Will be calculated on frontend
  }));
}

async function getAlertTypeBreakdown(startDate: Date, endDate: Date) {
  const breakdown = await prisma.alert.groupBy({
    by: ["alertType"],
    where: {
      detectedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      alertType: true,
    },
    _avg: {
      riskScore: true,
    },
  });

  return breakdown.map((item) => ({
    alertType: item.alertType,
    count: item._count.alertType,
    avgRiskScore: item._avg.riskScore,
  }));
}

async function getResolutionTrends(
  startDate: Date,
  endDate: Date,
  groupBy: string
) {
  const dateFormat =
    groupBy === "hour"
      ? "%Y-%m-%d %H:00:00"
      : groupBy === "day"
      ? "%Y-%m-%d"
      : "%Y-%m";

  const resolutionTrends = await prisma.$queryRaw`
    SELECT 
      strftime(${dateFormat}, resolvedAt) as period,
      COUNT(*) as resolvedCount,
      AVG(julianday(resolvedAt) - julianday(detectedAt)) * 24 as avgResolutionTimeHours,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as truePositives,
      COUNT(CASE WHEN status = 'FALSE_POSITIVE' THEN 1 END) as falsePositives
    FROM Alert 
    WHERE resolvedAt >= ${startDate} AND resolvedAt <= ${endDate}
    GROUP BY period
    ORDER BY period
  `;

  return resolutionTrends;
}

async function getTopRiskFactors(startDate: Date, endDate: Date) {
  // This would require parsing the riskFactors JSON field
  // For now, return mock data that would come from ML analysis
  return [
    {
      factor: "High Transaction Amount",
      frequency: 156,
      avgRiskIncrease: 0.34,
    },
    { factor: "Unusual Location", frequency: 89, avgRiskIncrease: 0.28 },
    { factor: "Off-hours Activity", frequency: 67, avgRiskIncrease: 0.22 },
    {
      factor: "Multiple Failed Attempts",
      frequency: 45,
      avgRiskIncrease: 0.41,
    },
    { factor: "New Device", frequency: 34, avgRiskIncrease: 0.19 },
  ];
}
