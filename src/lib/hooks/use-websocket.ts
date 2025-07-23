import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketHookProps {
  url: string;
  onMessage?: (event: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
}: WebSocketHookProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!url) return;

    socketRef.current = io(url, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
      onConnect?.();
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      onDisconnect?.();
    });

    // Listen for all messages
    if (onMessage) {
      socketRef.current.onAny((event, ...args) => {
        onMessage({ event, data: args[0] });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, onMessage, onConnect, onDisconnect]);

  return socketRef.current;
}
