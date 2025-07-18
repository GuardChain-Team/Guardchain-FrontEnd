import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      reportType = "dashboard_summary",
      format: exportFormat = "json",
      dateRange = { from: subDays(new Date(), 30), to: new Date() },
      includeCharts = false,
    } = body;

    const fromDate = startOfDay(new Date(dateRange.from));
    const toDate = endOfDay(new Date(dateRange.to));

    let analyticsData: any = {};

    if (reportType === "dashboard_summary" || reportType === "all") {
      // KPI Metrics
      const totalTransactions = await prisma.transaction.count({
        where: { createdAt: { gte: fromDate, lte: toDate } },
      });

      const totalAlerts = await prisma.alert.count({
        where: { createdAt: { gte: fromDate, lte: toDate } },
      });

      const criticalAlerts = await prisma.alert.count({
        where: {
          createdAt: { gte: fromDate, lte: toDate },
          severity: "CRITICAL",
        },
      });

      const totalInvestigations = await prisma.investigation.count({
        where: { createdAt: { gte: fromDate, lte: toDate } },
      });

      const resolvedAlerts = await prisma.alert.count({
        where: {
          createdAt: { gte: fromDate, lte: toDate },
          status: "RESOLVED",
        },
      });

      analyticsData.kpis = {
        totalTransactions,
        totalAlerts,
        criticalAlerts,
        totalInvestigations,
        resolvedAlerts,
        detectionRate:
          totalTransactions > 0
            ? ((totalAlerts / totalTransactions) * 100).toFixed(2)
            : 0,
        resolutionRate:
          totalAlerts > 0
            ? ((resolvedAlerts / totalAlerts) * 100).toFixed(2)
            : 0,
      };
    }

    if (reportType === "alert_trends" || reportType === "all") {
      // Alert trends by day
      const alertTrends = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as alertCount,
          SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) as criticalCount,
          SUM(CASE WHEN severity = 'HIGH' THEN 1 ELSE 0 END) as highCount,
          SUM(CASE WHEN severity = 'MEDIUM' THEN 1 ELSE 0 END) as mediumCount,
          SUM(CASE WHEN severity = 'LOW' THEN 1 ELSE 0 END) as lowCount
        FROM alerts 
        WHERE createdAt >= ${fromDate} AND createdAt <= ${toDate}
        GROUP BY DATE(createdAt)
        ORDER BY date
      `;

      analyticsData.alertTrends = alertTrends;
    }

    if (reportType === "fraud_types" || reportType === "all") {
      // Fraud type distribution
      const fraudTypes = await prisma.alert.groupBy({
        by: ["alertType"],
        where: {
          createdAt: { gte: fromDate, lte: toDate },
        },
        _count: {
          alertType: true,
        },
      });

      analyticsData.fraudTypes = fraudTypes.map((item) => ({
        type: item.alertType,
        count: item._count.alertType,
      }));
    }

    if (reportType === "risk_distribution" || reportType === "all") {
      // Risk score distribution
      const riskDistribution = await prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN riskScore >= 0.8 THEN 'Very High'
            WHEN riskScore >= 0.6 THEN 'High'
            WHEN riskScore >= 0.4 THEN 'Medium'
            WHEN riskScore >= 0.2 THEN 'Low'
            ELSE 'Very Low'
          END as riskLevel,
          COUNT(*) as count,
          AVG(riskScore) as averageScore
        FROM alerts 
        WHERE createdAt >= ${fromDate} AND createdAt <= ${toDate}
        GROUP BY riskLevel
        ORDER BY averageScore DESC
      `;

      analyticsData.riskDistribution = riskDistribution;
    }

    if (reportType === "performance_metrics" || reportType === "all") {
      // Performance metrics
      const avgResponseTime = await prisma.$queryRaw`
        SELECT AVG(
          CASE 
            WHEN resolvedAt IS NOT NULL 
            THEN (julianday(resolvedAt) - julianday(createdAt)) * 24 * 60
            ELSE NULL 
          END
        ) as avgResponseTimeMinutes
        FROM alerts 
        WHERE createdAt >= ${fromDate} AND createdAt <= ${toDate}
        AND resolvedAt IS NOT NULL
      `;

      const falsePositives = await prisma.alert.count({
        where: {
          createdAt: { gte: fromDate, lte: toDate },
          status: "FALSE_POSITIVE",
        },
      });

      analyticsData.performance = {
        avgResponseTime: avgResponseTime[0]?.avgResponseTimeMinutes || 0,
        falsePositives,
        falsePositiveRate:
          totalAlerts > 0
            ? ((falsePositives / totalAlerts) * 100).toFixed(2)
            : 0,
      };
    }

    // Add metadata
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        exportedBy: session.user.email || session.user.username,
        reportType,
        dateRange: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
        totalRecords: Object.keys(analyticsData).length,
      },
      analytics: analyticsData,
    };

    if (exportFormat === "csv") {
      // Convert analytics data to CSV format
      let csvContent = "";

      // KPIs section
      if (analyticsData.kpis) {
        csvContent += "KPI Metrics\n";
        csvContent += "Metric,Value\n";
        Object.entries(analyticsData.kpis).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
        csvContent += "\n";
      }

      // Alert trends section
      if (analyticsData.alertTrends) {
        csvContent += "Alert Trends\n";
        csvContent += "Date,Total Alerts,Critical,High,Medium,Low\n";
        analyticsData.alertTrends.forEach((trend: any) => {
          csvContent += `${trend.date},${trend.alertCount},${trend.criticalCount},${trend.highCount},${trend.mediumCount},${trend.lowCount}\n`;
        });
        csvContent += "\n";
      }

      // Fraud types section
      if (analyticsData.fraudTypes) {
        csvContent += "Fraud Types Distribution\n";
        csvContent += "Type,Count\n";
        analyticsData.fraudTypes.forEach((item: any) => {
          csvContent += `${item.type},${item.count}\n`;
        });
        csvContent += "\n";
      }

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics_report_${format(
            new Date(),
            "yyyy-MM-dd_HH-mm"
          )}.csv"`,
        },
      });
    }

    // Default JSON response
    return NextResponse.json(exportData, {
      headers:
        exportFormat === "json"
          ? {
              "Content-Disposition": `attachment; filename="analytics_report_${format(
                new Date(),
                "yyyy-MM-dd_HH-mm"
              )}.json"`,
            }
          : {},
    });
  } catch (error) {
    console.error("Analytics export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export analytics data",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Analytics Export API",
    supportedReportTypes: [
      "dashboard_summary",
      "alert_trends",
      "fraud_types",
      "risk_distribution",
      "performance_metrics",
      "all",
    ],
    supportedFormats: ["json", "csv"],
  });
}
