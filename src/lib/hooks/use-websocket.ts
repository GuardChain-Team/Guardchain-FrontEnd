import { useEffect, useRef } from "react";

interface WebSocketHookProps {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
}: WebSocketHookProps) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      onConnect?.();
    };

    wsRef.current.onmessage = (event) => {
      onMessage?.(event);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      onDisconnect?.();
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onMessage, onConnect, onDisconnect]);

  return wsRef.current;
}
