import { NextRequest } from "next/server";
import { wsManager } from "@/lib/realtime/websocket";

export async function GET(request: NextRequest) {
  try {
    // This endpoint can be used to trigger WebSocket messages
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const message = searchParams.get("message");

    if (type && message) {
      wsManager.broadcast({
        type,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({
      message: "WebSocket message sent",
      connectedClients: wsManager.connectedClientsCount,
    });
  } catch (error) {
    console.error("WebSocket API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
