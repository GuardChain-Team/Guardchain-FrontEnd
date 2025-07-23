"use client";

import { useRealtimeTransactions } from "@/hooks/use-realtime-transactions";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { ColumnDef } from "@tanstack/react-table";
import { TransactionStatus } from "@/types/global";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function TransactionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { transactions, isLoading, isError, mutate } =
    useRealtimeTransactions();
  const { toast } = useToast ? useToast() : { toast: undefined };

  const handleViewTransaction = (id: string) => {
    router.push(`/transactions/${id}`);
  };

  const handleBlock = async (transactionId: string) => {
    try {
      console.log("DEBUG session", session);
      const authHeader = `Bearer ${session?.user?.id || ""}`;
      console.log("DEBUG Authorization header", authHeader);
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      });
      if (!res.ok) throw new Error("Failed to block transaction");
      if (toast) {
        toast({
          title: "Transaction blocked",
          description: "Transaction has been blocked successfully.",
          variant: "success",
        });
      } else {
        alert("Transaction blocked successfully!");
      }
      mutate(); // Refresh the transaction list
    } catch (e) {
      if (toast) {
        toast({
          title: "Failed to block transaction",
          description: "Could not block transaction.",
          variant: "destructive",
        });
      } else {
        alert("Failed to block transaction");
      }
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => {
        const transactionId = row.getValue("transactionId") as string;
        const status = row.original.status;
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{transactionId}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewTransaction(row.original.id)}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            {status !== "BLOCKED" &&
              (row.original.riskScore >= 0.5 ||
                row.original.isFlagged ||
                row.original.isBlacklisted) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBlock(row.original.id)}
                >
                  Block
                </Button>
              )}
          </div>
        );
      },
    },
    {
      accessorKey: "receiverAccountId",
      header: "To",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TransactionStatus;
        return (
          <Badge
            variant={
              status === TransactionStatus.COMPLETED
                ? "success"
                : status === TransactionStatus.PENDING
                ? "warning"
                : status === TransactionStatus.BLOCKED
                ? "destructive"
                : "default"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "transactionTime",
      header: "Time",
      cell: ({ row }) => {
        return formatDistanceToNow(
          new Date(row.getValue("transactionTime") as string),
          { addSuffix: true }
        );
      },
    },
    {
      accessorKey: "riskScore",
      header: "Risk Score",
      cell: ({ row }) => {
        const score = row.getValue("riskScore") as number;
        return (
          <Badge
            variant={
              score >= 0.8
                ? "destructive"
                : score >= 0.5
                ? "warning"
                : "success"
            }
          >
            {(score * 100).toFixed(0)}%
          </Badge>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center min-h-[300px] text-destructive">
            Error loading transactions. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions || []}
            defaultSort={{ id: "transactionTime", desc: true }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
