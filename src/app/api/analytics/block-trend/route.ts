import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Returns block trend (number of blocks per day for the last 7 days)
export async function GET(req: NextRequest) {
  const now = new Date();
  const days = 7;
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days + 1);

  // Group by day, count BLOCKED transactions
  // Get all blocked transactions in range
  const blocked = await prisma.transaction.findMany({
    where: {
      status: "BLOCKED",
      createdAt: {
        gte: startDate,
        lte: now,
      },
    },
    select: { createdAt: true },
  });

  // Count per day
  const counts: Record<string, number> = {};
  for (const tx of blocked) {
    const day = tx.createdAt.toISOString().slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  }

  // Fill all days in range
  const data = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayStr = d.toISOString().slice(0, 10);
    data.push({ date: dayStr, value: counts[dayStr] || 0 });
  }

  return NextResponse.json({ data });
}
