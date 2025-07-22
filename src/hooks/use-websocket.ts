// src/hooks/use-websocket.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { WebSocketMessage, AnalyticsUpdate } from "@/types/websocket";
import { Transaction } from "@/types/transaction";
import { FraudAlert } from "@/types/fraud";

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  // ...existing code...
  const { data: session } = require('next-auth/react').useSession();
  const {
    url,
    enabled = true,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Create Socket.IO connection
    socketRef.current = io(url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Send auth message with token after connect
    socketRef.current.on('connect', () => {
      if (socketRef.current && session?.accessToken) {
        socketRef.current.emit('message', {
          type: 'auth',
          token: session.accessToken,
        });
      }
    });

    setConnectionStatus("connecting");

    // Event handlers
    socketRef.current.on("connect", () => {
      console.log("🔌 WebSocket connected");
      setIsConnected(true);
      setConnectionStatus("connected");
      onConnect?.();
    });

    socketRef.current.on("disconnect", (reason: string) => {
      console.log("🔌 WebSocket disconnected. Reason:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      onDisconnect?.();
    });

    // Handle newTransaction events
    socketRef.current.on("newTransaction", (transaction: Transaction) => {
      console.log("📥 New transaction received:", transaction);
      const message: WebSocketMessage = {
        type: "transaction",
        data: { type: "transaction", data: transaction },
      };
      setLastMessage(message);
      onMessage?.(message);
    });

    // Handle newAlert events
    socketRef.current.on("newAlert", (alert: FraudAlert) => {
      console.log("⚠️ New alert received:", alert);
      const message: WebSocketMessage = {
        type: "alert",
        data: { type: "alert", data: alert },
      };
      setLastMessage(message);
      onMessage?.(message);
    });

    // Handle analyticsUpdate events
    socketRef.current.on("analyticsUpdate", (analytics: AnalyticsUpdate) => {
      console.log("📊 Analytics update received:", analytics);
      const message: WebSocketMessage = {
        type: "analytics",
        data: { type: "analytics", data: analytics },
      };
      setLastMessage(message);
      onMessage?.(message);
    });

    socketRef.current.on("error", (error: Error) => {
      console.error("❌ WebSocket error:", error);
      setConnectionStatus("error");
      onError?.(error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, enabled, onConnect, onDisconnect, onMessage, onError]);

  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current && isConnected) {
      console.log("📤 Sending message:", message);
      socketRef.current.emit("message", message);
    } else {
      console.warn("Cannot send message: socket not connected");
    }
  };

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
  };
}
