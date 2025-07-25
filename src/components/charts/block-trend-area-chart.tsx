import React from "react";
import { SimpleAreaChart } from "./area-chart";

export function BlockTrendAreaChart() {
  const [data, setData] = React.useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchBlockTrend() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analytics/block-trend");
        if (!res.ok) throw new Error("Failed to fetch block trend");
        const json = await res.json();
        setData(
          (json.data || []).map((row: any) => ({
            name: row.date,
            value: row.value,
          }))
        );
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchBlockTrend();
  }, []);

  if (loading) return <div>Loading block trend...</div>;
  if (error) return <div>Error loading block trend: {error}</div>;
  return <SimpleAreaChart data={data} color="#8884d8" height={300} />;
}
