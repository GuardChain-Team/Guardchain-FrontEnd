// src/components/charts/alert-trends-chart.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AlertTrendsData {
  alertTrends: any[];
  severityDistribution: any[];
  alertTypeBreakdown: any[];
  resolutionTrends: any[];
  topRiskFactors: any[];
}

interface AlertTrendsChartProps {
  timeRange?: string;
  className?: string;
}

const SEVERITY_COLORS = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#8b5cf6",
  "#06b6d4",
];

export const AlertTrendsChart: React.FC<AlertTrendsChartProps> = ({
  timeRange = "30d",
  className,
}) => {
  const [data, setData] = useState<AlertTrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedChart, setSelectedChart] = useState("trends");

  useEffect(() => {
    fetchAlertTrends();
  }, [selectedTimeRange]);

  const fetchAlertTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/alert-trends?timeRange=${selectedTimeRange}&groupBy=day`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching alert trends:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const calculateSeverityPercentages = (severityData: any[]) => {
    const total = severityData.reduce((sum, item) => sum + item.count, 0);
    return severityData.map((item) => ({
      ...item,
      percentage: ((item.count / total) * 100).toFixed(1),
    }));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Alert Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Alert Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const severityWithPercentages = calculateSeverityPercentages(
    data.severityDistribution
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alert Analytics</CardTitle>
            <CardDescription>
              Comprehensive analysis of fraud alert trends and patterns
            </CardDescription>
          </div>

          <div className="flex space-x-2">
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedChart} onValueChange={setSelectedChart}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="trends">Alert Trends</TabsTrigger>
            <TabsTrigger value="severity">Severity</TabsTrigger>
            <TabsTrigger value="types">Types</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
          </TabsList>

          {/* Alert Trends Over Time */}
          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Date: ${formatDate(value)}`}
                    formatter={(value: any, name: string) => [
                      value,
                      name === "alertCount"
                        ? "Total Alerts"
                        : name === "avgRiskScore"
                        ? "Avg Risk Score"
                        : name === "criticalCount"
                        ? "Critical"
                        : name === "highCount"
                        ? "High"
                        : name === "mediumCount"
                        ? "Medium"
                        : "Low",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="alertCount"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total Alerts"
                  />
                  <Area
                    type="monotone"
                    dataKey="criticalCount"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.8}
                    name="Critical"
                  />
                  <Area
                    type="monotone"
                    dataKey="highCount"
                    stackId="2"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.8}
                    name="High"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Severity Distribution */}
          <TabsContent value="severity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80">
                <h4 className="text-sm font-medium mb-4">
                  Severity Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityWithPercentages}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="severity"
                    >
                      {severityWithPercentages.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SEVERITY_COLORS[
                              entry.severity as keyof typeof SEVERITY_COLORS
                            ] || CHART_COLORS[index % CHART_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: string) => [value, "Count"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Severity Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Severity Breakdown</h4>
                <div className="space-y-3">
                  {severityWithPercentages.map((item, index) => (
                    <div
                      key={item.severity}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor:
                              SEVERITY_COLORS[
                                item.severity as keyof typeof SEVERITY_COLORS
                              ] || CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                        <div>
                          <div className="font-medium">{item.severity}</div>
                          <div className="text-sm text-gray-500">
                            Avg Risk: {(item.avgRiskScore || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.count}</div>
                        <div className="text-sm text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Alert Types */}
          <TabsContent value="types" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.alertTypeBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="alertType" type="category" width={120} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      value,
                      name === "count" ? "Alert Count" : "Avg Risk Score",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Alert Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Resolution Trends */}
          <TabsContent value="resolution" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.resolutionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Date: ${formatDate(value)}`}
                    formatter={(value: any, name: string) => [
                      name === "avgResolutionTimeHours"
                        ? `${Number(value).toFixed(1)} hours`
                        : value,
                      name === "resolvedCount"
                        ? "Resolved"
                        : name === "truePositives"
                        ? "True Positives"
                        : name === "falsePositives"
                        ? "False Positives"
                        : "Avg Resolution Time",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="resolvedCount"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Resolved Count"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgResolutionTimeHours"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Avg Resolution Time (hours)"
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Risk Factors */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Top Risk Factors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.topRiskFactors.slice(0, 6).map((factor, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium text-sm">{factor.factor}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {factor.frequency} occurrences
                  </span>
                  <Badge variant="outline" className="text-xs">
                    +{(factor.avgRiskIncrease * 100).toFixed(1)}% risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
