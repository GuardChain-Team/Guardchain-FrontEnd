// src/app/(dashboard)/alerts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  BellIcon,
  DocumentTextIcon,
  MapPinIcon,
  ComputerDesktopIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  LinkIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknotesIcon,
  InformationCircleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { AlertSeverity, AlertStatus } from '@/types/global';
import { AlertType, FraudAlert, AlertNote, Evidence, RiskFactor } from '@/types/fraud';

// Extended mock data for detail view
const mockAlertDetail: FraudAlert = {
  id: '1',
  alertId: 'ALERT-2025-001',
  transactionId: 'TXN-1234567890',
  accountId: 'ACC-9876543210',
  alertType: AlertType.AMOUNT_ANOMALY,
  severity: AlertSeverity.CRITICAL,
  status: AlertStatus.OPEN,
  riskScore: 0.95,
  riskFactors: [
    {
      id: '1',
      type: 'Amount Deviation',
      value: '500%',
      weight: 0.8,
      description: 'Transaksi 5x lebih besar dari rata-rata user (Rp 2,500,000 → Rp 50,000,000)',
      severity: AlertSeverity.HIGH
    },
    {
      id: '2',
      type: 'Time Pattern',
      value: 'Off-hours',
      weight: 0.6,
      description: 'Transaksi dilakukan pada pukul 02:30 WIB (di luar jam operasional normal)',
      severity: AlertSeverity.MEDIUM
    },
    {
      id: '3',
      type: 'Frequency Anomaly',
      value: '15 transactions/day',
      weight: 0.7,
      description: 'User biasanya melakukan 2-3 transaksi per hari, hari ini sudah 15 transaksi',
      severity: AlertSeverity.MEDIUM
    },
    {
      id: '4',
      type: 'Location Risk',
      value: 'New Location',
      weight: 0.5,
      description: 'Transaksi dari lokasi yang tidak pernah digunakan sebelumnya',
      severity: AlertSeverity.LOW
    }
  ],
  description: 'Transaksi senilai Rp 50,000,000 yang jauh melebihi pola normal pengguna. Analisis mendalam menunjukkan beberapa indikator risiko tinggi yang memerlukan investigasi segera.',
  assignedTo: 'John Doe',
  detectedAt: '2025-01-05T10:30:00Z',
  modelVersion: 'v2.1.5',
  confidence: 0.95,
  tags: ['high-value', 'pattern-break', 'urgent', 'suspicious-timing'],
  notes: [
    {
      id: '1',
      content: 'Alert pertama kali terdeteksi oleh ML model dengan confidence score 95%. Perlu investigasi manual segera.',
      author: 'System',
      createdAt: '2025-01-05T10:30:00Z',
      isInternal: true
    },
    {
      id: '2',
      content: 'Menghubungi customer untuk verifikasi transaksi. Belum ada respons dalam 30 menit.',
      author: 'John Doe',
      createdAt: '2025-01-05T11:00:00Z',
      isInternal: false
    },
    {
      id: '3',
      content: 'Customer dikonfirmasi sedang di luar negeri. Perlu verifikasi tambahan melalui OTP dan video call.',
      author: 'Jane Smith',
      createdAt: '2025-01-05T11:30:00Z',
      isInternal: false
    }
  ],
  evidence: [
    {
      id: '1',
      type: 'SCREENSHOT',
      name: 'transaction_screenshot.png',
      url: '/evidence/transaction_screenshot.png',
      size: 2048576,
      mimeType: 'image/png',
      uploadedAt: '2025-01-05T10:35:00Z',
      uploadedBy: 'System',
      description: 'Screenshot transaksi dari sistem monitoring'
    },
    {
      id: '2',
      type: 'LOG',
      name: 'transaction_log.json',
      url: '/evidence/transaction_log.json',
      size: 15672,
      mimeType: 'application/json',
      uploadedAt: '2025-01-05T10:30:00Z',
      uploadedBy: 'System',
      description: 'Log detail transaksi dan metadata'
    },
    {
      id: '3',
      type: 'REPORT',
      name: 'risk_analysis_report.pdf',
      url: '/evidence/risk_analysis_report.pdf',
      size: 1234567,
      mimeType: 'application/pdf',
      uploadedAt: '2025-01-05T10:45:00Z',
      uploadedBy: 'ML Engine',
      description: 'Laporan analisis risiko komprehensif dari ML model'
    }
  ],
  createdAt: '2025-01-05T10:30:00Z',
  updatedAt: '2025-01-05T11:30:00Z'
};

// Transaction details mock data
const transactionDetail = {
  id: 'TXN-1234567890',
  amount: 50000000,
  currency: 'IDR',
  senderAccount: {
    id: 'ACC-9876543210',
    name: 'Ahmad Wijaya',
    accountNumber: '****3210',
    bankName: 'Bank Mandiri'
  },
  receiverAccount: {
    id: 'ACC-1234567890',
    name: 'CV. Global Trading',
    accountNumber: '****7890',
    bankName: 'Bank BCA'
  },
  transactionTime: '2025-01-05T02:30:00Z',
  status: 'BLOCKED',
  channel: 'MOBILE_APP',
  location: {
    country: 'Indonesia',
    region: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    latitude: -6.2297,
    longitude: 106.8261,
    ipAddress: '103.xxx.xxx.xxx'
  },
  device: {
    type: 'Mobile',
    os: 'Android 14',
    browser: 'Mobile App',
    fingerprint: 'abc123xyz789'
  },
  description: 'Transfer ke rekening bisnis untuk pembayaran invoice',
  reference: 'INV-2025-001'
};

// Account activity timeline
const accountActivity = [
  {
    id: '1',
    timestamp: '2025-01-05T02:30:00Z',
    action: 'Transaction Blocked',
    details: 'Transfer Rp 50,000,000 diblokir oleh sistem fraud detection',
    riskLevel: 'CRITICAL'
  },
  {
    id: '2',
    timestamp: '2025-01-05T02:29:00Z',
    action: 'Login Detected',
    details: 'Login dari device Android baru (IP: 103.xxx.xxx.xxx)',
    riskLevel: 'MEDIUM'
  },
  {
    id: '3',
    timestamp: '2025-01-05T02:25:00Z',
    action: 'OTP Requested',
    details: 'Request OTP untuk verifikasi transaksi besar',
    riskLevel: 'LOW'
  },
  {
    id: '4',
    timestamp: '2025-01-04T15:30:00Z',
    action: 'Normal Transaction',
    details: 'Transfer Rp 2,500,000 berhasil (pola normal)',
    riskLevel: 'LOW'
  },
  {
    id: '5',
    timestamp: '2025-01-04T10:15:00Z',
    action: 'Account Login',
    details: 'Login normal dari device biasa',
    riskLevel: 'LOW'
  }
];

interface AlertDetailPageProps {
  params: {
    id: string;
  };
}

export default function AlertDetailPage({ params }: AlertDetailPageProps) {
  const router = useRouter();
  const [alert, setAlert] = useState<FraudAlert>(mockAlertDetail);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState('');

  // Simulate loading alert detail
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL: return 'destructive';
      case AlertSeverity.HIGH: return 'destructive';
      case AlertSeverity.MEDIUM: return 'default';
      case AlertSeverity.LOW: return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.OPEN: return 'destructive';
      case AlertStatus.UNDER_REVIEW: return 'default';
      case AlertStatus.RESOLVED: return 'secondary';
      case AlertStatus.ESCALATED: return 'destructive';
      case AlertStatus.FALSE_POSITIVE: return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.OPEN: return <ExclamationTriangleIcon className="h-4 w-4" />;
      case AlertStatus.UNDER_REVIEW: return <EyeIcon className="h-4 w-4" />;
      case AlertStatus.RESOLVED: return <CheckCircleIcon className="h-4 w-4" />;
      case AlertStatus.ESCALATED: return <ArrowUpIcon className="h-4 w-4" />;
      case AlertStatus.FALSE_POSITIVE: return <XCircleIcon className="h-4 w-4" />;
      default: return <BellIcon className="h-4 w-4" />;
    }
  };

  const getAlertTypeIcon = (alertType: AlertType) => {
    switch (alertType) {
      case AlertType.AMOUNT_ANOMALY: return <BanknotesIcon className="h-5 w-5" />;
      case AlertType.NETWORK_RISK: return <ComputerDesktopIcon className="h-5 w-5" />;
      case AlertType.VELOCITY_CHECK: return <ClockIcon className="h-5 w-5" />;
      case AlertType.GEOLOCATION_RISK: return <MapPinIcon className="h-5 w-5" />;
      case AlertType.DEVICE_FINGERPRINT: return <ComputerDesktopIcon className="h-5 w-5" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 dark:text-red-400';
      case 'HIGH': return 'text-orange-600 dark:text-orange-400';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const alertTime = new Date(dateStr);
    const diffMs = now.getTime() - alertTime.getTime();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleAlertAction = (action: string) => {
    setSelectedAction(action);
    // Here you would normally call an API to update the alert
    console.log(`Performing action: ${action} with reason: ${actionReason}`);
    
    // Update local state for demo
    let newStatus = alert.status;
    switch (action) {
      case 'resolve':
        newStatus = AlertStatus.RESOLVED;
        break;
      case 'escalate':
        newStatus = AlertStatus.ESCALATED;
        break;
      case 'false_positive':
        newStatus = AlertStatus.FALSE_POSITIVE;
        break;
      case 'under_review':
        newStatus = AlertStatus.UNDER_REVIEW;
        break;
    }

    setAlert(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));

    setSelectedAction(null);
    setActionReason('');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: AlertNote = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      isInternal: false
    };

    setAlert(prev => ({
      ...prev,
      notes: [...(prev.notes || []), note],
      updatedAt: new Date().toISOString()
    }));

    setNewNote('');
    setIsAddingNote(false);
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
            Back to Alerts
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{alert.alertId}</h1>
            <p className="text-muted-foreground mt-1">
              Detected {formatRelativeTime(alert.detectedAt)} • Last updated {formatRelativeTime(alert.updatedAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getSeverityColor(alert.severity) as any} className="flex items-center gap-1">
            {getAlertTypeIcon(alert.alertType)}
            {alert.severity}
          </Badge>
          <Badge variant={getStatusColor(alert.status) as any} className="flex items-center gap-1">
            {getStatusIcon(alert.status)}
            {alert.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getAlertTypeIcon(alert.alertType)}
                    {alert.alertType.replace('_', ' ')}
                  </CardTitle>
                  <CardDescription>{alert.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <EllipsisVerticalIcon className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Alert Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {alert.status === AlertStatus.OPEN && (
                      <>
                        <DropdownMenuItem onClick={() => handleAlertAction('under_review')}>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Start Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction('resolve')}>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction('escalate')}>
                          <ArrowUpIcon className="h-4 w-4 mr-2" />
                          Escalate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAlertAction('false_positive')}>
                          <XCircleIcon className="h-4 w-4 mr-2" />
                          Mark False Positive
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Copy Alert Link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Export Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {(alert.riskScore * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={alert.riskScore * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Model confidence: {(alert.confidence * 100).toFixed(1)}% • Version: {alert.modelVersion}
                </p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <p className="font-mono text-sm">{alert.transactionId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Account ID</span>
                    <p className="font-mono text-sm">{alert.accountId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Alert Type</span>
                    <p className="text-sm">{alert.alertType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Detected At</span>
                    <p className="text-sm">{formatDateTime(alert.detectedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Assigned To</span>
                    <p className="text-sm flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {alert.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {alert.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="risk-factors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Risk Factors Tab */}
            <TabsContent value="risk-factors">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors Analysis</CardTitle>
                  <CardDescription>
                    Detailed breakdown of risk factors contributing to this alert
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alert.riskFactors.map((factor) => (
                      <div key={factor.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              factor.severity === AlertSeverity.CRITICAL ? 'bg-red-500' :
                              factor.severity === AlertSeverity.HIGH ? 'bg-orange-500' :
                              factor.severity === AlertSeverity.MEDIUM ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <h4 className="font-semibold">{factor.type}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(factor.severity) as any}>
                              {factor.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Weight: {(factor.weight * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{factor.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Value:</span>
                          <Badge variant="outline">{factor.value}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transaction Tab */}
            <TabsContent value="transaction">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>
                    Complete information about the flagged transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Transaction Amount */}
                    <div className="text-center p-6 border border-border rounded-lg bg-accent/5">
                      <div className="text-3xl font-bold text-foreground">
                        {formatCurrency(transactionDetail.amount)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Transaction Amount
                      </p>
                      <Badge variant="destructive" className="mt-2">
                        {transactionDetail.status}
                      </Badge>
                    </div>

                    {/* Sender & Receiver */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Sender
                        </h4>
                        <div className="space-y-2 pl-6">
                          <div>
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <p className="font-medium">{transactionDetail.senderAccount.name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Account:</span>
                            <p className="font-mono text-sm">{transactionDetail.senderAccount.accountNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Bank:</span>
                            <p className="text-sm">{transactionDetail.senderAccount.bankName}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <CreditCardIcon className="h-4 w-4" />
                          Receiver
                        </h4>
                        <div className="space-y-2 pl-6">
                          <div>
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <p className="font-medium">{transactionDetail.receiverAccount.name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Account:</span>
                            <p className="font-mono text-sm">{transactionDetail.receiverAccount.accountNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Bank:</span>
                            <p className="text-sm">{transactionDetail.receiverAccount.bankName}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Transaction Info</h4>
                        <div className="space-y-2">         
                                         <div>
                            <span className="text-sm text-muted-foreground">Time:</span>
                            <p className="text-sm">{formatDateTime(transactionDetail.transactionTime)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Channel:</span>
                            <p className="text-sm">{transactionDetail.channel}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Reference:</span>
                            <p className="font-mono text-sm">{transactionDetail.reference}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Description:</span>
                            <p className="text-sm">{transactionDetail.description}</p>
                          </div>
                        </div>
                      </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Location & Device</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <p className="text-sm">{transactionDetail.location.city}, {transactionDetail.location.region}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">IP Address:</span>
                        <p className="font-mono text-sm">{transactionDetail.location.ipAddress}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Device:</span>
                        <p className="text-sm">{transactionDetail.device.type} - {transactionDetail.device.os}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Browser:</span>
                        <p className="text-sm">{transactionDetail.device.browser}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Documentation</CardTitle>
              <CardDescription>
                Files, logs, and documentation related to this alert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alert.evidence?.map((evidence) => (
                  <div key={evidence.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        {evidence.type === 'SCREENSHOT' && <InformationCircleIcon className="h-5 w-5" />}
                        {evidence.type === 'LOG' && <DocumentTextIcon className="h-5 w-5" />}
                        {evidence.type === 'REPORT' && <DocumentTextIcon className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{evidence.name}</h4>
                        <p className="text-sm text-muted-foreground">{evidence.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Size: {formatFileSize(evidence.size)}</span>
                          <span>Uploaded by: {evidence.uploadedBy}</span>
                          <span>{formatRelativeTime(evidence.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{evidence.type}</Badge>
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Upload Additional Evidence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Account Activity Timeline</CardTitle>
              <CardDescription>
                Chronological activity leading to this alert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                        activity.riskLevel === 'HIGH' ? 'bg-orange-500' :
                        activity.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      {index < accountActivity.length - 1 && (
                        <div className="w-px h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.action}</h4>
                        <span className={`text-xs font-medium ${getRiskLevelColor(activity.riskLevel)}`}>
                          {activity.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
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
          {alert.status === AlertStatus.OPEN && (
            <>
              <Button 
                className="w-full" 
                onClick={() => handleAlertAction('under_review')}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Start Investigation
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAlertAction('escalate')}
              >
                <ArrowUpIcon className="h-4 w-4 mr-2" />
                Escalate Alert
              </Button>
            </>
          )}
          {alert.status === AlertStatus.UNDER_REVIEW && (
            <>
              <Button 
                className="w-full" 
                onClick={() => handleAlertAction('resolve')}
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAlertAction('false_positive')}
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                False Positive
              </Button>
            </>
          )}
          <Separator />
          <Button variant="outline" className="w-full">
            <UserIcon className="h-4 w-4 mr-2" />
            Reassign Alert
          </Button>
          <Button variant="outline" className="w-full">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              {(alert.riskScore * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Model Confidence</span>
            <span className="font-semibold">{(alert.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Risk Factors</span>
            <span className="font-semibold">{alert.riskFactors.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Evidence Files</span>
            <span className="font-semibold">{alert.evidence?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Time Since Detection</span>
            <span className="font-semibold">{formatRelativeTime(alert.detectedAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Investigation Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investigation Notes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddingNote(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingNote && (
            <div className="space-y-3 mb-4 p-3 border border-border rounded-lg">
              <Textarea
                placeholder="Add your investigation note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleAddNote}>
                  Save Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alert.notes?.map((note) => (
              <div key={note.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{note.author}</span>
                    {note.isInternal && (
                      <Badge variant="outline" className="text-xs">Internal</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{note.content}</p>
              </div>
            ))}
            
            {(!alert.notes || alert.notes.length === 0) && !isAddingNote && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No investigation notes yet. Add one to start documenting your analysis.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Related Alerts</CardTitle>
          <CardDescription>Similar alerts for this account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border border-border rounded">
              <div>
                <p className="text-sm font-medium">ALERT-2025-002</p>
                <p className="text-xs text-muted-foreground">Network Risk • 2 days ago</p>
              </div>
              <Badge variant="secondary">RESOLVED</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border border-border rounded">
              <div>
                <p className="text-sm font-medium">ALERT-2024-156</p>
                <p className="text-xs text-muted-foreground">Velocity Check • 1 week ago</p>
              </div>
              <Badge variant="outline">FALSE POSITIVE</Badge>
            </div>
            <Button variant="ghost" className="w-full text-sm">
              View All Related Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* Action Confirmation Dialog */}
  <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to {selectedAction?.replace('_', ' ')} this alert?
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Reason (optional)</label>
          <Textarea
            placeholder="Provide a reason for this action..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setSelectedAction(null)}>
          Cancel
        </Button>
        <Button onClick={() => handleAlertAction(selectedAction!)}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
);
}