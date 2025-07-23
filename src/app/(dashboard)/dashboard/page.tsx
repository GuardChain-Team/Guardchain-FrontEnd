"use client";
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
import { RealTimeLineChart } from "@/components/charts/real-time-chart";
import { Button } from "@/components/ui/button";

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
  const { alerts, isLoading: alertsLoading } = useRealtimeAlerts();
  const { health: systemHealth, isLoading: healthLoading } = useSystemHealth();
  const { transactions, isLoading: transactionsLoading } =
    useRealtimeTransactions();
  const { activity: recentActivity, isLoading: activityLoading } =
    useRealtimeActivity();

  const store = useStore();
  const { analytics, isLoading: analyticsLoading } = useAnalytics();

  // Fallback dummy analytics data if real data is not available
  const fallbackAnalytics = {
    riskDistribution: { high: 10, medium: 20, low: 30 },
    statusDistribution: [
      { status: "BLOCKED", _count: 12 },
      { status: "APPROVED", _count: 88 },
    ],
    recentTransactions: [
      { id: "1", transactionId: "TX1", amount: 1000, currency: "USD", status: "BLOCKED", riskScore: 0.9, createdAt: "2025-07-23T04:00:00Z" },
      { id: "2", transactionId: "TX2", amount: 500, currency: "USD", status: "APPROVED", riskScore: 0.3, createdAt: "2025-07-23T04:10:00Z" },
      { id: "3", transactionId: "TX3", amount: 2000, currency: "USD", status: "BLOCKED", riskScore: 0.8, createdAt: "2025-07-23T04:20:00Z" },
      { id: "4", transactionId: "TX4", amount: 700, currency: "USD", status: "APPROVED", riskScore: 0.2, createdAt: "2025-07-23T04:30:00Z" },
    ],
  };
  const analyticsData = analytics || fallbackAnalytics;

  // KPI calculation from real-time alerts
  const totalAlerts = alerts ? alerts.length : 0;
  const highRiskAlerts = alerts
    ? alerts.filter((a: any) => a.severity === "HIGH" || a.severity === "CRITICAL").length
    : 0;
  // Placeholder for other KPIs
  const detectionRate = 98.5;
  const avgResponseTime = 2.1;
  const blockedAmount = 2500000;
  const falsePositiveRate = 1.2;

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
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            Total Alerts
          </span>
          <span className="text-2xl font-bold text-zinc-900 dark:text-white">
            {totalAlerts}
          </span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            High Risk
          </span>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
            {highRiskAlerts}
          </span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            Detection Rate
          </span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {detectionRate}%
          </span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            Response Time
          </span>
          <span className="text-2xl font-bold">{avgResponseTime}s</span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            Blocked Amount
          </span>
          <span className="text-2xl font-bold">
            {blockedAmount.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-lg shadow bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 flex flex-col items-start">
          <span className="text-sm font-medium text-zinc-500 mb-1">
            False Positive
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {falsePositiveRate}%
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Fraud Alerts</h2>
            <button className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
              View All
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 pr-1">
            {alertsLoading ? (
              <div>Loading...</div>
            ) : alerts && alerts.length > 0 ? (
              alerts.slice(0, 5).map((alert: any) => (
                <div
                  key={alert.id}
                  className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-[#181f2a] border-zinc-200 dark:border-zinc-800 shadow hover:bg-zinc-50 dark:hover:bg-[#232b3a] transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {alert.alertId || alert.id}
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {alert.alertType || alert.type}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-2 md:mt-0">
                    {alert.createdAt
                      ? new Date(alert.createdAt).toLocaleTimeString()
                      : "-"}
                  </div>
                </div>
              ))
            ) : (
              <div>No alerts found.</div>
            )}
          </div>
        </div>
        {/* System Health */}
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">System Health</h3>
          <div className="space-y-2">
            {healthLoading || !systemHealth ? (
              <div>Loading...</div>
            ) : (
              <>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        systemHealth.database === "healthy"
                          ? "bg-green-500"
                          : systemHealth.database === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      Database
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {systemHealth.database}
                  </div>
                </div>
                {/* Add more health metrics if available in API */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col gap-8">
          <h3 className="text-lg font-semibold mb-2">
            Risk Distribution (Pie)
          </h3>
          {!analyticsData.riskDistribution ? (
            <div>Loading...</div>
          ) : (
            <SimplePieChart
              data={[
                { name: "High", value: analyticsData.riskDistribution.high ?? 0 },
                {
                  name: "Medium",
                  value: analyticsData.riskDistribution.medium ?? 0,
                },
                { name: "Low", value: analyticsData.riskDistribution.low ?? 0 },
              ]}
            />
          )}
          <h3 className="text-lg font-semibold mb-2">Block Count (Bar)</h3>
          {!analyticsData.statusDistribution ? (
            <div>Loading...</div>
          ) : (
            <SimpleBarChart
              data={analyticsData.statusDistribution.map((s: any) => ({
                name: s.status,
                value: s._count,
              }))}
            />
          )}
        </div>
        <div className="bg-white dark:bg-[#181f2a] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow p-4 flex flex-col gap-8">
          <h3 className="text-lg font-semibold mb-2">Block Trend (Area)</h3>
          {/* Area chart: gunakan alertTrends dari AlertTrendsChart jika ingin lebih advance, atau analytics.recentTransactions jika ada time series */}
          {!analyticsData.recentTransactions ? (
            <div>Loading...</div>
          ) : (
            <SimpleAreaChart
              data={analyticsData.recentTransactions.map((t: any) => ({
                name: t.createdAt.slice(0, 10),
                value: t.status === "BLOCKED" ? 1 : 0,
              }))}
            />
          )}
          <h3 className="text-lg font-semibold mb-2">
            Real-time Alerts (Line)
          </h3>
          {/* RealTimeLineChart: gunakan recentAlerts dari useRealtimeAlerts jika ingin time series, atau analytics.recentTransactions */}
          {!analyticsData.recentTransactions ? (
            <div>Loading...</div>
          ) : (
            <RealTimeLineChart
              data={analyticsData.recentTransactions.map((t: any) => ({
                name: t.createdAt.slice(11, 16),
                value: t.riskScore,
              }))}
            />
          )}
        </div>
      </div>

      {/* Charts Section Only, with dark/abu tua background for estetik */}
    </div>
  );
}
