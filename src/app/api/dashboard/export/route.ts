import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { format, subDays } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      exportType = "recent_alerts",
      format: exportFormat = "csv",
      limit = 100,
      includeMetadata = false,
    } = body;

    let exportData: any = {};

    if (exportType === "recent_alerts" || exportType === "all") {
      const recentAlerts = await prisma.alert.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          transaction: true,
          assignedUser: true,
        },
      });

      exportData.recentAlerts = recentAlerts.map((alert) => ({
        "Alert ID": alert.alertId,
        Title: alert.title,
        Type: alert.alertType,
        Severity: alert.severity,
        Status: alert.status,
        "Risk Score": alert.riskScore,
        Priority: alert.priority,
        Category: alert.category,
        "Assigned To": alert.assignedUser
          ? `${alert.assignedUser.firstName} ${alert.assignedUser.lastName}`
          : "Unassigned",
        "Transaction ID": alert.transaction?.transactionId || "N/A",
        "Transaction Amount": alert.transaction?.amount || 0,
        "Detected At": format(
          new Date(alert.detectedAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
        "Created At": format(new Date(alert.createdAt), "yyyy-MM-dd HH:mm:ss"),
      }));
    }

    if (exportType === "system_metrics" || exportType === "all") {
      const now = new Date();
      const last24h = subDays(now, 1);
      const last7d = subDays(now, 7);
      const last30d = subDays(now, 30);

      // Get system metrics
      const metrics = await Promise.all([
        // 24 hour metrics
        prisma.alert.count({ where: { createdAt: { gte: last24h } } }),
        prisma.transaction.count({ where: { createdAt: { gte: last24h } } }),
        prisma.investigation.count({ where: { createdAt: { gte: last24h } } }),

        // 7 day metrics
        prisma.alert.count({ where: { createdAt: { gte: last7d } } }),
        prisma.transaction.count({ where: { createdAt: { gte: last7d } } }),

        // 30 day metrics
        prisma.alert.count({ where: { createdAt: { gte: last30d } } }),
        prisma.transaction.count({ where: { createdAt: { gte: last30d } } }),

        // Status counts
        prisma.alert.groupBy({
          by: ["status"],
          _count: { status: true },
        }),

        // Severity counts
        prisma.alert.groupBy({
          by: ["severity"],
          _count: { severity: true },
        }),
      ]);

      exportData.systemMetrics = {
        "Last 24 Hours": {
          Alerts: metrics[0],
          Transactions: metrics[1],
          Investigations: metrics[2],
        },
        "Last 7 Days": {
          Alerts: metrics[3],
          Transactions: metrics[4],
        },
        "Last 30 Days": {
          Alerts: metrics[5],
          Transactions: metrics[6],
        },
        "Alert Status Distribution": metrics[7].map((item: any) => ({
          status: item.status,
          count: item._count.status,
        })),
        "Alert Severity Distribution": metrics[8].map((item: any) => ({
          severity: item.severity,
          count: item._count.severity,
        })),
      };
    }

    if (exportType === "performance_data" || exportType === "all") {
      // Get performance metrics
      const performanceData = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as totalAlerts,
          SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolvedAlerts,
          AVG(riskScore) as avgRiskScore,
          SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) as criticalAlerts
        FROM alerts 
        WHERE createdAt >= ${subDays(new Date(), 30)}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `;

      exportData.performanceData = performanceData;
    }

    if (exportType === "user_activity" || exportType === "all") {
      // Get user activity metrics
      const userActivity = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              assignedAlerts: true,
              investigations: true,
            },
          },
        },
      });

      exportData.userActivity = userActivity.map((user) => ({
        "User ID": user.id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Role: user.role,
        Status: user.isActive ? "Active" : "Inactive",
        "Assigned Alerts": user._count.assignedAlerts,
        Investigations: user._count.investigations,
        "Created At": format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss"),
      }));
    }

    // Add export metadata
    const finalData = {
      metadata: {
        exportType,
        exportedAt: new Date().toISOString(),
        exportedBy: session.user.email || session.user.username,
        recordCount: Object.values(exportData).flat().length,
        format: exportFormat,
      },
      ...(includeMetadata ? { exportData } : exportData),
    };

    // Generate CSV format
    if (exportFormat === "csv") {
      let csvContent = "";

      // Export recent alerts
      if (exportData.recentAlerts) {
        csvContent += "Recent Alerts\n";
        const headers = Object.keys(exportData.recentAlerts[0] || {});
        csvContent += headers.join(",") + "\n";
        exportData.recentAlerts.forEach((alert: any) => {
          csvContent +=
            headers
              .map((header) => {
                const val = alert[header];
                return typeof val === "string" && val.includes(",")
                  ? `"${val}"`
                  : val;
              })
              .join(",") + "\n";
        });
        csvContent += "\n";
      }

      // Export system metrics
      if (exportData.systemMetrics) {
        csvContent += "System Metrics\n";
        csvContent += "Metric,Period,Value\n";

        Object.entries(exportData.systemMetrics).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item: any) => {
              csvContent += `${key},${Object.keys(item)[0]},${
                Object.values(item)[0]
              }\n`;
            });
          } else if (typeof value === "object") {
            Object.entries(value).forEach(([subKey, subValue]) => {
              csvContent += `${key},${subKey},${subValue}\n`;
            });
          }
        });
        csvContent += "\n";
      }

      // Export performance data
      if (exportData.performanceData) {
        csvContent += "Performance Data\n";
        csvContent +=
          "Date,Total Alerts,Resolved Alerts,Avg Risk Score,Critical Alerts\n";
        exportData.performanceData.forEach((perf: any) => {
          csvContent += `${perf.date},${perf.totalAlerts},${perf.resolvedAlerts},${perf.avgRiskScore},${perf.criticalAlerts}\n`;
        });
        csvContent += "\n";
      }

      // Export user activity
      if (exportData.userActivity) {
        csvContent += "User Activity\n";
        const userHeaders = Object.keys(exportData.userActivity[0] || {});
        csvContent += userHeaders.join(",") + "\n";
        exportData.userActivity.forEach((user: any) => {
          csvContent +=
            userHeaders
              .map((header) => {
                const val = user[header];
                return typeof val === "string" && val.includes(",")
                  ? `"${val}"`
                  : val;
              })
              .join(",") + "\n";
        });
      }

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="dashboard_export_${exportType}_${format(
            new Date(),
            "yyyy-MM-dd_HH-mm"
          )}.csv"`,
        },
      });
    }

    // Default JSON response
    return NextResponse.json(finalData, {
      headers:
        exportFormat === "json"
          ? {
              "Content-Disposition": `attachment; filename="dashboard_export_${exportType}_${format(
                new Date(),
                "yyyy-MM-dd_HH-mm"
              )}.json"`,
            }
          : {},
    });
  } catch (error) {
    console.error("Dashboard export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export dashboard data",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Dashboard Export API",
    supportedExportTypes: [
      "recent_alerts",
      "system_metrics",
      "performance_data",
      "user_activity",
      "all",
    ],
    supportedFormats: ["json", "csv"],
    maxRecords: 1000,
  });
}
