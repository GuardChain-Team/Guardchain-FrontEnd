"use client";

import { useRealtimeTransactions } from "@/hooks/use-realtime-transactions";
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

export default function TransactionsPage() {
  const router = useRouter();
  const { transactions, isLoading, isError } = useRealtimeTransactions();

  const handleViewTransaction = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => {
        const transactionId = row.getValue("transactionId") as string;
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{transactionId}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewTransaction(row.original.transactionId)}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: row.original.currency || "IDR",
        }).format(amount);
        return formatted;
      },
    },
    {
      accessorKey: "senderAccountId",
      header: "From",
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
