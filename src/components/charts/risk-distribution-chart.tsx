// src/components/charts/risk-distribution-chart.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
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

interface RiskDistributionData {
  alertRiskDistribution: any[];
  transactionRiskDistribution: any[];
  severityBreakdown: any[];
  geographicDistribution: any[];
  riskTrends: any[];
}

interface RiskDistributionChartProps {
  timeRange?: string;
  className?: string;
}

const RISK_COLORS = {
  "Very Low Risk": "#22c55e",
  "Low Risk": "#84cc16",
  "Medium Risk": "#eab308",
  "High Risk": "#f97316",
  "Critical Risk": "#ef4444",
};

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#8b5cf6",
];

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  timeRange = "30d",
  className,
}) => {
  const [data, setData] = useState<RiskDistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedView, setSelectedView] = useState("alerts");

  useEffect(() => {
    fetchRiskDistribution();
  }, [selectedTimeRange]);

  const fetchRiskDistribution = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/risk-distribution?timeRange=${selectedTimeRange}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching risk distribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Risk Distribution Analysis</CardTitle>
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
          <CardTitle>Risk Distribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Risk Distribution Analysis</CardTitle>
            <CardDescription>
              Comprehensive analysis of risk score distributions and patterns
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
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="alerts">Alert Risk</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Risk</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          </TabsList>

          {/* Alert Risk Distribution */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution Chart */}
              <div className="h-80">
                <h4 className="text-sm font-medium mb-4">
                  Alert Risk Score Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.alertRiskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        value,
                        name === "count" ? "Alert Count" : "Avg Risk Score",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Alert Count"
                      fill={(entry) =>
                        RISK_COLORS[entry.label as keyof typeof RISK_COLORS] ||
                        "#3b82f6"
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Risk Level Breakdown</h4>
                <div className="space-y-3">
                  {data.alertRiskDistribution.map((item, index) => (
                    <div
                      key={item.range}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor:
                              RISK_COLORS[
                                item.label as keyof typeof RISK_COLORS
                              ] || CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.range} risk score
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.count}</div>
                        <div className="text-xs text-gray-500">
                          Avg: {item.avgRiskScore.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Severity vs Risk Score */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-4">
                Severity vs Risk Score Analysis
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.severityBreakdown} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="severity" type="category" width={80} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name.includes("Risk") ? value.toFixed(3) : value,
                        name === "count"
                          ? "Count"
                          : name === "avgRiskScore"
                          ? "Avg Risk"
                          : name === "minRiskScore"
                          ? "Min Risk"
                          : "Max Risk",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Alert Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Transaction Risk Distribution */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Risk Chart */}
              <div className="h-80">
                <h4 className="text-sm font-medium mb-4">
                  Transaction Risk Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.transactionRiskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name.includes("Amount")
                          ? formatCurrency(value)
                          : name.includes("Risk")
                          ? value.toFixed(3)
                          : value,
                        name === "count"
                          ? "Transaction Count"
                          : name === "avgAmount"
                          ? "Avg Amount"
                          : name === "totalAmount"
                          ? "Total Amount"
                          : "Avg Risk Score",
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="count"
                      fill="#3b82f6"
                      name="Transaction Count"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRiskScore"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Avg Risk Score"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Transaction Risk Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">
                  Transaction Volume by Risk
                </h4>
                <div className="space-y-3">
                  {data.transactionRiskDistribution.map((item, index) => (
                    <div key={item.range} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor:
                                RISK_COLORS[
                                  item.label as keyof typeof RISK_COLORS
                                ] || CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.count} txns
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Total:</span>{" "}
                          {formatCurrency(item.totalAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Avg:</span>{" "}
                          {formatCurrency(item.avgAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Geographic Distribution */}
          <TabsContent value="geographic" className="space-y-4">
            <div className="h-80">
              <h4 className="text-sm font-medium mb-4">
                Geographic Risk Distribution
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={data.geographicDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="transactionCount" name="Transaction Count" />
                  <YAxis dataKey="avgRiskScore" name="Avg Risk Score" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">
                              {data.city}, {data.country}
                            </p>
                            <p className="text-sm">
                              Transactions: {data.transactionCount}
                            </p>
                            <p className="text-sm">
                              Avg Risk: {data.avgRiskScore.toFixed(3)}
                            </p>
                            <p className="text-sm">
                              High Risk: {data.highRiskCount}
                            </p>
                            <p className="text-sm">
                              Total Amount: {formatCurrency(data.totalAmount)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="avgRiskScore" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Top Risk Locations */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-4">
                Highest Risk Locations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.geographicDistribution
                  .slice(0, 6)
                  .map((location, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">{location.city}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        {location.country}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Risk Score:</span>
                          <Badge
                            variant={
                              location.avgRiskScore > 0.7
                                ? "destructive"
                                : location.avgRiskScore > 0.5
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {location.avgRiskScore.toFixed(3)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Transactions:</span>
                          <span>{location.transactionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>High Risk:</span>
                          <span className="text-red-600">
                            {location.highRiskCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Risk Trends Over Time */}
          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <h4 className="text-sm font-medium mb-4">
                Risk Score Trends Over Time
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.riskTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      `Date: ${new Date(value).toLocaleDateString()}`
                    }
                    formatter={(value: any, name: string) => [
                      name.includes("Risk") ? value.toFixed(3) : value,
                      name === "avgRiskScore"
                        ? "Avg Risk Score"
                        : name === "minRiskScore"
                        ? "Min Risk Score"
                        : name === "maxRiskScore"
                        ? "Max Risk Score"
                        : name === "transactionCount"
                        ? "Transaction Count"
                        : "High Risk Count",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avgRiskScore"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Avg Risk Score"
                  />
                  <Area
                    type="monotone"
                    dataKey="maxRiskScore"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Max Risk Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Trend Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {data.riskTrends.length > 0 && (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.riskTrends[
                        data.riskTrends.length - 1
                      ]?.avgRiskScore?.toFixed(3) || "N/A"}
                    </div>
                    <div className="text-sm text-blue-800">Latest Avg Risk</div>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Math.max(
                        ...data.riskTrends.map((d) => d.maxRiskScore)
                      ).toFixed(3)}
                    </div>
                    <div className="text-sm text-red-800">Peak Risk Score</div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.riskTrends
                        .reduce((sum, d) => sum + d.transactionCount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-green-800">
                      Total Transactions
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {data.riskTrends
                        .reduce((sum, d) => sum + d.highRiskCount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-800">
                      High Risk Count
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
