import { NextRequest } from "next/server";
import { updateRealTimeAnalytics } from "@/lib/realtime/server";

async function handleGetAnalytics(request: NextRequest, { user }: any) {
  try {
    const analytics = await updateRealTimeAnalytics();
    return Response.json(analytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = handleGetAnalytics;
