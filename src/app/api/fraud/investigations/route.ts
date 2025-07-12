import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";

const createInvestigationSchema = z.object({
  title: z.string(),
  description: z.string(),
  alertId: z.string().optional(),
  transactionId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

async function handleGetInvestigations(request: NextRequest, { user }: any) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Non-admin users can only see their own investigations
    if (user.role !== "ADMIN") {
      where.investigatorId = user.id;
    }

    const [investigations, total] = await Promise.all([
      prisma.investigation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          alert: {
            include: {
              transaction: {
                select: {
                  id: true,
                  transactionId: true,
                  amount: true,
                  currency: true,
                },
              },
            },
          },
          investigator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          transaction: {
            select: {
              id: true,
              transactionId: true,
              amount: true,
              currency: true,
              fromAccount: true,
              toAccount: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      }),
      prisma.investigation.count({ where }),
    ]);

    return Response.json({
      investigations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get investigations error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCreateInvestigation(request: NextRequest, { user }: any) {
  try {
    const body = await request.json();
    const data = createInvestigationSchema.parse(body);

    const investigation = await prisma.investigation.create({
      data: {
        ...data,
        investigatorId: user.id,
        status: "OPEN",
      },
      include: {
        alert: true,
        investigator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        transaction: true,
      },
    });

    return Response.json(
      {
        message: "Investigation created successfully",
        investigation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create investigation error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = requireAuth(handleGetInvestigations);
export const POST = requireAuth(handleCreateInvestigation);
