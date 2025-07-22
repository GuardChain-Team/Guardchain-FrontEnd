import useSWR from "swr";

export interface SystemHealth {
  status: string;
  message: string;
  database: string;
  timestamp: string;
  stats: {
    users: number;
    transactions: number;
    alerts: number;
  };
  endpoints: Record<string, string[]>;
}

export function useSystemHealth() {
  const { data, error, mutate } = useSWR<SystemHealth>(
    "/api/health",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch system health");
      return await response.json();
    },
    { refreshInterval: 10000 } // auto refresh every 10s
  );
  return {
    health: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
