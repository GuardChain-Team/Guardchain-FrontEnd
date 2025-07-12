import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";
import { stringifyMetadata, parseMetadata } from "@/lib/utils/metadata";

const createTransactionSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  fromAccount: z.string(),
  toAccount: z.string(),
  description: z.string().optional(),
  timestamp: z.string().transform((str) => new Date(str)),
  metadata: z.record(z.any()).optional(),
});

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : 1)),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
  riskScore: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
});

async function handleGetTransactions(request: NextRequest, { user }: any) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const { page, limit, search, status, riskScore, startDate, endDate } =
      querySchema.parse(params);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: "insensitive" } },
        { fromAccount: { contains: search, mode: "insensitive" } },
        { toAccount: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (riskScore) {
      const score = parseFloat(riskScore);
      where.riskScore = { gte: score };
    }

    if (startDate && endDate) {
      where.timestamp = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
        include: {
          alerts: {
            select: {
              id: true,
              severity: true,
              status: true,
            },
          },
          _count: {
            select: {
              alerts: true,
              investigations: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return Response.json({
      transactions: transactions.map((tx) => ({
        ...tx,
        metadata: parseMetadata(tx.metadata),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCreateTransaction(request: NextRequest, { user }: any) {
  try {
    const body = await request.json();
    const data = createTransactionSchema.parse(body);

    // Check if transaction already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { transactionId: data.transactionId },
    });

    if (existingTransaction) {
      return Response.json(
        { error: "Transaction with this ID already exists" },
        { status: 400 }
      );
    }

    // Calculate risk score (simple algorithm)
    const riskScore = calculateRiskScore(data);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        riskScore,
        status: "PENDING",
        metadata: stringifyMetadata(data.metadata),
      },
    });

    // Create alert if high risk
    if (riskScore > 0.7) {
      await prisma.alert.create({
        data: {
          title: `High-risk transaction detected`,
          description: `Transaction ${
            data.transactionId
          } has a risk score of ${riskScore.toFixed(2)}`,
          severity: riskScore > 0.9 ? "CRITICAL" : "HIGH",
          riskScore,
          category: "FRAUD_DETECTION",
          transactionId: transaction.id,
          metadata: stringifyMetadata({
            amount: data.amount,
            fromAccount: data.fromAccount,
            toAccount: data.toAccount,
          }),
        },
      });
    }

    return Response.json(
      {
        message: "Transaction created successfully",
        transaction: {
          ...transaction,
          metadata: parseMetadata(transaction.metadata),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create transaction error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateRiskScore(transaction: any): number {
  let score = 0;

  // Amount-based risk
  if (transaction.amount > 10000) score += 0.3;
  if (transaction.amount > 50000) score += 0.2;
  if (transaction.amount > 100000) score += 0.3;

  // Time-based risk (transactions outside business hours)
  const hour = new Date(transaction.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 0.2;

  // Random additional factors (in real implementation, use ML models)
  if (Math.random() > 0.8) score += 0.1;
  if (Math.random() > 0.9) score += 0.2;

  return Math.min(score, 1);
}

export const GET = requireAuth(handleGetTransactions);
export const POST = requireAuth(handleCreateTransaction);
