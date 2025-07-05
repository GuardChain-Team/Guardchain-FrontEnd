// src/app/(dashboard)/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/helpers';

// Mock data for demonstration
const mockKPIData = {
  totalTransactions: { value: 2847392, change: 12.5, period: 'vs last month' },
  fraudDetected: { value: 1247, change: -8.2, period: 'vs last month' },
  falsePositives: { value: 342, change: -15.3, period: 'vs last month' },
  detectionRate: { value: 94.7, change: 2.1, period: 'vs last month' },
  avgResponseTime: { value: 1.2, change: -18.5, period: 'vs last month' },
  costSavings: { value: 18500000, change: 22.3, period: 'vs last month' }
};

const mockTrendData = [
  { date: '2024-01', transactions: 2400000, fraud: 1200, blocked: 980 },
  { date: '2024-02', transactions: 2200000, fraud: 1100, blocked: 890 },
  { date: '2024-03', transactions: 2600000, fraud: 1350, blocked: 1180 },
  { date: '2024-04', transactions: 2800000, fraud: 1420, blocked: 1250 },
  { date: '2024-05', transactions: 2950000, fraud: 1380, blocked: 1200 },
  { date: '2024-06', transactions: 2847392, fraud: 1247, blocked: 1050 },
];

const mockFraudTypes = [
  { name: 'Identity Theft', value: 35, color: '#ef4444' },
  { name: 'Card Fraud', value: 28, color: '#f97316' },
  { name: 'Account Takeover', value: 18, color: '#eab308' },
  { name: 'Payment Fraud', value: 12, color: '#22c55e' },
  { name: 'Other', value: 7, color: '#3b82f6' }
];

const mockAlertDistribution = [
  { severity: 'Critical', count: 23, percentage: 18 },
  { severity: 'High', count: 45, percentage: 36 },
  { severity: 'Medium', count: 38, percentage: 30 },
  { severity: 'Low', count: 21, percentage: 16 }
];

const mockPerformanceData = [
  { model: 'Neural Network', precision: 94.2, recall: 91.8, f1Score: 93.0 },
  { model: 'Random Forest', precision: 89.5, recall: 87.3, f1Score: 88.4 },
  { model: 'Gradient Boost', precision: 92.1, recall: 89.7, f1Score: 90.9 },
  { model: 'SVM', precision: 87.8, recall: 85.2, f1Score: 86.5 }
];

const mockRealTimeData = {
  currentLoad: 78,
  transactionsPerSecond: 425,
  alertsPerMinute: 12,
  systemHealth: {
    api: 'HEALTHY',
    database: 'HEALTHY',
    mlEngine: 'HEALTHY',
    queue: 'HEALTHY'
  },
  performance: {
    apiLatency: 45,
    dbLatency: 23,
    mlLatency: 156,
    queueDepth: 12
  }
};

// Chart styles for better compatibility
const chartStyles = {
  grid: "stroke-gray-200 dark:stroke-gray-700",
  axis: "stroke-gray-400 dark:stroke-gray-500",
  tooltip: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#374151"
  },
  tooltipDark: {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#f3f4f6"
  }
};

// KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  change, 
  period, 
  icon: Icon, 
  format = 'number',
  trend = 'up'
}: {
  title: string;
  value: number;
  change: number;
  period: string;
  icon: any;
  format?: 'number' | 'currency' | 'percentage' | 'decimal';
  trend?: 'up' | 'down';
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('id-ID', { 
          style: 'currency', 
          currency: 'IDR',
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'decimal':
        return `${val}s`;
      default:
        return new Intl.NumberFormat('id-ID', { 
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(val);
    }
  };

  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeColor = trend === 'up' 
    ? (isPositive ? 'text-green-600' : 'text-red-600')
    : (isNegative ? 'text-green-600' : 'text-red-600');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatValue(value)}
            </p>
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )
              ) : (
                isNegative ? (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-red-600 mr-1" />
                )
              )}
              <span className={cn("text-sm font-medium", changeColor)}>
                {Math.abs(change)}% {period}
              </span>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Real-time Status Component
const RealTimeStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-500';
      case 'DEGRADED': return 'bg-yellow-500';
      case 'DOWN': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Real-time Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">System Load</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${mockRealTimeData.currentLoad}%` }}
                ></div>
              </div>
              <span className="text-sm">{mockRealTimeData.currentLoad}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">TPS</div>
            <div className="text-2xl font-bold text-primary">
              {mockRealTimeData.transactionsPerSecond}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">System Health</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(mockRealTimeData.systemHealth).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="capitalize">{service}</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))}></div>
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Performance Metrics</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>API Latency</span>
              <span>{mockRealTimeData.performance.apiLatency}ms</span>
            </div>
            <div className="flex justify-between">
              <span>DB Latency</span>
              <span>{mockRealTimeData.performance.dbLatency}ms</span>
            </div>
            <div className="flex justify-between">
              <span>ML Latency</span>
              <span>{mockRealTimeData.performance.mlLatency}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Queue Depth</span>
              <span>{mockRealTimeData.performance.queueDepth}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshInterval, setRefreshInterval] = useState(30);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive fraud detection analytics and insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('7d')}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30d')}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('90d')}>
                Last 90 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('1y')}>
                Last year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Transactions"
          value={mockKPIData.totalTransactions.value}
          change={mockKPIData.totalTransactions.change}
          period={mockKPIData.totalTransactions.period}
          icon={ChartBarIcon}
          trend="up"
        />
        <KPICard
          title="Fraud Detected"
          value={mockKPIData.fraudDetected.value}
          change={mockKPIData.fraudDetected.change}
          period={mockKPIData.fraudDetected.period}
          icon={ExclamationTriangleIcon}
          trend="down"
        />
        <KPICard
          title="False Positives"
          value={mockKPIData.falsePositives.value}
          change={mockKPIData.falsePositives.change}
          period={mockKPIData.falsePositives.period}
          icon={EyeIcon}
          trend="down"
        />
        <KPICard
          title="Detection Rate"
          value={mockKPIData.detectionRate.value}
          change={mockKPIData.detectionRate.change}
          period={mockKPIData.detectionRate.period}
          icon={ShieldCheckIcon}
          format="percentage"
          trend="up"
        />
        <KPICard
          title="Avg Response Time"
          value={mockKPIData.avgResponseTime.value}
          change={mockKPIData.avgResponseTime.change}
          period={mockKPIData.avgResponseTime.period}
          icon={ClockIcon}
          format="decimal"
          trend="down"
        />
        <KPICard
          title="Cost Savings"
          value={mockKPIData.costSavings.value}
          change={mockKPIData.costSavings.change}
          period={mockKPIData.costSavings.period}
          icon={CurrencyDollarIcon}
          format="currency"
          trend="up"
        />
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fraud Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fraud Detection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className={chartStyles.grid} />
                    <XAxis 
                      dataKey="date" 
                      className={chartStyles.axis}
                      fontSize={12}
                    />
                    <YAxis className={chartStyles.axis} fontSize={12} />
                    <Tooltip 
                      contentStyle={chartStyles.tooltip}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="fraud"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Fraud Detected"
                    />
                    <Area
                      type="monotone"
                      dataKey="blocked"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Fraud Blocked"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Real-time Status */}
            <RealTimeStatus />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fraud Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Fraud Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockFraudTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {mockFraudTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alert Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlertDistribution.map((item) => (
                    <div key={item.severity} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.severity}</span>
                        <span>{item.count} alerts ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            item.severity === 'Critical' && "bg-red-500",
                            item.severity === 'High' && "bg-orange-500",
                            item.severity === 'Medium' && "bg-yellow-500",
                            item.severity === 'Low' && "bg-green-500"
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume & Fraud Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className={chartStyles.grid} />
                  <XAxis 
                    dataKey="date" 
                    className={chartStyles.axis}
                    fontSize={12}
                  />
                  {/* Fix: Define both YAxis properly */}
                  <YAxis 
                    yAxisId="left" 
                    className={chartStyles.axis} 
                    fontSize={12}
                    orientation="left"
                  />
                  <YAxis 
                    yAxisId="right" 
                    className={chartStyles.axis} 
                    fontSize={12}
                    orientation="right"
                  />
                  <Tooltip 
                    contentStyle={chartStyles.tooltip}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Transactions"
                    yAxisId="left"
                  />
                  <Line
                    type="monotone"
                    dataKey="fraud"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Fraud Cases"
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" className={chartStyles.grid} />
                  <XAxis 
                    dataKey="model" 
                    className={chartStyles.axis}
                    fontSize={12}
                  />
                  <YAxis className={chartStyles.axis} fontSize={12} />
                  <Tooltip 
                    contentStyle={chartStyles.tooltip}
                  />
                  <Legend />
                  <Bar dataKey="precision" fill="#3b82f6" name="Precision" />
                  <Bar dataKey="recall" fill="#10b981" name="Recall" />
                  <Bar dataKey="f1Score" fill="#f59e0b" name="F1 Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeStatus />
            
            <Card>
              <CardHeader>
                <CardTitle>Live Alert Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Suspicious Transaction</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}