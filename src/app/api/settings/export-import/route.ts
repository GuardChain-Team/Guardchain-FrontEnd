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

    // Check admin permissions for settings export
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      action = "export", // 'export' or 'import'
      exportType = "user_settings",
      format: exportFormat = "json",
      includePasswords = false,
      settingsData = null, // for import
    } = body;

    if (action === "export") {
      let exportData: any = {};

      if (exportType === "user_settings" || exportType === "all") {
        // Export user settings (without sensitive data)
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            // Don't include password by default
            ...(includePasswords && { password: true }),
          },
        });

        exportData.users = users.map((user) => ({
          "User ID": user.id,
          Email: user.email,
          "First Name": user.firstName,
          "Last Name": user.lastName,
          Role: user.role,
          Status: user.isActive ? "Active" : "Inactive",
          "Created At": format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss"),
          "Updated At": format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm:ss"),
          ...(includePasswords && { "Password Hash": user.password }),
        }));
      }

      if (exportType === "system_config" || exportType === "all") {
        // Export system configuration (mock data - in real app this would come from config table)
        exportData.systemConfig = {
          alertSettings: {
            riskThresholds: {
              low: 0.3,
              medium: 0.6,
              high: 0.8,
              critical: 0.9,
            },
            autoAssignment: true,
            emailNotifications: true,
            smsNotifications: false,
            notificationDelay: 5, // minutes
          },
          investigationSettings: {
            autoCreateInvestigation: true,
            defaultPriority: "MEDIUM",
            maxConcurrentInvestigations: 10,
            escalationTimeout: 24, // hours
          },
          securitySettings: {
            sessionTimeout: 30, // minutes
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: true,
            },
            maxLoginAttempts: 5,
            lockoutDuration: 15, // minutes
          },
          reportSettings: {
            retentionPeriod: 365, // days
            exportFormats: ["pdf", "csv", "json"],
            maxExportRecords: 10000,
          },
        };
      }

      if (exportType === "audit_config" || exportType === "all") {
        // Export audit log settings
        const auditLogSample = await prisma.auditLog.findMany({
          take: 100,
          orderBy: { timestamp: "desc" },
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        exportData.auditLogs = auditLogSample.map((log) => ({
          "Log ID": log.id,
          Action: log.action,
          "Entity Type": log.entityType,
          "Entity ID": log.entityId,
          User: log.user
            ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})`
            : "System",
          Timestamp: format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
          Details: log.details || "",
        }));
      }

      // Add export metadata
      const finalData = {
        metadata: {
          exportType,
          exportedAt: new Date().toISOString(),
          exportedBy: session.user.email || "Unknown Admin",
          version: "1.0",
          systemInfo: {
            environment: process.env.NODE_ENV || "development",
            platform: "GuardChain Fraud Detection System",
          },
        },
        settings: exportData,
      };

      // Generate CSV format
      if (exportFormat === "csv") {
        let csvContent = "";

        // Export users
        if (exportData.users) {
          csvContent += "Users\n";
          const headers = Object.keys(exportData.users[0] || {});
          csvContent += headers.join(",") + "\n";
          exportData.users.forEach((user: any) => {
            csvContent +=
              headers
                .map((header) => {
                  const val = user[header];
                  return typeof val === "string" && val.includes(",")
                    ? `"${val}"`
                    : val;
                })
                .join(",") + "\n";
          });
          csvContent += "\n";
        }

        // Export system config as key-value pairs
        if (exportData.systemConfig) {
          csvContent += "System Configuration\n";
          csvContent += "Setting Category,Setting Key,Setting Value\n";

          const flattenConfig = (obj: any, prefix = "") => {
            Object.entries(obj).forEach(([key, value]) => {
              const fullKey = prefix ? `${prefix}.${key}` : key;
              if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
              ) {
                flattenConfig(value, fullKey);
              } else {
                csvContent += `"${prefix}","${key}","${value}"\n`;
              }
            });
          };

          flattenConfig(exportData.systemConfig);
          csvContent += "\n";
        }

        // Export audit logs
        if (exportData.auditLogs) {
          csvContent += "Audit Logs (Recent 100)\n";
          const logHeaders = Object.keys(exportData.auditLogs[0] || {});
          csvContent += logHeaders.join(",") + "\n";
          exportData.auditLogs.forEach((log: any) => {
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
        }

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="settings_export_${exportType}_${format(
              new Date(),
              "yyyy-MM-dd_HH-mm"
            )}.csv"`,
          },
        });
      }

      // Log the export
      await prisma.auditLog.create({
        data: {
          action: "SETTINGS_EXPORTED",
          entityType: "SYSTEM_SETTINGS",
          entityId: exportType,
          userId: session.user.id,
          details: JSON.stringify({
            exportType,
            format: exportFormat,
            includePasswords,
            recordCount: Object.values(exportData).flat().length,
          }),
        },
      });

      // Default JSON response
      return NextResponse.json(finalData, {
        headers:
          exportFormat === "json"
            ? {
                "Content-Disposition": `attachment; filename="settings_export_${exportType}_${format(
                  new Date(),
                  "yyyy-MM-dd_HH-mm"
                )}.json"`,
              }
            : {},
      });
    }

    if (action === "import") {
      if (!settingsData) {
        return NextResponse.json(
          { error: "Settings data required for import" },
          { status: 400 }
        );
      }

      // Validate import data structure
      if (!settingsData.metadata || !settingsData.settings) {
        return NextResponse.json(
          { error: "Invalid settings data format" },
          { status: 400 }
        );
      }

      const importResults = {
        usersImported: 0,
        usersSkipped: 0,
        configUpdated: false,
        errors: [],
      };

      // Import users (if provided)
      if (settingsData.settings.users) {
        for (const userData of settingsData.settings.users) {
          try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: userData.Email },
            });

            if (existingUser) {
              importResults.usersSkipped++;
            } else {
              await prisma.user.create({
                data: {
                  email: userData.Email,
                  firstName: userData["First Name"],
                  lastName: userData["Last Name"],
                  role: userData.Role,
                  isActive: userData.Status === "Active",
                  password:
                    userData["Password Hash"] ||
                    "temp_password_change_required",
                },
              });
              importResults.usersImported++;
            }
          } catch (error) {
            importResults.errors.push(
              `Failed to import user ${userData.Email}: ${error}`
            );
          }
        }
      }

      // Import system configuration (would update config table in real implementation)
      if (settingsData.settings.systemConfig) {
        // In a real implementation, this would update a configuration table
        // For now, we'll just log it
        importResults.configUpdated = true;
      }

      // Log the import
      await prisma.auditLog.create({
        data: {
          action: "SETTINGS_IMPORTED",
          entityType: "SYSTEM_SETTINGS",
          entityId: "BULK_IMPORT",
          userId: session.user.id,
          details: JSON.stringify({
            importedBy: session.user.email,
            usersImported: importResults.usersImported,
            usersSkipped: importResults.usersSkipped,
            configUpdated: importResults.configUpdated,
            errorCount: importResults.errors.length,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Settings import completed",
        results: importResults,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Settings export/import error:", error);
    return NextResponse.json(
      {
        error: "Failed to process settings request",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Settings Export/Import API",
    supportedActions: ["export", "import"],
    supportedExportTypes: [
      "user_settings",
      "system_config",
      "audit_config",
      "all",
    ],
    supportedFormats: ["json", "csv"],
    requiredPermissions: ["ADMIN"],
    exportOptions: ["includePasswords"],
    importRequirements: [
      "Valid JSON structure",
      "Metadata section",
      "Settings section",
    ],
  });
}
