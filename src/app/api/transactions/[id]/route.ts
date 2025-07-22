// PATCH: Block a suspicious transaction
async function handleBlockTransaction(
  request: NextRequest,
  { params, user }: any
) {
  try {
    const { id } = params;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }
    if (transaction.status === "BLOCKED") {
      return Response.json({ error: "Transaction already blocked" }, { status: 400 });
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: "BLOCKED",
        isFlagged: true,
        updatedAt: new Date(),
      },
    });
    return Response.json({
      message: "Transaction blocked successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Block transaction error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";
import { parseMetadata } from "@/lib/utils/metadata";

async function handleGetTransaction(
  request: NextRequest,
  { params, user }: any
) {
  try {
    const { id } = params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        alerts: {
          include: {
            assignedTo: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        investigations: {
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
        analytics: true,
      },
    });

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    return Response.json({
      transaction: {
        ...transaction,
        metadata: parseMetadata(transaction.metadata),
      },
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleUpdateTransaction(
  request: NextRequest,
  { params, user }: any
) {
  try {
    const { id } = params;
    const body = await request.json();

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return Response.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export const GET = requireAuth(handleGetTransaction);
export const PUT = requireAuth(handleUpdateTransaction);
export const PATCH = requireAuth(handleBlockTransaction);
