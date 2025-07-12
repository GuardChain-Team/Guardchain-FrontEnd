// src/types/transaction.ts
import {
  BaseEntity,
  TransactionStatus,
  PaymentMethod,
  Channel,
  LocationData,
} from "./global";

export interface Transaction extends BaseEntity {
  transactionId: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  channel: Channel;
  status: TransactionStatus;
  transactionTime: string;
  description?: string;
  reference?: string;
  location?: LocationData;
  deviceInfo?: DeviceInfo;
  riskScore?: number;
  riskAssessment?: RiskAssessment;
  fees?: TransactionFee[];
  metadata?: Record<string, any>;
}

export enum TransactionType {
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
  WITHDRAWAL = "WITHDRAWAL",
  DEPOSIT = "DEPOSIT",
  REFUND = "REFUND",
  REVERSAL = "REVERSAL",
}

export interface Account extends BaseEntity {
  accountId: string;
  accountNumber: string;
  accountType: AccountType;
  holderName: string;
  bankCode?: string;
  bankName?: string;
  currency: string;
  balance?: number;
  status: AccountStatus;
  openedAt: string;
  isVerified: boolean;
  riskProfile: RiskProfile;
}

export enum AccountType {
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING",
  CREDIT = "CREDIT",
  INVESTMENT = "INVESTMENT",
  BUSINESS = "BUSINESS",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
  BLOCKED = "BLOCKED",
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: "MOBILE" | "DESKTOP" | "TABLET" | "UNKNOWN";
  os: string;
  browser?: string;
  userAgent: string;
  fingerprint: string;
  isTrusted: boolean;
  isJailbroken?: boolean;
  lastSeenAt: string;
}

export interface RiskAssessment {
  overallRisk: number;
  factors: {
    velocityRisk: number;
    patternRisk: number;
    locationRisk: number;
    deviceRisk: number;
    networkRisk: number;
  };
  recommendations: string[];
  computedAt: string;
}

export interface RiskProfile {
  level: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  factors: string[];
  lastUpdated: string;
  history: RiskProfileHistory[];
}

export interface RiskProfileHistory {
  date: string;
  level: string;
  score: number;
  reason: string;
}

export interface TransactionFee {
  type: "PROCESSING" | "INTERCHANGE" | "NETWORK" | "SERVICE";
  amount: number;
  currency: string;
  description: string;
}

export interface TransactionFilters {
  accountId?: string;
  transactionType?: TransactionType[];
  paymentMethod?: PaymentMethod[];
  channel?: Channel[];
  status?: TransactionStatus[];
  amountRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  riskScoreRange?: {
    min: number;
    max: number;
  };
  location?: string;
}

export interface TransactionSummary {
  totalCount: number;
  totalAmount: number;
  averageAmount: number;
  currency: string;
  period: string;
  byStatus: Record<TransactionStatus, number>;
  byType: Record<TransactionType, number>;
  byChannel: Record<Channel, number>;
  trends: {
    volumeChange: number;
    amountChange: number;
    riskScoreChange: number;
  };
}
