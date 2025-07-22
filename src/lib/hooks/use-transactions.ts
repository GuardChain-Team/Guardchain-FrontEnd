// src/lib/hooks/use-transactions.ts
import useSWR from "swr";
import { useWebSocket } from "../hooks/use-websocket";
import type { Transaction } from "@/types/transaction";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTransactions() {
  const { data, error, mutate } = useSWR<Transaction[]>(
    "/api/transactions",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // WebSocket connection for real-time updates
  useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000",
    onMessage: async (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.type === "newTransaction") {
        // Update local data immediately
        mutate(async (currentData) => {
          if (!currentData) return [message.transaction];
          return [message.transaction, ...currentData];
        }, false);
      }
    },
  });

  return {
    transactions: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
