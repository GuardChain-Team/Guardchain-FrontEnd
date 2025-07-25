import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const alert = await prisma.alert.findUnique({ where: { id: id as string } });
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }
    if (alert.status === "Blocked") {
      return res.status(400).json({ error: "Alert already blocked" });
    }
    // Update alert status
    const updatedAlert = await prisma.alert.update({
      where: { id: id as string },
      data: { status: "Blocked", updatedAt: new Date() },
    });
    // If alert is linked to a transaction, set transaction status to BLOCKED
    if (alert.transactionId) {
      await prisma.transaction.update({
        where: { id: alert.transactionId },
        data: { status: "BLOCKED", updatedAt: new Date() },
      });
    }
    return res.status(200).json({ message: "Alert blocked successfully", alert: updatedAlert });
  } catch (error) {
    console.error("Block alert error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
