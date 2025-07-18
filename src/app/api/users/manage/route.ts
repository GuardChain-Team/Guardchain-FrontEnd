import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permissions
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, userId, userData } = body;

    switch (action) {
      case "create_user":
        if (!userData || !userData.email || !userData.password) {
          return NextResponse.json(
            { error: "Email and password required" },
            { status: 400 }
          );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
          );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: userData.email,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            password: hashedPassword,
            role: userData.role || "INVESTIGATOR",
            isActive:
              userData.isActive !== undefined ? userData.isActive : true,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "USER_CREATED",
            entityType: "USER",
            entityId: newUser.id,
            userId: session.user.id,
            details: JSON.stringify({
              createdUserEmail: newUser.email,
              role: newUser.role,
              createdBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "User created successfully",
          user: newUser,
        });

      case "update_user":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        const updateData: any = {};
        if (userData.firstName !== undefined)
          updateData.firstName = userData.firstName;
        if (userData.lastName !== undefined)
          updateData.lastName = userData.lastName;
        if (userData.role !== undefined) updateData.role = userData.role;
        if (userData.isActive !== undefined)
          updateData.isActive = userData.isActive;

        // Handle password update
        if (userData.password) {
          updateData.password = await bcrypt.hash(userData.password, 12);
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            updatedAt: true,
          },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "USER_UPDATED",
            entityType: "USER",
            entityId: userId,
            userId: session.user.id,
            details: JSON.stringify({
              updatedFields: Object.keys(updateData),
              updatedBy: session.user.email,
              targetUserEmail: updatedUser.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "User updated successfully",
          user: updatedUser,
        });

      case "deactivate_user":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        // Prevent admin from deactivating themselves
        if (userId === session.user.id) {
          return NextResponse.json(
            { error: "Cannot deactivate your own account" },
            { status: 400 }
          );
        }

        const deactivatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "USER_DEACTIVATED",
            entityType: "USER",
            entityId: userId,
            userId: session.user.id,
            details: JSON.stringify({
              deactivatedUserEmail: deactivatedUser.email,
              deactivatedBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "User deactivated successfully",
          user: deactivatedUser,
        });

      case "reactivate_user":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        const reactivatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: true },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "USER_REACTIVATED",
            entityType: "USER",
            entityId: userId,
            userId: session.user.id,
            details: JSON.stringify({
              reactivatedUserEmail: reactivatedUser.email,
              reactivatedBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "User reactivated successfully",
          user: reactivatedUser,
        });

      case "delete_user":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        // Prevent admin from deleting themselves
        if (userId === session.user.id) {
          return NextResponse.json(
            { error: "Cannot delete your own account" },
            { status: 400 }
          );
        }

        // Get user info before deletion
        const userToDelete = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, firstName: true, lastName: true },
        });

        if (!userToDelete) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        // Delete user (this will cascade delete related records based on schema)
        await prisma.user.delete({
          where: { id: userId },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "USER_DELETED",
            entityType: "USER",
            entityId: userId,
            userId: session.user.id,
            details: JSON.stringify({
              deletedUserEmail: userToDelete.email,
              deletedBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "User deleted successfully",
        });

      case "reset_password":
        if (!userId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-12);
        const hashedTempPassword = await bcrypt.hash(tempPassword, 12);

        const userWithResetPassword = await prisma.user.update({
          where: { id: userId },
          data: {
            password: hashedTempPassword,
            // In a real app, you might set a flag to force password change on next login
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });

        // Log the action
        await prisma.auditLog.create({
          data: {
            action: "PASSWORD_RESET",
            entityType: "USER",
            entityId: userId,
            userId: session.user.id,
            details: JSON.stringify({
              targetUserEmail: userWithResetPassword.email,
              resetBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: "Password reset successfully",
          temporaryPassword: tempPassword, // In production, this should be sent via secure channel
          user: userWithResetPassword,
        });

      case "bulk_action":
        const { userIds, bulkAction } = userData;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          return NextResponse.json(
            { error: "User IDs array required" },
            { status: 400 }
          );
        }

        let bulkResult = { success: 0, failed: 0, errors: [] };

        for (const uid of userIds) {
          try {
            // Prevent admin from affecting their own account in bulk operations
            if (uid === session.user.id) {
              bulkResult.failed++;
              bulkResult.errors.push(
                `Cannot perform bulk action on your own account`
              );
              continue;
            }

            switch (bulkAction) {
              case "deactivate":
                await prisma.user.update({
                  where: { id: uid },
                  data: { isActive: false },
                });
                break;
              case "activate":
                await prisma.user.update({
                  where: { id: uid },
                  data: { isActive: true },
                });
                break;
              case "delete":
                await prisma.user.delete({
                  where: { id: uid },
                });
                break;
              default:
                bulkResult.failed++;
                bulkResult.errors.push(`Invalid bulk action: ${bulkAction}`);
                continue;
            }
            bulkResult.success++;
          } catch (error) {
            bulkResult.failed++;
            bulkResult.errors.push(
              `Failed to ${bulkAction} user ${uid}: ${error}`
            );
          }
        }

        // Log the bulk action
        await prisma.auditLog.create({
          data: {
            action: "BULK_USER_ACTION",
            entityType: "USER",
            entityId: "BULK",
            userId: session.user.id,
            details: JSON.stringify({
              bulkAction,
              userIds,
              results: bulkResult,
              performedBy: session.user.email,
            }),
          },
        });

        return NextResponse.json({
          success: true,
          message: `Bulk ${bulkAction} completed`,
          results: bulkResult,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("User management error:", error);
    return NextResponse.json(
      {
        error: "Failed to process user management request",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "User Management API",
    supportedActions: [
      "create_user",
      "update_user",
      "deactivate_user",
      "reactivate_user",
      "delete_user",
      "reset_password",
      "bulk_action",
    ],
    bulkActions: ["deactivate", "activate", "delete"],
    requiredPermissions: ["ADMIN"],
    userFields: ["email", "firstName", "lastName", "role", "isActive"],
    availableRoles: ["ADMIN", "MANAGER", "INVESTIGATOR", "ANALYST"],
  });
}
