import useSWR from "swr";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { FraudAlert } from "@/types/fraud";
import { useSession } from "next-auth/react";


let socket: Socket | null = null;

export function useRealtimeAlerts() {
  const { data: session, status } = useSession();
  const token = session?.user ? (session.user as any).accessToken : undefined;
  const shouldFetch = status === "authenticated" && !!token;
  // SWR hook for fetching initial data and handling revalidation
  const { data, error, mutate } = useSWR<any, Error, [string, string] | null>(
    shouldFetch ? ["/api/fraud/alerts?page=1&limit=20", token] as [string, string] : null,
    async ([url, t]: [string, string]) => {
      const response = await fetch(url, {
        headers: t ? { Authorization: `Bearer ${t}` } : {},
      });
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
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8000"
      );

      socket.on("connect", () => {
        console.log("[RealtimeAlerts] Connected to WebSocket server");
      });

      socket.on("disconnect", () => {
        console.log("[RealtimeAlerts] Disconnected from WebSocket server");
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
      console.log("[RealtimeAlerts] Received newAlert:", alert);
      mutate((currentData: FraudAlert[] | undefined) => {
        if (!currentData) return [alert];
        return [alert, ...currentData];
      }, false);
    });

    // Listen for alert updates
    socket.on("updateAlert", (updatedAlert: FraudAlert) => {
      console.log("[RealtimeAlerts] Received updateAlert:", updatedAlert);
      mutate((currentData: FraudAlert[] | undefined) => {
        if (!currentData) return [updatedAlert];
        return currentData.map((a: FraudAlert) =>
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

