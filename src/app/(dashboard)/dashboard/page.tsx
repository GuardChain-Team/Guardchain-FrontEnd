// src/app/(dashboard)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// Mock data tetap sama...
const mockMetrics = {
  totalAlerts: { value: 1234, change: 12, trend: 'up' },
  highRiskAlerts: { value: 56, change: -8, trend: 'down' },
  detectionRate: { value: 98.5, change: 2.1, trend: 'up' },
  avgResponseTime: { value: 2.1, change: -0.3, trend: 'down' },
  blockedAmount: { value: 2500000, change: 15, trend: 'up' },
  falsePositiveRate: { value: 1.2, change: -0.5, trend: 'down' },
};

const recentAlerts = [
  {
    id: 'ALERT-001',
    type: 'Amount Anomaly',
    severity: 'HIGH',
    amount: 500000,
    account: '****1234',
    time: '2 minutes ago',
    status: 'Open',
  },
  {
    id: 'ALERT-002',
    type: 'Pattern Match',
    severity: 'CRITICAL',
    amount: 1200000,
    account: '****5678',
    time: '5 minutes ago',
    status: 'Under Review',
  },
  {
    id: 'ALERT-003',
    type: 'Velocity Check',
    severity: 'MEDIUM',
    amount: 150000,
    account: '****9012',
    time: '8 minutes ago',
    status: 'Resolved',
  },
  {
    id: 'ALERT-004',
    type: 'Network Risk',
    severity: 'HIGH',
    amount: 750000,
    account: '****3456',
    time: '12 minutes ago',
    status: 'Escalated',
  },
];

const systemHealth = {
  api: { status: 'healthy', latency: 45 },
  database: { status: 'healthy', latency: 12 },
  mlEngine: { status: 'degraded', latency: 156 },
  queue: { status: 'healthy', depth: 23 },
};

export default function DashboardPage() {
  const [realTimeData, setRealTimeData] = useState(mockMetrics);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalAlerts: {
          ...prev.totalAlerts,
          value: prev.totalAlerts.value + Math.floor(Math.random() * 3),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'Under Review': return 'default';
      case 'Resolved': return 'secondary';
      case 'Escalated': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fraud Detection Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and analytics for your fraud detection system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
            Live
          </Badge>
          <span className="text-sm text-muted-foreground">Last updated: just now</span>
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
            <div className="text-2xl font-bold">{realTimeData.totalAlerts.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {realTimeData.totalAlerts.trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={realTimeData.totalAlerts.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {realTimeData.totalAlerts.change > 0 ? '+' : ''}{realTimeData.totalAlerts.change}%
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
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{realTimeData.highRiskAlerts.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">-8%</span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{realTimeData.detectionRate.value}%</div>
            <Progress value={realTimeData.detectionRate.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.avgResponseTime.value}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">-0.3s</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Amount</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(realTimeData.blockedAmount.value)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+15%</span>
              <span className="ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positive</CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{realTimeData.falsePositiveRate.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowTrendingDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">-0.5%</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Fraud Alerts</CardTitle>
                <CardDescription>Latest alerts requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <EyeIcon className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-foreground">{alert.id}</span>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{alert.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{formatCurrency(alert.amount)}</span>
                      <span className="text-sm text-muted-foreground">Account: {alert.account}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col text-right">
                      <Badge variant={getStatusColor(alert.status) as any} className="mb-1">
                        {alert.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
            {Object.entries(systemHealth).map(([service, health]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      health.status === 'healthy'
                        ? 'bg-green-500'
                        : health.status === 'degraded'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {service.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground capitalize">{health.status}</div>
                  <div className="text-xs text-muted-foreground">
                    {typeof health.latency === 'number' ? `${health.latency}ms` : 
                     typeof health.depth === 'number' ? `${health.depth} items` : ''}
                  </div>
                </div>
              </div>
            ))}
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
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart component will be implemented</p>
                <p className="text-sm text-muted-foreground">Using Recharts or Chart.js</p>
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
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
<div className="text-center">
<div className="w-24 h-24 rounded-full border-4 border-border mx-auto mb-2 flex items-center justify-center">
<span className="text-muted-foreground text-xs">Pie Chart</span>
</div>
<p className="text-muted-foreground">Risk distribution chart</p>
<p className="text-sm text-muted-foreground">Critical: 12% | High: 28% | Medium: 45% | Low: 15%</p>
</div>
</div>
</CardContent>
</Card>
</div>
  {/* Recent Activity */}
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest system events and user actions</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { time: '2 min ago', event: 'High-risk transaction blocked', user: 'System', type: 'system' },
          { time: '5 min ago', event: 'Alert escalated to senior investigator', user: 'John Doe', type: 'user' },
          { time: '8 min ago', event: 'False positive marked for Alert #1234', user: 'Jane Smith', type: 'user' },
          { time: '12 min ago', event: 'New fraud pattern detected', user: 'ML Engine', type: 'system' },
          { time: '15 min ago', event: 'Investigation completed for Case #567', user: 'Mike Johnson', type: 'user' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 py-2">
            <div
              className={`w-2 h-2 rounded-full ${
                activity.type === 'system' ? 'bg-blue-500' : 'bg-green-500'
              }`}
            />
            <div className="flex-1">
              <p className="text-sm text-foreground">{activity.event}</p>
              <p className="text-xs text-muted-foreground">by {activity.user}</p>
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
);
}
