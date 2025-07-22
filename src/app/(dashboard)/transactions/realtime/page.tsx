"use client";

import { useEffect } from "react";
import { useStore } from "@/stores";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initializeRealtime } from "@/lib/realtime/client";
import { formatDistanceToNow } from "date-fns";

export default function RealtimeTransactions() {
  const { transactions, analytics, isLoading } = useStore();

  useEffect(() => {
    const socket = initializeRealtime();
    return () => {
      socket.disconnect();
    };
  }, []);

  const getRiskBadge = (score: number) => {
    if (score >= 0.7) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 0.4) return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "BLOCKED":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {
                transactions.filter(
                  (t) =>
                    new Date(t.transactionTime) > new Date(Date.now() - 3600000)
                ).length
              }{" "}
              in the last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(analytics.totalAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between text-xs">
                <span>High Risk</span>
                <span>{analytics.riskDistribution.high}</span>
              </div>
              <Progress
                value={
                  (analytics.riskDistribution.high /
                    analytics.totalTransactions) *
                  100
                }
                className="bg-red-100"
              />

              <div className="flex justify-between text-xs">
                <span>Medium Risk</span>
                <span>{analytics.riskDistribution.medium}</span>
              </div>
              <Progress
                value={
                  (analytics.riskDistribution.medium /
                    analytics.totalTransactions) *
                  100
                }
                className="bg-yellow-100"
              />

              <div className="flex justify-between text-xs">
                <span>Low Risk</span>
                <span>{analytics.riskDistribution.low}</span>
              </div>
              <Progress
                value={
                  (analytics.riskDistribution.low /
                    analytics.totalTransactions) *
                  100
                }
                className="bg-green-100"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.slice(0, 3).map((activity, i) => (
                <div key={i} className="flex items-center">
                  <Badge
                    variant={
                      activity.type === "ALERT" ? "destructive" : "default"
                    }
                    className="mr-2"
                  >
                    {activity.type}
                  </Badge>
                  <div className="text-xs">{activity.details}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Transactions</CardTitle>
          <CardDescription>Monitor transactions as they happen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="font-mono">
                      {transaction.transactionId}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: transaction.currency || "IDR",
                      }).format(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.fromAccount}</TableCell>
                    <TableCell>{transaction.toAccount}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(transaction.riskScore)}
                        <Progress
                          value={transaction.riskScore * 100}
                          className="w-[60px]"
                          indicatorClassName={
                            transaction.riskScore >= 0.7
                              ? "bg-red-500"
                              : transaction.riskScore >= 0.4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(transaction.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))}

                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
