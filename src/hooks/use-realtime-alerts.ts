import useSWR from "swr";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { FraudAlert } from "@/types/fraud";

let socket: Socket | null = null;

export function useRealtimeAlerts() {
  // SWR hook for fetching initial data and handling revalidation
  const { data, error, mutate } = useSWR<any>(
    "/api/fraud/alerts?page=1&limit=20",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const result = await response.json();
      // API returns { alerts, pagination }
      return result.alerts;
    }
  );

  // Connect to WebSocket
  useEffect(() => {
    if (!socket) {
      socket = io(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001"
      );

      socket.on("connect", () => {
        console.log("Connected to WebSocket server (alerts)");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server (alerts)");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Handle real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new alerts
    socket.on("newAlert", (alert: FraudAlert) => {
      mutate((currentData) => {
        if (!currentData) return [alert];
        return [alert, ...currentData];
      }, false);
    });

    // Listen for alert updates
    socket.on("updateAlert", (updatedAlert: FraudAlert) => {
      mutate((currentData) => {
        if (!currentData) return [updatedAlert];
        return currentData.map((a) =>
          a.id === updatedAlert.id ? updatedAlert : a
        );
      }, false);
    });

    return () => {
      socket?.off("newAlert");
      socket?.off("updateAlert");
    };
  }, [mutate]);

  return {
    alerts: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
