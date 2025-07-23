// src/lib/hooks/use-analytics.ts

import useSWR from "swr";
import { useWebSocket } from "../hooks/use-websocket";
import { useSession } from "next-auth/react";

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

const fetcherWithToken = (token?: string) => async (url: string): Promise<Analytics> => {
  console.log("[useAnalytics] Using token:", token); // DEBUG
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  // Convert stringified numbers to numbers recursively
  function parseNumbers(obj: any): any {
    if (Array.isArray(obj)) return obj.map(parseNumbers);
    if (obj && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'string' && /^\d+(\.\d+)?$/.test(val)) {
          newObj[key] = Number(val);
        } else {
          newObj[key] = parseNumbers(val);
        }
      }
      return newObj;
    }
    return obj;
  }
  return parseNumbers(data) as Analytics;
};



export function useAnalytics() {
  const { data: session, status } = useSession();
  const token = session?.user ? (session.user as any).accessToken : undefined;
  // Only fetch when session is loaded and token is present
  const shouldFetch = status === "authenticated" && !!token;
  const { data, error, mutate } = useSWR<Analytics, Error, [string, string | undefined] | null>(
    shouldFetch ? ["/api/analytics", token] as [string, string | undefined] : null,
    ([url, t]: [string, string | undefined]) => fetcherWithToken(t)(url),
    { refreshInterval: 30000 }
  );

  // WebSocket connection for real-time updates
  useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000",
    onMessage: async (event: any) => {
      const message = event.data; // Socket.IO: data is already parsed
      if (message.type === "analyticsUpdate") {
        // Update local data immediately
        mutate(message.analytics, false);
      }
    },
  });

  return {
    analytics: data,
    isLoading: shouldFetch && !error && !data,
    isError: error,
    mutate,
  };
}


export function useRealtimeAlerts() {
  const { data: session, status } = useSession();
  const token = session?.user ? (session.user as any).accessToken : undefined;
  const shouldFetch = status === "authenticated" && !!token;
  const { data, error, mutate } = useSWR<Analytics, Error, [string, string] | null>(
    shouldFetch ? ["/api/alerts", token] as [string, string] : null,
    async ([url, t]: [string, string]) => {
      const response = await fetch(url, {
        headers: t ? { Authorization: `Bearer ${t}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return data;
    },
    { refreshInterval: 30000 }
  );

  return {
    alerts: data,
    isLoading: shouldFetch && !error && !data,
    isError: error,
    mutate,
  };
}
