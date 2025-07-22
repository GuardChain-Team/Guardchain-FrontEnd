import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useStore } from "@/stores";

// Initialize socket connection
const socket = io("http://localhost:8000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export function initializeRealtime() {
  // Get store actions
  const store = useStore.getState();

  socket.on("connect", () => {
    console.log("🔌 Connected to realtime server");
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected from realtime server");
  });

  socket.on("newTransaction", (transaction) => {
    console.log("📥 New transaction:", transaction);
    store.addTransaction(transaction);

    // Create alert if high risk
    if (transaction.riskScore > 0.7) {
      store.addAlert({
        type: "HIGH_RISK_TRANSACTION",
        title: "High Risk Transaction Detected",
        message: `Transaction ${transaction.id} has a risk score of ${transaction.riskScore}`,
        severity: "high",
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("analyticsUpdate", (analytics) => {
    console.log("📊 Analytics update:", analytics);
    store.updateAnalytics(analytics);
  });

  socket.on("error", (error) => {
    console.error("❌ Realtime error:", error);
    store.addAlert({
      type: "CONNECTION_ERROR",
      title: "Realtime Connection Error",
      message: "Lost connection to realtime server",
      severity: "error",
      timestamp: new Date().toISOString(),
    });
  });

  return socket;
}
