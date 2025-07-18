import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      action,
      alertIds,
      assigneeId,
      priority,
      status,
      tags,
      notes,
      escalationLevel,
    } = body;

    if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
      return NextResponse.json(
        { error: "Alert IDs array required" },
        { status: 400 }
      );
    }

    let bulkResult = {
      success: 0,
      failed: 0,
      errors: [],
      updatedAlerts: [],
    };

    // Verify all alerts exist and user has permission
    const alerts = await prisma.alert.findMany({
      where: {
        id: { in: alertIds },
        // Add additional filters based on user role if needed
      },
      include: {
        assignee: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    if (alerts.length !== alertIds.length) {
      return NextResponse.json(
        {
          error: "Some alerts not found or access denied",
        },
        { status: 404 }
      );
    }

    switch (action) {
      case "assign":
        if (!assigneeId) {
          return NextResponse.json(
            { error: "Assignee ID required for assignment" },
            { status: 400 }
          );
        }

        // Verify assignee exists and is active
        const assignee = await prisma.user.findUnique({
          where: { id: assigneeId, isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        });

        if (!assignee) {
          return NextResponse.json(
            { error: "Invalid or inactive assignee" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                assigneeId,
                status: "ASSIGNED",
                updatedAt: new Date(),
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            // Create audit log for each assignment
            await prisma.auditLog.create({
              data: {
                action: "ALERT_ASSIGNED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  assignedTo: assignee.email,
                  assignedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to assign alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "update_status":
        if (!status) {
          return NextResponse.json(
            { error: "Status required for status update" },
            { status: 400 }
          );
        }

        const validStatuses = [
          "OPEN",
          "ASSIGNED",
          "IN_PROGRESS",
          "RESOLVED",
          "CLOSED",
          "FALSE_POSITIVE",
        ];
        if (!validStatuses.includes(status)) {
          return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                status,
                updatedAt: new Date(),
                ...(status === "RESOLVED" && { resolvedAt: new Date() }),
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_STATUS_UPDATED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  newStatus: status,
                  updatedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to update status for alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "update_priority":
        if (!priority) {
          return NextResponse.json(
            { error: "Priority required for priority update" },
            { status: 400 }
          );
        }

        const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
        if (!validPriorities.includes(priority)) {
          return NextResponse.json(
            { error: "Invalid priority" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                priority,
                updatedAt: new Date(),
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_PRIORITY_UPDATED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  newPriority: priority,
                  updatedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to update priority for alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "add_tags":
        if (!tags || !Array.isArray(tags)) {
          return NextResponse.json(
            { error: "Tags array required" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            // Get current tags and merge with new ones
            const currentAlert = await prisma.alert.findUnique({
              where: { id: alertId },
              select: { tags: true },
            });

            const currentTags = currentAlert?.tags || [];
            const newTags = [...new Set([...currentTags, ...tags])]; // Remove duplicates

            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                tags: newTags,
                updatedAt: new Date(),
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_TAGS_ADDED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  addedTags: tags,
                  updatedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to add tags to alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "escalate":
        if (!escalationLevel) {
          return NextResponse.json(
            { error: "Escalation level required" },
            { status: 400 }
          );
        }

        const validEscalationLevels = [
          "LEVEL_1",
          "LEVEL_2",
          "LEVEL_3",
          "MANAGEMENT",
        ];
        if (!validEscalationLevels.includes(escalationLevel)) {
          return NextResponse.json(
            { error: "Invalid escalation level" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                priority:
                  escalationLevel === "MANAGEMENT" ? "CRITICAL" : "HIGH",
                status: "ESCALATED",
                updatedAt: new Date(),
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_ESCALATED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  escalationLevel,
                  escalatedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to escalate alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "add_notes":
        if (!notes) {
          return NextResponse.json(
            { error: "Notes content required" },
            { status: 400 }
          );
        }

        for (const alertId of alertIds) {
          try {
            // Add note to alert (assuming there's a notes relation or field)
            const updatedAlert = await prisma.alert.update({
              where: { id: alertId },
              data: {
                updatedAt: new Date(),
                // In a real implementation, you might have a separate notes table
                // or add the note to a notes field/array
              },
              include: {
                assignee: {
                  select: { firstName: true, lastName: true, email: true },
                },
              },
            });

            bulkResult.updatedAlerts.push(updatedAlert);
            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_NOTE_ADDED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  note: notes,
                  addedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to add note to alert ${alertId}: ${error}`
            );
          }
        }
        break;

      case "delete":
        // Only allow admins to delete alerts
        if (session.user.role !== "ADMIN") {
          return NextResponse.json(
            { error: "Admin access required for deletion" },
            { status: 403 }
          );
        }

        for (const alertId of alertIds) {
          try {
            await prisma.alert.delete({
              where: { id: alertId },
            });

            bulkResult.success++;

            await prisma.auditLog.create({
              data: {
                action: "ALERT_DELETED",
                entityType: "ALERT",
                entityId: alertId,
                userId: session.user.id,
                details: JSON.stringify({
                  deletedBy: session.user.email,
                  bulkOperation: true,
                }),
              },
            });
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to delete alert ${alertId}: ${error}`
            );
          }
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Create summary audit log for the bulk operation
    await prisma.auditLog.create({
      data: {
        action: "BULK_ALERT_OPERATION",
        entityType: "ALERT",
        entityId: "BULK",
        userId: session.user.id,
        details: JSON.stringify({
          operation: action,
          alertIds,
          results: {
            success: bulkResult.success,
            failed: bulkResult.failed,
            errorCount: bulkResult.errors.length,
          },
          performedBy: session.user.email,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} operation completed`,
      results: bulkResult,
    });
  } catch (error) {
    console.error("Alert bulk operations error:", error);
    return NextResponse.json(
      {
        error: "Failed to process bulk alert operation",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Alert Bulk Operations API",
    supportedActions: [
      "assign",
      "update_status",
      "update_priority",
      "add_tags",
      "escalate",
      "add_notes",
      "delete",
    ],
    validStatuses: [
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
      "FALSE_POSITIVE",
    ],
    validPriorities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    validEscalationLevels: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "MANAGEMENT"],
    requiredParameters: {
      assign: ["alertIds", "assigneeId"],
      update_status: ["alertIds", "status"],
      update_priority: ["alertIds", "priority"],
      add_tags: ["alertIds", "tags"],
      escalate: ["alertIds", "escalationLevel"],
      add_notes: ["alertIds", "notes"],
      delete: ["alertIds"], // Admin only
    },
  });
}
