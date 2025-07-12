// src/app/(dashboard)/transactions/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowRightIcon,
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarIcon,
  InformationCircleIcon,
  LinkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { TransactionStatus, PaymentMethod, Channel } from "@/types/global";
import {
  TransactionType,
  Transaction,
  Account,
  AccountType,
  RiskAssessment,
  DeviceInfo,
} from "@/types/transaction";

// Extended mock data for transaction detail
const mockTransactionDetail: Transaction = {
  id: "1",
  transactionId: "TXN-1234567890",
  senderAccountId: "ACC-9876543210",
  receiverAccountId: "ACC-1234567890",
  amount: 50000000,
  currency: "IDR",
  transactionType: TransactionType.TRANSFER,
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  channel: Channel.MOBILE_APP,
  status: TransactionStatus.BLOCKED,
  transactionTime: "2025-01-05T02:30:00Z",
  description:
    "Transfer ke rekening bisnis untuk pembayaran invoice #INV-2025-001. Pembayaran untuk kontrak jasa konsultasi teknologi periode Januari 2025.",
  reference: "INV-2025-001",
  location: {
    country: "Indonesia",
    region: "DKI Jakarta",
    city: "Jakarta Selatan",
    latitude: -6.2297,
    longitude: 106.8261,
    ipAddress: "103.xxx.xxx.xxx",
    timezone: "Asia/Jakarta",
  },
  deviceInfo: {
    deviceId: "dev-123456789",
    deviceType: "MOBILE",
    os: "Android 14",
    browser: "GuardChain Mobile App",
    userAgent: "GuardChain-Mobile/1.0.5 (Android 14; SM-G998B)",
    fingerprint: "abc123xyz789def456",
    isTrusted: false,
    isJailbroken: false,
    lastSeenAt: "2025-01-05T02:30:00Z",
  },
  riskScore: 0.95,
  riskAssessment: {
    overallRisk: 0.95,
    factors: {
      velocityRisk: 0.8,
      patternRisk: 0.9,
      locationRisk: 0.6,
      deviceRisk: 0.7,
      networkRisk: 0.5,
    },
    recommendations: [
      "Immediate review required due to high risk score (95%)",
      "Verify customer identity through additional authentication",
      "Check for potential fraud patterns in recent transactions",
      "Consider temporary account restrictions pending investigation",
      "Review device fingerprint and location consistency",
    ],
    computedAt: "2025-01-05T02:30:00Z",
  },
  fees: [
    {
      type: "PROCESSING",
      amount: 2500,
      currency: "IDR",
      description: "Transfer processing fee",
    },
    {
      type: "NETWORK",
      amount: 1000,
      currency: "IDR",
      description: "Inter-bank network fee",
    },
  ],
  metadata: {
    attemptCount: 1,
    userAgent: "GuardChain-Mobile/1.0.5",
    sessionId: "sess-abc123xyz789",
    correlationId: "corr-def456uvw123",
    merchantCategory: "Business Services",
    fraudCheckVersion: "v2.1.5",
  },
  createdAt: "2025-01-05T02:30:00Z",
  updatedAt: "2025-01-05T02:31:00Z",
};

// Enhanced account details
const mockAccountDetails: Record<string, Account> = {
  "ACC-9876543210": {
    id: "acc-1",
    accountId: "ACC-9876543210",
    accountNumber: "1234567890",
    accountType: AccountType.SAVINGS,
    holderName: "Ahmad Wijaya",
    bankCode: "008",
    bankName: "Bank Mandiri",
    currency: "IDR",
    balance: 150000000,
    status: "ACTIVE" as any,
    openedAt: "2020-01-15T00:00:00Z",
    isVerified: true,
    riskProfile: {
      level: "MEDIUM",
      score: 0.6,
      factors: ["new-device", "high-value-transaction", "off-hours-activity"],
      lastUpdated: "2025-01-05T00:00:00Z",
      history: [
        {
          date: "2025-01-05T00:00:00Z",
          level: "MEDIUM",
          score: 0.6,
          reason: "Suspicious device detected",
        },
        {
          date: "2025-01-01T00:00:00Z",
          level: "LOW",
          score: 0.2,
          reason: "Normal activity pattern",
        },
      ],
    },
    createdAt: "2020-01-15T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
  "ACC-1234567890": {
    id: "acc-2",
    accountId: "ACC-1234567890",
    accountNumber: "0987654321",
    accountType: AccountType.BUSINESS,
    holderName: "CV. Global Trading Indonesia",
    bankCode: "014",
    bankName: "Bank Central Asia (BCA)",
    currency: "IDR",
    balance: 500000000,
    status: "ACTIVE" as any,
    openedAt: "2018-05-20T00:00:00Z",
    isVerified: true,
    riskProfile: {
      level: "LOW",
      score: 0.2,
      factors: ["verified-business", "established-history"],
      lastUpdated: "2025-01-05T00:00:00Z",
      history: [
        {
          date: "2025-01-05T00:00:00Z",
          level: "LOW",
          score: 0.2,
          reason: "Regular business account",
        },
      ],
    },
    createdAt: "2018-05-20T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
};

// Transaction timeline/history
const transactionTimeline = [
  {
    id: "1",
    timestamp: "2025-01-05T02:31:15Z",
    action: "Transaction Blocked",
    details:
      "Transaction automatically blocked by fraud detection system due to high risk score (95%)",
    actor: "Fraud Detection System",
    status: "CRITICAL",
  },
  {
    id: "2",
    timestamp: "2025-01-05T02:30:45Z",
    action: "Risk Assessment Completed",
    details:
      "ML model analysis completed with 95% confidence score. Multiple risk factors detected.",
    actor: "ML Engine v2.1.5",
    status: "WARNING",
  },
  {
    id: "3",
    timestamp: "2025-01-05T02:30:30Z",
    action: "Device Verification Failed",
    details:
      "Unknown device detected. Device fingerprint does not match known trusted devices.",
    actor: "Device Security",
    status: "WARNING",
  },
  {
    id: "4",
    timestamp: "2025-01-05T02:30:15Z",
    action: "OTP Verification Successful",
    details: "SMS OTP verified successfully for transaction authorization",
    actor: "Authentication Service",
    status: "SUCCESS",
  },
  {
    id: "5",
    timestamp: "2025-01-05T02:30:00Z",
    action: "Transaction Initiated",
    details: "Transfer request submitted via mobile application",
    actor: "Ahmad Wijaya",
    status: "INFO",
  },
  {
    id: "6",
    timestamp: "2025-01-05T02:29:45Z",
    action: "Session Authenticated",
    details: "User successfully logged in with biometric authentication",
    actor: "Authentication Service",
    status: "SUCCESS",
  },
];

// Related transactions
const relatedTransactions = [
  {
    id: "TXN-1234567889",
    amount: 2500000,
    type: "TRANSFER",
    status: "COMPLETED",
    time: "2025-01-04T15:30:00Z",
    description: "Regular monthly transfer",
  },
  {
    id: "TXN-1234567888",
    amount: 150000,
    type: "PAYMENT",
    status: "COMPLETED",
    time: "2025-01-04T10:15:00Z",
    description: "E-commerce payment",
  },
  {
    id: "TXN-1234567887",
    amount: 5000000,
    type: "TRANSFER",
    status: "COMPLETED",
    time: "2025-01-03T09:20:00Z",
    description: "Business transfer",
  },
];

interface TransactionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction>(
    mockTransactionDetail
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");

  // Get params and set transaction ID
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setTransactionId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Simulate loading transaction detail
  useEffect(() => {
    if (!transactionId) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [transactionId]);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return "default";
      case TransactionStatus.PENDING:
        return "secondary";
      case TransactionStatus.FAILED:
        return "destructive";
      case TransactionStatus.CANCELLED:
        return "outline";
      case TransactionStatus.BLOCKED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <CheckCircleIcon className="h-4 w-4" />;
      case TransactionStatus.PENDING:
        return <ClockIcon className="h-4 w-4" />;
      case TransactionStatus.FAILED:
        return <XCircleIcon className="h-4 w-4" />;
      case TransactionStatus.CANCELLED:
        return <XCircleIcon className="h-4 w-4" />;
      case TransactionStatus.BLOCKED:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TRANSFER:
        return <ArrowRightIcon className="h-5 w-5" />;
      case TransactionType.PAYMENT:
        return <CreditCardIcon className="h-5 w-5" />;
      case TransactionType.WITHDRAWAL:
        return <ArrowUpIcon className="h-5 w-5" />;
      case TransactionType.DEPOSIT:
        return <ArrowDownIcon className="h-5 w-5" />;
      default:
        return <BanknotesIcon className="h-5 w-5" />;
    }
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case Channel.MOBILE_APP:
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case Channel.WEB:
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case Channel.ATM:
        return <CreditCardIcon className="h-4 w-4" />;
      default:
        return <BanknotesIcon className="h-4 w-4" />;
    }
  };

  const getRiskFactorColor = (value: number) => {
    if (value >= 0.8) return "text-red-600 dark:text-red-400";
    if (value >= 0.6) return "text-orange-600 dark:text-orange-400";
    if (value >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return "bg-red-500";
      case "WARNING":
        return "bg-orange-500";
      case "SUCCESS":
        return "bg-green-500";
      case "INFO":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const txnTime = new Date(dateStr);
    const diffMs = now.getTime() - txnTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 60) {
      return `${diffMinutes} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} hari yang lalu`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTransactionAction = (action: string) => {
    setSelectedAction(action);
    // Here you would normally call an API to update the transaction
    console.log(
      `Performing action: ${action} on transaction ${transaction.transactionId}`
    );

    // Update local state for demo
    let newStatus = transaction.status;
    switch (action) {
      case "approve":
        newStatus = TransactionStatus.COMPLETED;
        break;
      case "reject":
        newStatus = TransactionStatus.FAILED;
        break;
      case "cancel":
        newStatus = TransactionStatus.CANCELLED;
        break;
    }

    setTransaction((prev) => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }));

    setSelectedAction(null);
  };

  const handleViewAccount = (accountId: string) => {
    router.push(`/accounts/${accountId}`);
  };

  const handleViewAlert = () => {
    router.push(`/alerts/1`); // Navigate to related alert
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const senderAccount = mockAccountDetails[transaction.senderAccountId];
  const receiverAccount = mockAccountDetails[transaction.receiverAccountId];

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Transactions
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {getTypeIcon(transaction.transactionType)}
              {transaction.transactionId}
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatDateTime(transaction.transactionTime)} •{" "}
              {formatRelativeTime(transaction.transactionTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant={getStatusColor(transaction.status) as any}
            className="flex items-center gap-1"
          >
            {getStatusIcon(transaction.status)}
            {transaction.status}
          </Badge>
          <Badge variant="outline">{transaction.transactionType}</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5" />
                    Transaction Overview
                  </CardTitle>
                  <CardDescription>{transaction.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <EllipsisVerticalIcon className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Transaction Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {transaction.status === TransactionStatus.BLOCKED && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleTransactionAction("approve")}
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Approve Transaction
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTransactionAction("reject")}
                        >
                          <XCircleIcon className="h-4 w-4 mr-2" />
                          Reject Transaction
                        </DropdownMenuItem>
                      </>
                    )}
                    {transaction.status === TransactionStatus.PENDING && (
                      <DropdownMenuItem
                        onClick={() => handleTransactionAction("cancel")}
                      >
                        <StopIcon className="h-4 w-4 mr-2" />
                        Cancel Transaction
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(transaction.transactionId)}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                      Copy Transaction ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Export Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleViewAlert}>
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      View Related Alert
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Section */}
              <div className="text-center p-6 border border-border rounded-lg bg-accent/5">
                <div className="text-4xl font-bold text-foreground">
                  {formatCurrency(transaction.amount)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Transaction Amount
                </p>
                {transaction.fees && transaction.fees.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {transaction.fees.map((fee, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        {fee.description}: {formatCurrency(fee.amount)}
                      </p>
                    ))}
                    <Separator className="my-2" />
                    <p className="text-sm font-medium">
                      Total:{" "}
                      {formatCurrency(
                        transaction.amount +
                          transaction.fees.reduce(
                            (sum, fee) => sum + fee.amount,
                            0
                          )
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Account Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Sender */}
                <div className="text-center">
                  <div className="border border-border rounded-lg p-4">
                    <UserIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">Sender</h4>
                    <button
                      onClick={() =>
                        handleViewAccount(transaction.senderAccountId)
                      }
                      className="text-sm text-primary hover:underline"
                    >
                      {senderAccount.holderName}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {senderAccount.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {senderAccount.bankName}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRightIcon className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Receiver */}
                <div className="text-center">
                  <div className="border border-border rounded-lg p-4">
                    <UserIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">Receiver</h4>
                    <button
                      onClick={() =>
                        handleViewAccount(transaction.receiverAccountId)
                      }
                      className="text-sm text-primary hover:underline"
                    >
                      {receiverAccount.holderName}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {receiverAccount.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {receiverAccount.bankName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Transaction ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">
                        {transaction.transactionId}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(transaction.transactionId)
                        }
                      >
                        <DocumentDuplicateIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Reference
                    </span>
                    <p className="font-mono text-sm">
                      {transaction.reference || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Payment Method
                    </span>
                    <p className="text-sm">{transaction.paymentMethod}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Channel
                    </span>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(transaction.channel)}
                      <p className="text-sm">{transaction.channel}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Currency
                    </span>
                    <p className="text-sm">{transaction.currency}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <p className="text-sm">
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="risk-analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="location-device">
                Location & Device
              </TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            {/* Risk Analysis Tab */}
            <TabsContent value="risk-analysis">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    Risk Assessment Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed fraud risk analysis and ML model predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Risk Score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Overall Risk Score
                        </span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {(transaction.riskScore! * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={transaction.riskScore! * 100}
                        className="h-3"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        High risk transaction - immediate review required
                      </p>
                    </div>

                    {/* Risk Factors Breakdown */}
                    {transaction.riskAssessment && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Risk Factors Analysis</h4>
                        {Object.entries(transaction.riskAssessment.factors).map(
                          ([factor, value]) => (
                            <div key={factor} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">
                                  {factor.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span
                                  className={`text-sm font-semibold ${getRiskFactorColor(
                                    value
                                  )}`}
                                >
                                  {(value * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={value * 100} className="h-2" />
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    {transaction.riskAssessment?.recommendations && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">ML Recommendations</h4>
                        <div className="space-y-2">
                          {transaction.riskAssessment.recommendations.map(
                            (recommendation, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-3 border border-border rounded-lg"
                              >
                                <InformationCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-foreground">
                                  {recommendation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Location & Device Tab */}
            <TabsContent value="location-device">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Location & Device Information
                  </CardTitle>
                  <CardDescription>
                    Geographic and device details for this transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" />
                        Location Details
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Country:
                          </span>
                          <p className="font-medium">
                            {transaction.location?.country}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Region:
                          </span>
                          <p className="font-medium">
                            {transaction.location?.region}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            City:
                          </span>
                          <p className="font-medium">
                            {transaction.location?.city}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            IP Address:
                          </span>
                          <p className="font-mono text-sm">
                            {transaction.location?.ipAddress}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Timezone:
                          </span>
                          <p className="text-sm">
                            {transaction.location?.timezone}
                          </p>
                        </div>
                        {transaction.location?.latitude &&
                          transaction.location?.longitude && (
                            <div>
                              <span className="text-sm text-muted-foreground">
                                Coordinates:
                              </span>
                              <p className="font-mono text-sm">
                                {transaction.location.latitude},{" "}
                                {transaction.location.longitude}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Device Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ComputerDesktopIcon className="h-4 w-4" />
                        Device Information
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Device Type:
                          </span>
                          <div className="flex items-center gap-2">
                            {transaction.deviceInfo?.deviceType === "MOBILE" ? (
                              <DevicePhoneMobileIcon className="h-4 w-4" />
                            ) : (
                              <ComputerDesktopIcon className="h-4 w-4" />
                            )}
                            <p className="font-medium">
                              {transaction.deviceInfo?.deviceType}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Operating System:
                          </span>
                          <p className="font-medium">
                            {transaction.deviceInfo?.os}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Browser/App:
                          </span>
                          <p className="font-medium">
                            {transaction.deviceInfo?.browser}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Device ID:
                          </span>
                          <p className="font-mono text-sm">
                            {transaction.deviceInfo?.deviceId}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Device Fingerprint:
                          </span>
                          <p className="font-mono text-sm">
                            {transaction.deviceInfo?.fingerprint}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Trusted:
                            </span>
                            <Badge
                              variant={
                                transaction.deviceInfo?.isTrusted
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {transaction.deviceInfo?.isTrusted ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {transaction.deviceInfo?.isJailbroken !==
                            undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Jailbroken:
                              </span>
                              <Badge
                                variant={
                                  transaction.deviceInfo.isJailbroken
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {transaction.deviceInfo.isJailbroken
                                  ? "Yes"
                                  : "No"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    Transaction Timeline
                  </CardTitle>
                  <CardDescription>
                    Chronological events and system actions for this transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionTimeline.map((event, index) => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${getTimelineStatusColor(
                              event.status
                            )}`}
                          />
                          {index < transactionTimeline.length - 1 && (
                            <div className="w-px h-12 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">
                              {event.action}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.details}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>by {event.actor}</span>
                            <span>{formatDateTime(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5" />
                    Technical Metadata
                  </CardTitle>
                  <CardDescription>
                    Technical details and system information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">System Information</h4>
                      <div className="space-y-3">
                        {transaction.metadata &&
                          Object.entries(transaction.metadata).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="text-sm text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <p className="font-mono text-sm">
                                  {String(value)}
                                </p>
                              </div>
                            )
                          )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Audit Trail</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Created At:
                          </span>
                          <p className="text-sm">
                            {formatDateTime(transaction.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Last Updated:
                          </span>
                          <p className="text-sm">
                            {formatDateTime(transaction.updatedAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Risk Assessment Date:
                          </span>
                          <p className="text-sm">
                            {transaction.riskAssessment?.computedAt
                              ? formatDateTime(
                                  transaction.riskAssessment.computedAt
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            User Agent:
                          </span>
                          <p className="font-mono text-xs break-all">
                            {transaction.deviceInfo?.userAgent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transaction.status === TransactionStatus.BLOCKED && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => handleTransactionAction("approve")}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve Transaction
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleTransactionAction("reject")}
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject Transaction
                  </Button>
                </>
              )}
              {transaction.status === TransactionStatus.PENDING && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleTransactionAction("cancel")}
                >
                  <StopIcon className="h-4 w-4 mr-2" />
                  Cancel Transaction
                </Button>
              )}
              <Separator />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewAlert}
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                View Related Alert
              </Button>
              <Button variant="outline" className="w-full">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full">
                <LinkIcon className="h-4 w-4 mr-2" />
                Share Transaction
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fees</span>
                <span className="font-semibold">
                  {transaction.fees
                    ? formatCurrency(
                        transaction.fees.reduce(
                          (sum, fee) => sum + fee.amount,
                          0
                        )
                      )
                    : "No fees"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Risk Score
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {transaction.riskScore
                    ? `${(transaction.riskScore * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Processing Time
                </span>
                <span className="font-semibold">
                  {Math.floor(
                    (new Date(transaction.updatedAt).getTime() -
                      new Date(transaction.createdAt).getTime()) /
                      1000
                  )}
                  s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Channel</span>
                <span className="font-semibold">{transaction.channel}</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Sender Account</h4>
                <div className="space-y-1">
                  <button
                    onClick={() =>
                      handleViewAccount(transaction.senderAccountId)
                    }
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {senderAccount.holderName}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {senderAccount.accountNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {senderAccount.bankName}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Risk: {senderAccount.riskProfile.level}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">Receiver Account</h4>
                <div className="space-y-1">
                  <button
                    onClick={() =>
                      handleViewAccount(transaction.receiverAccountId)
                    }
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {receiverAccount.holderName}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {receiverAccount.accountNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {receiverAccount.bankName}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Risk: {receiverAccount.riskProfile.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Related Transactions</CardTitle>
              <CardDescription>
                Recent transactions from sender account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatedTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-2 border border-border rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{txn.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(txn.time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(txn.amount)}
                      </p>
                      <Badge
                        variant={
                          getStatusColor(txn.status as TransactionStatus) as any
                        }
                        className="text-xs"
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={!!selectedAction}
        onOpenChange={() => setSelectedAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedAction} this transaction?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg bg-accent/5">
              <h4 className="font-semibold mb-2">Transaction Details</h4>
              <p className="text-sm text-muted-foreground">
                ID: {transaction.transactionId}
              </p>
              <p className="text-sm text-muted-foreground">
                Amount: {formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                From: {senderAccount.holderName}
              </p>
              <p className="text-sm text-muted-foreground">
                To: {receiverAccount.holderName}
              </p>
            </div>
            {selectedAction === "approve" && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ This transaction will be processed and completed
              </p>
            )}
            {selectedAction === "reject" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                ✗ This transaction will be permanently rejected
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAction(null)}>
              Cancel
            </Button>
            <Button
              variant={selectedAction === "reject" ? "destructive" : "default"}
              onClick={() => handleTransactionAction(selectedAction!)}
            >
              Confirm {selectedAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
