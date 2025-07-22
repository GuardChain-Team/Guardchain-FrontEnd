import useSWR from "swr";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

export interface ActivityEvent {
  id: string;
  time: string;
  event: string;
  user: string;
  type: string;
  details?: string;
}

let socket: Socket | null = null;

export function useRealtimeActivity() {
  // SWR for initial fetch (replace endpoint if available)
  const { data, error, mutate } = useSWR<ActivityEvent[]>(
    "/api/activity", // fallback endpoint, replace with real if available
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch activity");
      return await response.json();
    }
  );

  useEffect(() => {
    if (!socket) {
      socket = io(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001"
      );
      socket.on("connect", () => {
        console.log("Connected to WebSocket server (activity)");
      });
      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server (activity)");
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("newActivity", (activity: ActivityEvent) => {
      mutate((currentData) => {
        if (!currentData) return [activity];
        return [activity, ...currentData];
      }, false);
    });
    return () => {
      socket?.off("newActivity");
    };
  }, [mutate]);

  return {
    activity: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
