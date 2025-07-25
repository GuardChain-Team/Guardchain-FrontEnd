"use client";
import React from "react";
import { useSystemHealth } from "@/hooks/use-system-health";
import { useRealtimeAlerts } from "@/hooks/use-realtime-alerts";
import { useRealtimeTransactions } from "@/hooks/use-realtime-transactions";
import { useRealtimeActivity } from "@/hooks/use-realtime-activity";
import { useStore } from "@/stores";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { AlertTrendsChart } from "@/components/charts/alert-trends-chart";
import { SimplePieChart } from "@/components/charts/pie-chart";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { BlockTrendAreaChart } from "@/components/charts/block-trend-area-chart";
import { RealTimeLineChart } from "@/components/charts/real-time-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

function getSeverityColor(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-600 text-white";
    case "HIGH":
      return "bg-orange-500 text-white";
    case "MEDIUM":
      return "bg-yellow-400 text-black";
    default:
      return "bg-gray-300 text-black";
  }
}


export default function DashboardPage() {
  const { analytics, isLoading: analyticsLoading, mutate } = useAnalytics();
  const { health: systemHealth, isLoading: healthLoading } = useSystemHealth();

  const router = useRouter();

  // Fallback dummy analytics data if real data is not available
  const fallbackAnalytics = {
    riskDistribution: { high: 10, medium: 20, low: 30 },
    statusDistribution: [
      { status: "BLOCKED", _count: 12 },
      { status: "APPROVED", _count: 88 },
    ],
    recentTransactions: [],
    totalAlerts: 0,
    highRiskAlerts: 0,
    detectionRate: 0,
    responseTime: 0,
    blockedAmount: 0,
    falsePositives: 0,
    recentFraudAlerts: [],
  };
  const analyticsData = analytics || fallbackAnalytics;
  // Only show the last 50 alerts, sorted by most recent
  const recentFraudAlertsSorted = [...(analyticsData.recentFraudAlerts || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 50);

  // KPIs from real-time analytics
  // Total alerts: all alerts
  const totalAlerts = analyticsData.totalAlerts || 0;
  // High risk: all time, from backend
  const highRiskAlerts = analyticsData.highRiskAlerts || 0;
  const detectionRate = analyticsData.detectionRate ? Math.round(analyticsData.detectionRate * 100) : 0;
  const responseTime = analyticsData.responseTime || 0;
  // Blocked transactions count
  const blockedTransactions = analyticsData.statusDistribution
    ? analyticsData.statusDistribution.find((s: any) => s.status === 'BLOCKED')?._count || 0
    : 0;
  const recentFraudAlerts = analyticsData.recentFraudAlerts || [];

  // Block button state indexed by alert ID
  const [blockLoading, setBlockLoading] = React.useState<{ [id: string]: boolean }>({});
  const [blockError, setBlockError] = React.useState<{ [id: string]: string | null }>({});

  // Block transaction handler
  const handleBlockTransaction = async (transactionId: string) => {
    try {
      await fetch(`/api/transactions/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "BLOCKED" }),
      });
      // Optionally: refresh transactions
    } catch (e) {
      alert("Failed to block transaction");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Fraud Detection Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and analytics for your fraud detection system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold text-xs">
            Live
          </span>
          <span className="text-sm text-muted-foreground">
            Last updated: just now
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">Total Alerts</span>
          <span className="text-2xl font-bold text-zinc-900 dark:text-white truncate">{totalAlerts}</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">High Risk</span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400 truncate">{highRiskAlerts}</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">Detection Rate</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 truncate">{detectionRate}%</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">Response Time</span>
          <span className="text-2xl font-bold truncate">{Number(responseTime).toLocaleString(undefined, { maximumFractionDigits: 2 })}s</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">Blocked Transactions</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">{blockedTransactions}</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start min-w-0">
          <span className="text-sm font-medium text-zinc-500 mb-1">False Positives</span>
          <span className="text-2xl font-bold text-yellow-500 dark:text-yellow-400 truncate">{analyticsData.falsePositives || 0}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Fraud Alerts</h2>
          <Button
            variant="secondary"
            className="relative flex items-center gap-2"
            onClick={() => router.push('/alerts')}
          >
            View All
          </Button>
        </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pr-1">
            {analyticsLoading ? (
              <div>Loading...</div>
            ) : recentFraudAlertsSorted && recentFraudAlertsSorted.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pr-1">
                {recentFraudAlertsSorted.map((alert: any) => (
                  <div
                    key={alert.id}
                    className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-[#181f2a] border-zinc-200 dark:border-zinc-800 shadow hover:bg-zinc-50 dark:hover:bg-[#232b3a] transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-white">
                        {alert.title || alert.id}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="ml-2 text-xs text-zinc-500">
                        {alert.category || alert.type}
                      </span>
                      {/* Block button for HIGH/CRITICAL alerts that are not already blocked */}
                      {(alert.severity === "HIGH" || alert.severity === "CRITICAL") && alert.status !== "Blocked" && (
                        <button
                          className="ml-2 px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50"
                          disabled={!!blockLoading[alert.id]}
                          onClick={async () => {
                            setBlockLoading((prev) => ({ ...prev, [alert.id]: true }));
                            setBlockError((prev) => ({ ...prev, [alert.id]: null }));
                            try {
                              const res = await fetch(`/api/alerts/${alert.id}/block`, { method: "PATCH" });
                              if (!res.ok) {
                                let errorMsg = "Failed to block alert";
                                const text = await res.text();
                                try {
                                  const data = JSON.parse(text);
                                  errorMsg = data.error || errorMsg;
                                } catch (jsonErr) {
                                  // Not JSON, log raw text (likely HTML error page)
                                  console.error("Block API non-JSON error:", text);
                                  errorMsg = text.slice(0, 200);
                                }
                                throw new Error(errorMsg);
                              }
                              if (typeof mutate === 'function') mutate();
                            } catch (err: any) {
                              setBlockError((prev) => ({ ...prev, [alert.id]: err.message || "Failed to block alert" }));
                              window.alert(err.message || "Failed to block alert");
                            } finally {
                              setBlockLoading((prev) => ({ ...prev, [alert.id]: false }));
                            }
                          }}
                        >
                          {blockLoading[alert.id] ? "Blocking..." : "Block"}
                        </button>
                      )}
                      {alert.status === "Blocked" && (
                        <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-400 text-white">Blocked</span>
                      )}
                      {blockError[alert.id] && (
                        <span className="ml-2 text-xs text-red-500">{blockError[alert.id]}</span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mt-2 md:mt-0">
                      {alert.createdAt
                        ? new Date(alert.createdAt).toLocaleTimeString()
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No alerts found.</div>
            )}
          </div>
        </div>
        {/* System Health */}
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col h-full justify-between min-h-[220px]">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="flex flex-col flex-1 justify-evenly gap-2">
            {healthLoading || !systemHealth ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* API Health */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        systemHealth.status === "healthy"
                          ? "bg-green-500"
                          : systemHealth.status === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      API
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {systemHealth.message}
                  </div>
                </div>
                {/* Database Health */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      Database
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {systemHealth.database}
                  </div>
                </div>
                {/* WebSocket Health (demo: always active) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      WebSocket
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">active</div>
                </div>
                {/* Realtime Engine Health (demo: always healthy) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      Realtime Engine
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">healthy</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* First row: 2 charts side by side */}
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col gap-8">
          <h3 className="text-lg font-semibold mb-2">Risk Distribution (Pie)</h3>
          {!analyticsData.riskDistribution ? (
            <div>Loading analytics...</div>
          ) : (
            <>
              <SimplePieChart
                data={[
                  { name: "High", value: analyticsData.riskDistribution.high ?? 0 },
                  { name: "Medium", value: analyticsData.riskDistribution.medium ?? 0 },
                  { name: "Low", value: analyticsData.riskDistribution.low ?? 0 },
                ]}
              />
            </>
          )}
        </div>
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col gap-8">
          <h3 className="text-lg font-semibold mb-2">Block Trend (Area)</h3>
          <BlockTrendAreaChart />
        </div>
      </div>
      <div className="mt-6">
        {/* Second row: Real-time Alerts full width */}
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col gap-8 w-full">
          <h3 className="text-lg font-semibold mb-2">Real-time Alerts (Last 6 Hours)</h3>
          {!analyticsData.recentTransactions ? (
            <div>Loading analytics...</div>
          ) : (
            <>
              <RealTimeLineChart
                data={analyticsData.recentTransactions
                  .filter((t: any) => {
                    const now = new Date();
                    const created = new Date(t.createdAt);
                    return now.getTime() - created.getTime() <= 6 * 60 * 60 * 1000;
                  })
                  .map((t: any) => {
                    const d = new Date(t.createdAt);
                    // Format: 'Jul 23, 14:00' or '23:00' if same day
                    const now = new Date();
                    let label;
                    if (
                      d.getDate() !== now.getDate() ||
                      d.getMonth() !== now.getMonth() ||
                      d.getFullYear() !== now.getFullYear()
                    ) {
                      label = d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    } else {
                      label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return {
                      name: label,
                      value: t.riskScore,
                    };
                  })
                }
                height={350}
              />
            </>
          )}
        </div>
      </div>

      {/* Charts Section Only, with dark/abu tua background for estetik */}
    </div>
  );
}
