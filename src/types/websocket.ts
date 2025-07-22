// src/types/websocket.ts
import { Transaction } from "./transaction";
import { FraudAlert } from "./fraud";
import { Investigation } from "./investigation";

export interface WebSocketMessage {
  type:
    | "auth"
    | "auth_success"
    | "auth_error"
    | "transaction"
    | "alert"
    | "investigation"
    | "analytics";
  data?: WebSocketMessageData;
  message?: string;
  token?: string;
}

export type WebSocketMessageData =
  | { type: "transaction"; data: Transaction }
  | { type: "alert"; data: FraudAlert }
  | { type: "investigation"; data: Investigation }
  | { type: "analytics"; data: AnalyticsUpdate };

export interface AnalyticsUpdate {
  realtimeMetrics: {
    transactionsPerMinute: number;
    alertsGenerated: number;
    riskScore: number;
  };
  periodMetrics: {
    timeframe: "1h" | "24h" | "7d";
    totalTransactions: number;
    totalAlerts: number;
    avgRiskScore: number;
  };
}
