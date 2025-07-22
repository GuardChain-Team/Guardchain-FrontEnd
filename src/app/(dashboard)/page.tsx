// src/app/(dashboard)/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeAlerts } from "@/hooks/use-realtime-alerts";
import { useRealtimeActivity } from "@/hooks/use-realtime-activity";
import { useSystemHealth } from "@/hooks/use-system-health";
import { AlertStatus } from "@/types/global";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ChartBarIcon, // Tambah import yang hilang
} from "@heroicons/react/24/outline";

// ...existing code...



export default function DashboardPage() {
  const { activity: recentActivities, isLoading: activityLoading } = useRealtimeActivity();
  const { health: systemHealth, isLoading: healthLoading } = useSystemHealth();
  // Real-time alerts and toast
  const {
    alerts,
    isLoading: alertsLoading,
    mutate: mutateAlerts,
  } = useRealtimeAlerts();
  const { toast } = useToast();

  // Real-time metrics from alerts
  const [realTimeData, setRealTimeData] = useState({
    totalAlerts: { value: 0, change: 0, trend: "up" },
    highRiskAlerts: { value: 0, change: 0, trend: "up" },
    detectionRate: { value: 0, change: 0, trend: "up" },
    avgResponseTime: { value: 0, change: 0, trend: "down" },
    blockedAmount: { value: 0, change: 0, trend: "up" },
    falsePositiveRate: { value: 0, change: 0, trend: "down" },
  });

  useEffect(() => {
    if (!alerts) return;
    // Calculate metrics from alerts
    const totalAlerts = alerts.length;
    const highRiskAlerts = alerts.filter(
      (a) => a.severity === "HIGH" || a.severity === "CRITICAL"
    ).length;
    // No amount property, so blockedAmount is just count of blocked alerts
    const blockedAmount = alerts.filter(
      (a) => a.status === AlertStatus.ESCALATED
    ).length;
    setRealTimeData((prev) => ({
      ...prev,
      totalAlerts: {
        value: totalAlerts,
        change: totalAlerts - prev.totalAlerts.value,
        trend: totalAlerts >= prev.totalAlerts.value ? "up" : "down",
      },
      highRiskAlerts: {
        value: highRiskAlerts,
        change: highRiskAlerts - prev.highRiskAlerts.value,
        trend: highRiskAlerts >= prev.highRiskAlerts.value ? "up" : "down",
      },
      blockedAmount: {
        value: blockedAmount,
        change: blockedAmount - prev.blockedAmount.value,
        trend: blockedAmount >= prev.blockedAmount.value ? "up" : "down",
      },
    }));
  }, [alerts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "Under Review":
        return "warning";
      case "Resolved":
        return "success";
      case "Escalated":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fraud Detection Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and analytics for your fraud detection system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            Live
          </Badge>
          <span className="text-sm text-gray-500">Last updated: just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeData.totalAlerts.value.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {realTimeData.totalAlerts.trend === "up" ? (
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  realTimeData.totalAlerts.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {realTimeData.totalAlerts.change > 0 ? "+" : ""}
                {realTimeData.totalAlerts.change}%
              </span>
              <span className="ml-1">from last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {realTimeData.highRiskAlerts.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">-8%</span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Detection Rate
            </CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeData.detectionRate.value}%
            </div>
            <Progress
              value={realTimeData.detectionRate.value}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeData.avgResponseTime.value}s
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">-0.3s</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blocked Amount
            </CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(realTimeData.blockedAmount.value)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+15%</span>
              <span className="ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              False Positive
            </CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {realTimeData.falsePositiveRate.value}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">-0.5%</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts - now real-time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Fraud Alerts</CardTitle>
                <CardDescription>
                  Latest alerts requiring attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <EyeIcon className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsLoading ? (
                <div>Loading...</div>
              ) : alerts && alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {alert.alertId}
                          </span>
                          <Badge
                            variant={getSeverityColor(alert.severity) as any}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          {alert.alertType}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{alert.riskScore}</span>
                        <span className="text-sm text-gray-600">
                          Account: {alert.accountId}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col text-right">
                        <Badge
                          variant={getStatusColor(alert.status) as any}
                          className="mb-1"
                        >
                          {alert.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {alert.detectedAt
                            ? new Date(alert.detectedAt).toLocaleTimeString()
                            : "-"}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {/* Block button for actionable alerts */}
                      {alert.status !== AlertStatus.RESOLVED &&
                        alert.status !== AlertStatus.ESCALATED && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `/api/alerts/${alert.id}/block`,
                                  { method: "PATCH" }
                                );
                                if (!res.ok)
                                  throw new Error("Failed to block alert");
                                toast({
                                  title: "Alert blocked",
                                  description: `Alert ${alert.alertId} has been blocked.`,
                                });
                                mutateAlerts();
                              } catch (err) {
                                toast({
                                  title: "Block failed",
                                  description: (err as Error).message,
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Block
                          </Button>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <div>No alerts found.</div>
              )}
            </div>
          </CardContent>
        </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Real-time system status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthLoading ? (
            <div>Loading...</div>
          ) : systemHealth ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API</span>
                <span className={`text-xs font-bold ${systemHealth.status === "healthy" ? "text-green-600" : "text-red-600"}`}>{systemHealth.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className={`text-xs font-bold ${systemHealth.database === "connected" ? "text-green-600" : "text-red-600"}`}>{systemHealth.database}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Users</span>
                <span className="text-xs">{systemHealth.stats.users}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transactions</span>
                <span className="text-xs">{systemHealth.stats.transactions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alerts</span>
                <span className="text-xs">{systemHealth.stats.alerts}</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">Last checked: {new Date(systemHealth.timestamp).toLocaleTimeString()}</div>
            </>
          ) : (
            <div>Failed to load system health.</div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends (24h)</CardTitle>
            <CardDescription>Hourly alert distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Chart component will be implemented
                </p>
                <p className="text-sm text-gray-400">
                  Using Recharts or Chart.js
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Alert severity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-gray-300 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Pie Chart</span>
                </div>
                <p className="text-gray-500">Risk distribution chart</p>
                <p className="text-sm text-gray-400">
                  Critical: 12% | High: 28% | Medium: 45% | Low: 15%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLoading ? (
              <div>Loading...</div>
            ) : recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3 py-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "system" ? "bg-blue-500" : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.event}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))
            ) : (
              <div>No activity found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
