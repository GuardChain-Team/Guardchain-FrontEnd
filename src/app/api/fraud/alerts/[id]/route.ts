import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";

async function handleUpdateAlert(request: NextRequest, { params, user }: any) {
  try {
    const { id } = params;
    const body = await request.json();

    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      return Response.json({ error: "Alert not found" }, { status: 404 });
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        transaction: true,
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        investigation: true,
      },
    });

    return Response.json({
      message: "Alert updated successfully",
      alert: updatedAlert,
    });
  } catch (error) {
    console.error("Update alert error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleGetAlert(request: NextRequest, { params, user }: any) {
  try {
    const { id } = params;

    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        transaction: true,
        assignedTo: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        investigation: {
          include: {
            investigator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!alert) {
      return Response.json({ error: "Alert not found" }, { status: 404 });
    }

    return Response.json({ alert });
  } catch (error) {
    console.error("Get alert error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = requireAuth(handleGetAlert);
export const PUT = requireAuth(handleUpdateAlert);
