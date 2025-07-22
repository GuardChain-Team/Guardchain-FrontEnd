// src/lib/hooks/use-analytics.ts
import useSWR from "swr";
import { useWebSocket } from "../hooks/use-websocket";

interface Analytics {
  totalTransactions: number;
  totalAmount: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  statusDistribution: Array<{
    status: string;
    _count: number;
  }>;
  recentTransactions: Array<{
    id: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    riskScore: number;
    createdAt: string;
  }>;
  timeRange: {
    from: string;
    to: string;
  };
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAnalytics() {
  const { data, error, mutate } = useSWR<Analytics>("/api/analytics", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  // WebSocket connection for real-time updates
  useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000",
    onMessage: async (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.type === "analyticsUpdate") {
        // Update local data immediately
        mutate(message.analytics, false);
      }
    },
  });

  return {
    analytics: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
