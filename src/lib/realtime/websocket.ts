import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { verifyToken } from "@/lib/auth/utils";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  userRole?: string;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();

  get connectedClientsCount() {
    return this.clients.size;
  }

  initialize(server?: any) {
    if (typeof window !== "undefined") return; // Don't run on client

    this.wss = new WebSocketServer({
      port: parseInt(process.env.WS_PORT || "8080"),
      path: "/ws",
    });

    this.wss.on(
      "connection",
      (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
        console.log("New WebSocket connection");

        // Handle authentication
        ws.on("message", (message: Buffer) => {
          try {
            const data = JSON.parse(message.toString());

            if (data.type === "auth") {
              const payload = verifyToken(data.token);
              if (payload) {
                ws.userId = payload.userId;
                ws.userRole = payload.role;
                this.clients.set(payload.userId, ws);

                ws.send(
                  JSON.stringify({
                    type: "auth_success",
                    message: "Authenticated successfully",
                  })
                );
              } else {
                ws.send(
                  JSON.stringify({
                    type: "auth_error",
                    message: "Invalid token",
                  })
                );
                ws.close();
              }
            }
          } catch (error) {
            console.error("WebSocket message error:", error);
          }
        });

        ws.on("close", () => {
          if (ws.userId) {
            this.clients.delete(ws.userId);
          }
          console.log("WebSocket connection closed");
        });

        ws.on("error", (error) => {
          console.error("WebSocket error:", error);
        });
      }
    );

    console.log(
      `WebSocket server running on port ${process.env.WS_PORT || "8080"}`
    );
  }

  broadcast(message: any) {
    if (!this.wss) return;

    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  sendToUser(userId: string, message: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  sendToRole(role: string, message: any) {
    this.clients.forEach((client) => {
      if (client.userRole === role && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

export const wsManager = new WebSocketManager();

// Initialize WebSocket server if in Node.js environment
if (typeof window === "undefined") {
  wsManager.initialize();
}
