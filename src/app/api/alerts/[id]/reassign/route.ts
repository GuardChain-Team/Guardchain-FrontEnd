// src/app/api/alerts/[id]/reassign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alertId = params.id;
    const { assignToUserId, reason, priority } = await request.json();

    // Validate the new assignee exists and has appropriate role
    const newAssignee = await prisma.user.findUnique({
      where: { id: assignToUserId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!newAssignee) {
      return NextResponse.json(
        { error: "Assignee not found" },
        { status: 404 }
      );
    }

    if (
      !["FRAUD_INVESTIGATOR", "COMPLIANCE_OFFICER", "ADMIN"].includes(
        newAssignee.role
      )
    ) {
      return NextResponse.json(
        { error: "User does not have permission to handle fraud alerts" },
        { status: 403 }
      );
    }

    // Get current alert
    const currentAlert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { assignedUser: true },
    });

    if (!currentAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Update the alert assignment
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        assignedTo: assignToUserId,
        priority: priority || currentAlert.priority,
        updatedAt: new Date(),
      },
      include: {
        assignedUser: true,
        transaction: true,
      },
    });

    // Create assignment history record
    await prisma.alertAssignmentHistory.create({
      data: {
        alertId,
        fromUserId: currentAlert.assignedTo,
        toUserId: assignToUserId,
        reassignedBy: session.user.id,
        reason: reason || "Manual reassignment",
        reassignedAt: new Date(),
      },
    });

    // Create notification for new assignee
    await createNotification({
      userId: assignToUserId,
      type: "ALERT_ASSIGNED",
      title: "New Alert Assigned",
      message: `You have been assigned alert ${currentAlert.alertId}`,
      alertId: alertId,
      severity: currentAlert.severity,
    });

    // Create notification for previous assignee (if any)
    if (currentAlert.assignedTo && currentAlert.assignedTo !== assignToUserId) {
      await createNotification({
        userId: currentAlert.assignedTo,
        type: "ALERT_REASSIGNED",
        title: "Alert Reassigned",
        message: `Alert ${currentAlert.alertId} has been reassigned to ${newAssignee.name}`,
        alertId: alertId,
        severity: "MEDIUM",
      });
    }

    // Log the reassignment action
    await logAuditAction({
      userId: session.user.id,
      action: "ALERT_REASSIGNED",
      resourceId: alertId,
      details: {
        fromUser: currentAlert.assignedUser?.name || "Unassigned",
        toUser: newAssignee.name,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        alert: updatedAlert,
        previousAssignee: currentAlert.assignedUser,
        newAssignee,
        reassignedAt: new Date(),
        reassignedBy: session.user.name,
      },
    });
  } catch (error) {
    console.error("Error reassigning alert:", error);
    return NextResponse.json(
      { error: "Failed to reassign alert" },
      { status: 500 }
    );
  }
}

async function createNotification(notification: any) {
  try {
    await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        metadata: {
          alertId: notification.alertId,
          severity: notification.severity,
        },
        createdAt: new Date(),
        isRead: false,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

async function logAuditAction(action: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: action.userId,
        action: action.action,
        resourceType: "ALERT",
        resourceId: action.resourceId,
        details: action.details,
        timestamp: new Date(),
        ipAddress: "127.0.0.1", // Get from request in real implementation
        userAgent: "GuardChain-Frontend", // Get from request headers
      },
    });
  } catch (error) {
    console.error("Error logging audit action:", error);
  }
}
