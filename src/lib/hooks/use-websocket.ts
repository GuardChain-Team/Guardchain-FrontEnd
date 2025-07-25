import { useEffect } from "react";
import { getSocket, closeSocket } from "./socket";


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
  useEffect(() => {
    if (!url) return;
    const socket = getSocket(url);

    socket.on("connect", () => {
      console.log("Socket.IO connected");
      onConnect?.();
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      onDisconnect?.();
    });

    if (onMessage) {
      socket.onAny((event, ...args) => {
        onMessage({ event, data: args[0] });
      });
    }

    return () => {
      if (onMessage) {
        socket.offAny();
      }
      socket.off("connect");
      socket.off("disconnect");
      // Do not disconnect here to preserve singleton connection
    };
  }, [url, onMessage, onConnect, onDisconnect]);

  // Return the singleton socket instance
  return getSocket(url);
}
