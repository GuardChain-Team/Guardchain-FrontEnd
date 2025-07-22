import { create } from "zustand";
import type { Transaction } from "@/types/transaction";

interface Alert {
  type: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "high";
  timestamp: string;
}

interface Analytics {
  totalTransactions: number;
  totalAmount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  recentActivity: {
    timestamp: string;
    type: string;
    details: string;
  }[];
}

interface GuardChainState {
  // State
  transactions: Transaction[];
  alerts: Alert[];
  analytics: Analytics;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  addAlert: (alert: Alert) => void;
  updateAnalytics: (analytics: Analytics) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<GuardChainState>((set) => ({
  // Initial state
  transactions: [],
  alerts: [],
  analytics: {
    totalTransactions: 0,
    totalAmount: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 },
    recentActivity: [],
  },
  isLoading: false,
  error: null,

  // Actions
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      analytics: {
        ...state.analytics,
        totalTransactions: state.analytics.totalTransactions + 1,
        totalAmount: state.analytics.totalAmount + transaction.amount,
        riskDistribution: {
          ...state.analytics.riskDistribution,
          [transaction.riskScore >= 0.7
            ? "high"
            : transaction.riskScore >= 0.4
            ? "medium"
            : "low"]:
            state.analytics.riskDistribution[
              transaction.riskScore >= 0.7
                ? "high"
                : transaction.riskScore >= 0.4
                ? "medium"
                : "low"
            ] + 1,
        },
        recentActivity: [
          {
            timestamp: new Date().toISOString(),
            type: "TRANSACTION",
            details: `New ${
              transaction.riskScore >= 0.7 ? "high-risk " : ""
            }transaction of ${transaction.amount} ${transaction.currency}`,
          },
          ...state.analytics.recentActivity.slice(0, 9),
        ],
      },
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      analytics: {
        ...state.analytics,
        recentActivity: [
          {
            timestamp: alert.timestamp,
            type: "ALERT",
            details: alert.title,
          },
          ...state.analytics.recentActivity.slice(0, 9),
        ],
      },
    })),

  updateAnalytics: (analytics) => set({ analytics }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
