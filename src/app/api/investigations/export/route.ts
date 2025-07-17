import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { format } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    const hasPermission =
      session.user.role === "ADMIN" ||
      session.user.role === "INVESTIGATOR" ||
      session.user.role === "ANALYST";

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      exportType = "investigation_list",
      format: exportFormat = "csv",
      filters = {},
      includeEvidence = false,
      includeLogs = false,
    } = body;

    let exportData: any = {};

    if (exportType === "investigation_list" || exportType === "all") {
      // Build query filters
      let where: any = {};

      if (filters.status && filters.status !== "ALL") {
        where.status = filters.status;
      }

      if (filters.priority && filters.priority !== "ALL") {
        where.priority = filters.priority;
      }

      if (filters.investigatorId) {
        where.investigatorId = filters.investigatorId;
      }

      if (filters.dateRange) {
        where.createdAt = {
          gte: new Date(filters.dateRange.from),
          lte: new Date(filters.dateRange.to),
        };
      }

      const investigations = await prisma.investigation.findMany({
        where,
        include: {
          alert: true,
          investigator: true,
          transaction: true,
          documentation: includeLogs,
          logs: includeLogs
            ? {
                include: { user: true },
                orderBy: { timestamp: "desc" },
              }
            : false,
        },
        orderBy: { createdAt: "desc" },
      });

      exportData.investigations = investigations.map((inv) => ({
        "Investigation ID": inv.id,
        Title: inv.title,
        Description: inv.description,
        Status: inv.status,
        Priority: inv.priority,
        Investigator: `${inv.investigator.firstName} ${inv.investigator.lastName}`,
        "Investigator Email": inv.investigator.email,
        "Alert ID": inv.alert?.alertId || "N/A",
        "Alert Severity": inv.alert?.severity || "N/A",
        "Transaction ID": inv.transaction?.transactionId || "N/A",
        "Transaction Amount": inv.transaction?.amount || 0,
        Findings: inv.findings || "",
        Conclusion: inv.conclusion || "",
        "Created At": format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm:ss"),
        "Updated At": format(new Date(inv.updatedAt), "yyyy-MM-dd HH:mm:ss"),
      }));

      // Add logs if requested
      if (includeLogs) {
        exportData.investigationLogs = investigations.flatMap((inv) =>
          inv.logs.map((log: any) => ({
            "Investigation ID": inv.id,
            "Investigation Title": inv.title,
            "Log ID": log.id,
            Action: log.action,
            Description: log.description,
            "Performed By": `${log.user.firstName} ${log.user.lastName}`,
            Timestamp: format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
            Metadata: log.metadata || "",
          }))
        );
      }
    }

    if (exportType === "evidence_summary" || exportType === "all") {
      // Get evidence data
      const evidence = await prisma.evidence.findMany({
        include: {
          alert: {
            include: {
              investigation: true,
            },
          },
          uploader: true,
        },
        orderBy: { createdAt: "desc" },
      });

      exportData.evidence = evidence.map((ev) => ({
        "Evidence ID": ev.id,
        "File Name": ev.fileName,
        "File Type": ev.fileType,
        "File Size (KB)": Math.round(ev.fileSize / 1024),
        Description: ev.description || "",
        "Alert ID": ev.alert.alertId,
        "Investigation ID": ev.alert.investigation?.id || "N/A",
        "Uploaded By": `${ev.uploader.firstName} ${ev.uploader.lastName}`,
        "Upload Date": format(new Date(ev.createdAt), "yyyy-MM-dd HH:mm:ss"),
        Tags: ev.tags || "",
      }));
    }

    if (exportType === "investigation_stats" || exportType === "all") {
      // Get investigation statistics
      const stats = await Promise.all([
        // Total investigations by status
        prisma.investigation.groupBy({
          by: ["status"],
          _count: { status: true },
        }),

        // Total investigations by priority
        prisma.investigation.groupBy({
          by: ["priority"],
          _count: { priority: true },
        }),

        // Investigations by investigator
        prisma.investigation.groupBy({
          by: ["investigatorId"],
          _count: { investigatorId: true },
        }),

        // Average resolution time
        prisma.$queryRaw`
          SELECT 
            AVG(
              CASE 
                WHEN status IN ('CLOSED', 'RESOLVED') AND updatedAt != createdAt
                THEN (julianday(updatedAt) - julianday(createdAt)) * 24 * 60
                ELSE NULL 
              END
            ) as avgResolutionTimeMinutes
          FROM investigations
        `,
      ]);

      // Get investigator names
      const investigators = await prisma.user.findMany({
        where: {
          id: {
            in: stats[2].map((item: any) => item.investigatorId),
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });

      exportData.investigationStats = {
        statusDistribution: stats[0].map((item: any) => ({
          status: item.status,
          count: item._count.status,
        })),
        priorityDistribution: stats[1].map((item: any) => ({
          priority: item.priority,
          count: item._count.priority,
        })),
        investigatorWorkload: stats[2].map((item: any) => {
          const investigator = investigators.find(
            (inv) => inv.id === item.investigatorId
          );
          return {
            investigator: investigator
              ? `${investigator.firstName} ${investigator.lastName}`
              : "Unknown",
            investigatorId: item.investigatorId,
            activeInvestigations: item._count.investigatorId,
          };
        }),
        avgResolutionTime: stats[3][0]?.avgResolutionTimeMinutes || 0,
      };
    }

    // Add metadata
    const finalData = {
      metadata: {
        exportType,
        exportedAt: new Date().toISOString(),
        exportedBy: session.user.email || "Unknown User",
        totalRecords: Object.values(exportData).flat().length,
        filters,
        format: exportFormat,
      },
      data: exportData,
    };

    // Generate CSV format
    if (exportFormat === "csv") {
      let csvContent = "";

      // Export investigations
      if (exportData.investigations) {
        csvContent += "Investigations\n";
        const headers = Object.keys(exportData.investigations[0] || {});
        csvContent += headers.join(",") + "\n";
        exportData.investigations.forEach((inv: any) => {
          csvContent +=
            headers
              .map((header) => {
                const val = inv[header];
                return typeof val === "string" && val.includes(",")
                  ? `"${val}"`
                  : val;
              })
              .join(",") + "\n";
        });
        csvContent += "\n";
      }

      // Export investigation logs
      if (exportData.investigationLogs) {
        csvContent += "Investigation Logs\n";
        const logHeaders = Object.keys(exportData.investigationLogs[0] || {});
        csvContent += logHeaders.join(",") + "\n";
        exportData.investigationLogs.forEach((log: any) => {
          csvContent +=
            logHeaders
              .map((header) => {
                const val = log[header];
                return typeof val === "string" && val.includes(",")
                  ? `"${val}"`
                  : val;
              })
              .join(",") + "\n";
        });
        csvContent += "\n";
      }

      // Export evidence
      if (exportData.evidence) {
        csvContent += "Evidence\n";
        const evidenceHeaders = Object.keys(exportData.evidence[0] || {});
        csvContent += evidenceHeaders.join(",") + "\n";
        exportData.evidence.forEach((ev: any) => {
          csvContent +=
            evidenceHeaders
              .map((header) => {
                const val = ev[header];
                return typeof val === "string" && val.includes(",")
                  ? `"${val}"`
                  : val;
              })
              .join(",") + "\n";
        });
        csvContent += "\n";
      }

      // Export statistics
      if (exportData.investigationStats) {
        csvContent += "Investigation Statistics\n";
        csvContent += "Status Distribution\n";
        csvContent += "Status,Count\n";
        exportData.investigationStats.statusDistribution.forEach(
          (item: any) => {
            csvContent += `${item.status},${item.count}\n`;
          }
        );
        csvContent += "\n";

        csvContent += "Priority Distribution\n";
        csvContent += "Priority,Count\n";
        exportData.investigationStats.priorityDistribution.forEach(
          (item: any) => {
            csvContent += `${item.priority},${item.count}\n`;
          }
        );
        csvContent += "\n";

        csvContent += "Investigator Workload\n";
        csvContent += "Investigator,Active Investigations\n";
        exportData.investigationStats.investigatorWorkload.forEach(
          (item: any) => {
            csvContent += `"${item.investigator}",${item.activeInvestigations}\n`;
          }
        );
        csvContent += "\n";

        csvContent += `Average Resolution Time (minutes),${exportData.investigationStats.avgResolutionTime}\n`;
      }

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="investigation_export_${exportType}_${format(
            new Date(),
            "yyyy-MM-dd_HH-mm"
          )}.csv"`,
        },
      });
    }

    // Log the export activity
    await prisma.auditLog.create({
      data: {
        action: "INVESTIGATION_DATA_EXPORTED",
        entityType: "INVESTIGATION",
        entityId: "BULK_EXPORT",
        userId: session.user.id,
        details: JSON.stringify({
          exportType,
          format: exportFormat,
          recordCount: Object.values(exportData).flat().length,
          filters,
        }),
      },
    });

    // Default JSON response
    return NextResponse.json(finalData, {
      headers:
        exportFormat === "json"
          ? {
              "Content-Disposition": `attachment; filename="investigation_export_${exportType}_${format(
                new Date(),
                "yyyy-MM-dd_HH-mm"
              )}.json"`,
            }
          : {},
    });
  } catch (error) {
    console.error("Investigation export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export investigation data",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Investigation Export API",
    supportedExportTypes: [
      "investigation_list",
      "evidence_summary",
      "investigation_stats",
      "all",
    ],
    supportedFormats: ["json", "csv"],
    supportedFilters: ["status", "priority", "investigatorId", "dateRange"],
    requiredPermissions: ["ADMIN", "INVESTIGATOR", "ANALYST"],
  });
}
