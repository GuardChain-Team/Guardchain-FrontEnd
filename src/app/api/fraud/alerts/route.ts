import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : 1)),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : 10)),
  severity: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  assignedTo: z.string().optional(),
});

async function handleGetAlerts(request: NextRequest, { user }: any) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const { page, limit, severity, status, category, assignedTo } =
      querySchema.parse(params);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (category) where.category = category;
    if (assignedTo) where.assignedToId = assignedTo;

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          transaction: {
            select: {
              id: true,
              transactionId: true,
              amount: true,
              currency: true,
              fromAccount: true,
              toAccount: true,
              timestamp: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          investigation: {
            select: {
              id: true,
              status: true,
              priority: true,
            },
          },
        },
      }),
      prisma.alert.count({ where }),
    ]);

    return Response.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get alerts error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCreateAlert(request: NextRequest, { user }: any) {
  try {
    const body = await request.json();

    const alert = await prisma.alert.create({
      data: {
        ...body,
        assignedToId: user.id,
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
      },
    });

    return Response.json(
      {
        message: "Alert created successfully",
        alert,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create alert error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = requireAuth(handleGetAlerts);
export const POST = requireAuth(handleCreateAlert);
