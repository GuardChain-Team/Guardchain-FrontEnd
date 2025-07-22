// src/types/fraud.ts
import { BaseEntity, AlertSeverity, AlertStatus, LocationData } from "./global";

export interface FraudAlert extends BaseEntity {
  alertId: string;
  transactionId: string;
  accountId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  riskScore: number;
  riskFactors: RiskFactor[];
  description: string;
  assignedTo?: string;
  detectedAt: string;
  resolvedAt?: string;
  evidence?: Evidence[];
  modelVersion: string;
  confidence: number;
  tags?: string[];
  notes?: AlertNote[];
}

export enum AlertType {
  AMOUNT_ANOMALY = "AMOUNT_ANOMALY",
  PATTERN_MATCH = "PATTERN_MATCH",
  NETWORK_RISK = "NETWORK_RISK",
  VELOCITY_CHECK = "VELOCITY_CHECK",
  GEOLOCATION_RISK = "GEOLOCATION_RISK",
  DEVICE_FINGERPRINT = "DEVICE_FINGERPRINT",
  BEHAVIORAL_ANOMALY = "BEHAVIORAL_ANOMALY",
  BLACKLIST_MATCH = "BLACKLIST_MATCH",
  ML_PREDICTION = "ML_PREDICTION",
}

export interface RiskFactor {
  id: string;
  type: string;
  value: string | number;
  weight: number;
  description: string;
  severity: AlertSeverity;
}

export interface Evidence {
  id: string;
  type: "DOCUMENT" | "IMAGE" | "VIDEO" | "SCREENSHOT" | "LOG" | "REPORT";
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
  tags?: string[];
}

export interface AlertNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isInternal: boolean;
}

export interface AlertFilters {
  severity?: AlertSeverity[];
  status?: AlertStatus[];
  alertType?: AlertType[];
  assignedTo?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  riskScoreRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}

export interface AlertAction {
  type:
    | "RESOLVE"
    | "ESCALATE"
    | "ASSIGN"
    | "BLOCK_TRANSACTION"
    | "ADD_NOTE"
    | "FALSE_POSITIVE";
  reason?: string;
  assignTo?: string;
  note?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface FraudPattern {
  id: string;
  name: string;
  description: string;
  pattern: Record<string, string | number | boolean | null>;
  isActive: boolean;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  detectionCount: number;
  falsePositiveRate: number;
}

export interface RiskModel {
  id: string;
  name: string;
  version: string;
  type: "RULE_BASED" | "ML_MODEL" | "HYBRID";
  isActive: boolean;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  deployedAt: string;
  features: string[];
  parameters: Record<string, any>;
}
