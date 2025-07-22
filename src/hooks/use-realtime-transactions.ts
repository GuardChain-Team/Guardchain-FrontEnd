import useSWR from "swr";
import { useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { Transaction as PrismaTransaction } from "@prisma/client";
import { Transaction, TransactionType } from "@/types/transaction";
import { PaymentMethod, Channel, TransactionStatus } from "@/types/global";

let socket: Socket | null = null;

export function useRealtimeTransactions() {
  // SWR hook for fetching initial data and handling revalidation
  const transformTransaction = (
    prismaTransaction: PrismaTransaction
  ): Transaction => {
    return {
      id: prismaTransaction.id,
      transactionId: prismaTransaction.transactionId,
      senderAccountId: prismaTransaction.fromAccount,
      receiverAccountId: prismaTransaction.toAccount,
      amount: prismaTransaction.amount,
      currency: prismaTransaction.currency,
      status: prismaTransaction.status as TransactionStatus,
      transactionTime:
        typeof prismaTransaction.timestamp === "string"
          ? prismaTransaction.timestamp
          : prismaTransaction.timestamp instanceof Date
          ? prismaTransaction.timestamp.toISOString()
          : "",
      description: prismaTransaction.description || undefined,
      location: prismaTransaction.location || undefined,
      riskScore: prismaTransaction.riskScore,
      isBlacklisted: prismaTransaction.isBlacklisted,
      isFlagged: prismaTransaction.isFlagged,
      metadata: prismaTransaction.metadata
        ? JSON.parse(prismaTransaction.metadata)
        : undefined,
      createdAt: new Date(prismaTransaction.createdAt).toISOString(),
      updatedAt: new Date(prismaTransaction.updatedAt).toISOString(),
    };
  };

  const { data, error, mutate } = useSWR<Transaction[]>(
    "/api/transactions",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const prismaTransactions = await response.json();
      return prismaTransactions.map(transformTransaction);
    }
  );

  // Connect to WebSocket
  useEffect(() => {
    if (!socket) {
      socket = io(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001"
      );

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Handle real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new transactions
    socket.on("newTransaction", (prismaTransaction: PrismaTransaction) => {
      const transaction = transformTransaction(prismaTransaction);
      mutate((currentData) => {
        if (!currentData) return [transaction];
        return [transaction, ...currentData];
      }, false);
    });

    // Listen for transaction updates
    socket.on("updateTransaction", (prismaTransaction: PrismaTransaction) => {
      const updatedTransaction = transformTransaction(prismaTransaction);
      mutate((currentData) => {
        if (!currentData) return [updatedTransaction];
        return currentData.map((tx) =>
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        );
      }, false);
    });

    return () => {
      socket?.off("newTransaction");
      socket?.off("updateTransaction");
    };
  }, [mutate]);

  // Function to send a new transaction
  const sendTransaction = useCallback(
    async (
      transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
    ) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      const prismaTransaction: PrismaTransaction = await response.json();
      return transformTransaction(prismaTransaction);
    },
    []
  );

  // Function to update a transaction
  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const prismaTransaction: PrismaTransaction = await response.json();
      return transformTransaction(prismaTransaction);
    },
    []
  );

  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
    sendTransaction,
    updateTransaction,
    mutate,
  };
}
