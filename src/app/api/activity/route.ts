import { NextRequest } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(request: NextRequest) {
  try {
    // Fetch the 20 most recent audit logs as activity
    const activities = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 20,
    });
    return Response.json(activities);
  } catch (error) {
    console.error("Get activity error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
