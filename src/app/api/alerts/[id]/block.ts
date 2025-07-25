import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const alertId = params.id;
  try {
    const alert = await prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }
    if (alert.status === "Blocked") {
      return NextResponse.json({ error: "Alert already blocked" }, { status: 400 });
    }
    // Update alert status
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: { status: "Blocked", updatedAt: new Date() },
    });

    // If alert is linked to a transaction, set transaction status to BLOCKED
    if (alert.transactionId) {
      await prisma.transaction.update({
        where: { id: alert.transactionId },
        data: { status: "BLOCKED", updatedAt: new Date() },
      });
    }

    return NextResponse.json({ message: "Alert blocked successfully", alert: updatedAlert });
  } catch (error) {
    console.error("Block alert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
