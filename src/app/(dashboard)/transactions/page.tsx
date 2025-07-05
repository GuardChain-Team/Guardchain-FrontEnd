// src/app/(dashboard)/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { 
  TransactionStatus, 
  PaymentMethod, 
  Channel
} from '@/types/global';
import { 
  TransactionType,  // ← Import dari transaction.ts
  Transaction, 
  Account, 
  AccountType,
  TransactionSummary 
} from '@/types/transaction';

// Mock data untuk transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-1234567890',
    senderAccountId: 'ACC-9876543210',
    receiverAccountId: 'ACC-1234567890',
    amount: 50000000,
    currency: 'IDR',
    transactionType: TransactionType.TRANSFER,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    channel: Channel.MOBILE_APP,
    status: TransactionStatus.BLOCKED,
    transactionTime: '2025-01-05T02:30:00Z',
    description: 'Transfer ke rekening bisnis untuk pembayaran invoice',
    reference: 'INV-2025-001',
    location: {
      country: 'Indonesia',
      region: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      latitude: -6.2297,
      longitude: 106.8261,
      ipAddress: '103.xxx.xxx.xxx'
    },
    deviceInfo: {
      deviceId: 'dev-123456',
      deviceType: 'MOBILE',
      os: 'Android 14',
      browser: 'Mobile App',
      userAgent: 'GuardChain-Mobile/1.0',
      fingerprint: 'abc123xyz789',
      isTrusted: false,
      lastSeenAt: '2025-01-05T02:30:00Z'
    },
    riskScore: 0.95,
    riskAssessment: {
      overallRisk: 0.95,
      factors: {
        velocityRisk: 0.8,
        patternRisk: 0.9,
        locationRisk: 0.6,
        deviceRisk: 0.7,
        networkRisk: 0.5
      },
      recommendations: [
        'Immediate review required due to high risk score',
        'Verify customer identity through additional authentication',
        'Check for potential fraud patterns'
      ],
      computedAt: '2025-01-05T02:30:00Z'
    },
    createdAt: '2025-01-05T02:30:00Z',
    updatedAt: '2025-01-05T02:31:00Z'
  },
  {
    id: '2',
    transactionId: 'TXN-2345678901',
    senderAccountId: 'ACC-8765432109',
    receiverAccountId: 'ACC-2345678901',
    amount: 2500000,
    currency: 'IDR',
    transactionType: TransactionType.TRANSFER,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    channel: Channel.WEB,
    status: TransactionStatus.COMPLETED,
    transactionTime: '2025-01-05T15:45:00Z',
    description: 'Transfer gaji bulanan',
    reference: 'SAL-2025-001',
    location: {
      country: 'Indonesia',
      region: 'Jawa Barat',
      city: 'Bandung',
      ipAddress: '114.xxx.xxx.xxx'
    },
    deviceInfo: {
      deviceId: 'dev-234567',
      deviceType: 'DESKTOP',
      os: 'Windows 11',
      browser: 'Chrome 120',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      fingerprint: 'def456uvw123',
      isTrusted: true,
      lastSeenAt: '2025-01-05T15:45:00Z'
    },
    riskScore: 0.15,
    riskAssessment: {
      overallRisk: 0.15,
      factors: {
        velocityRisk: 0.1,
        patternRisk: 0.1,
        locationRisk: 0.2,
        deviceRisk: 0.1,
        networkRisk: 0.1
      },
      recommendations: [
        'Normal transaction pattern',
        'No additional verification required'
      ],
      computedAt: '2025-01-05T15:45:00Z'
    },
    createdAt: '2025-01-05T15:45:00Z',
    updatedAt: '2025-01-05T15:46:00Z'
  },
  {
    id: '3',
    transactionId: 'TXN-3456789012',
    senderAccountId: 'ACC-7654321098',
    receiverAccountId: 'ACC-3456789012',
    amount: 150000,
    currency: 'IDR',
    transactionType: TransactionType.PAYMENT,
    paymentMethod: PaymentMethod.E_WALLET,
    channel: Channel.MOBILE_APP,
    status: TransactionStatus.PENDING,
    transactionTime: '2025-01-05T18:20:00Z',
    description: 'Pembayaran e-commerce',
    reference: 'PAY-2025-003',
    location: {
      country: 'Indonesia',
      region: 'Jawa Timur',
      city: 'Surabaya',
      ipAddress: '180.xxx.xxx.xxx'
    },
    deviceInfo: {
      deviceId: 'dev-345678',
      deviceType: 'MOBILE',
      os: 'iOS 17',
      browser: 'Mobile App',
      userAgent: 'GuardChain-Mobile/1.0',
      fingerprint: 'ghi789rst456',
      isTrusted: true,
      lastSeenAt: '2025-01-05T18:20:00Z'
    },
    riskScore: 0.25,
    createdAt: '2025-01-05T18:20:00Z',
    updatedAt: '2025-01-05T18:20:00Z'
  },
  {
    id: '4',
    transactionId: 'TXN-4567890123',
    senderAccountId: 'ACC-6543210987',
    receiverAccountId: 'ACC-4567890123',
    amount: 750000,
    currency: 'IDR',
    transactionType: TransactionType.WITHDRAWAL,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    channel: Channel.ATM,
    status: TransactionStatus.FAILED,
    transactionTime: '2025-01-05T12:15:00Z',
    description: 'Penarikan tunai ATM',
    reference: 'ATM-2025-004',
    location: {
      country: 'Indonesia',
      region: 'Bali',
      city: 'Denpasar',
      ipAddress: '103.xxx.xxx.xxx'
    },
    riskScore: 0.65,
    createdAt: '2025-01-05T12:15:00Z',
    updatedAt: '2025-01-05T12:16:00Z'
  },
  {
    id: '5',
    transactionId: 'TXN-5678901234',
    senderAccountId: 'ACC-5432109876',
    receiverAccountId: 'ACC-5678901234',
    amount: 5000000,
    currency: 'IDR',
    transactionType: TransactionType.TRANSFER,
    paymentMethod: PaymentMethod.QRIS,
    channel: Channel.MOBILE_APP,
    status: TransactionStatus.COMPLETED,
    transactionTime: '2025-01-05T09:30:00Z',
    description: 'Transfer via QRIS',
    reference: 'QR-2025-005',
    location: {
      country: 'Indonesia',
      region: 'DKI Jakarta',
      city: 'Jakarta Pusat',
      ipAddress: '125.xxx.xxx.xxx'
    },
    deviceInfo: {
      deviceId: 'dev-456789',
      deviceType: 'MOBILE',
      os: 'Android 13',
      browser: 'Mobile App',
      userAgent: 'GuardChain-Mobile/1.0',
      fingerprint: 'jkl012mno789',
      isTrusted: true,
      lastSeenAt: '2025-01-05T09:30:00Z'
    },
    riskScore: 0.35,
    createdAt: '2025-01-05T09:30:00Z',
    updatedAt: '2025-01-05T09:31:00Z'
  }
];

// Mock account data
const mockAccounts: Record<string, Account> = {
  'ACC-9876543210': {
    accountId: 'ACC-9876543210',
    accountNumber: '****3210',
    accountType: AccountType.SAVINGS,
    holderName: 'Ahmad Wijaya',
    bankCode: '008',
    bankName: 'Bank Mandiri',
    currency: 'IDR',
    balance: 150000000,
    status: 'ACTIVE' as any,
    openedAt: '2020-01-15T00:00:00Z',
    isVerified: true,
    riskProfile: {
      level: 'MEDIUM',
      score: 0.6,
      factors: ['new-device', 'high-value-transaction'],
      lastUpdated: '2025-01-05T00:00:00Z',
      history: []
    },
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  'ACC-1234567890': {
    accountId: 'ACC-1234567890',
    accountNumber: '****7890',
    accountType: AccountType.BUSINESS,
    holderName: 'CV. Global Trading',
    bankCode: '014',
    bankName: 'Bank BCA',
    currency: 'IDR',
    status: 'ACTIVE' as any,
    openedAt: '2018-05-20T00:00:00Z',
    isVerified: true,
    riskProfile: {
      level: 'LOW',
      score: 0.2,
      factors: ['verified-business'],
      lastUpdated: '2025-01-05T00:00:00Z',
      history: []
    },
    createdAt: '2018-05-20T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z'
  }
};

// Summary statistics
const mockSummary: TransactionSummary = {
  totalCount: 1247,
  totalAmount: 125780000000,
  averageAmount: 100857000,
  currency: 'IDR',
  period: 'Today',
  byStatus: {
    [TransactionStatus.COMPLETED]: 1156,
    [TransactionStatus.PENDING]: 45,
    [TransactionStatus.FAILED]: 32,
    [TransactionStatus.CANCELLED]: 12,
    [TransactionStatus.BLOCKED]: 2
  },
  byType: {
    [TransactionType.TRANSFER]: 892,
    [TransactionType.PAYMENT]: 234,
    [TransactionType.WITHDRAWAL]: 89,
    [TransactionType.DEPOSIT]: 32,
    [TransactionType.REFUND]: 0,
    [TransactionType.REVERSAL]: 0
  },
  byChannel: {
    [Channel.MOBILE_APP]: 723,
    [Channel.WEB]: 312,
    [Channel.ATM]: 156,
    [Channel.BRANCH]: 45,
    [Channel.CALL_CENTER]: 11,
    [Channel.API]: 0
  },
  trends: {
    volumeChange: 12.5,
    amountChange: 8.3,
    riskScoreChange: -2.1
  }
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<TransactionType | 'ALL'>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<Channel | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'amount' | 'time' | 'risk'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(txn =>
        txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.senderAccountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.receiverAccountId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(txn => txn.status === selectedStatus);
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(txn => txn.transactionType === selectedType);
    }

    // Channel filter
    if (selectedChannel !== 'ALL') {
      filtered = filtered.filter(txn => txn.channel === selectedChannel);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'risk':
          aValue = a.riskScore || 0;
          bValue = b.riskScore || 0;
          break;
        case 'time':
        default:
          aValue = new Date(a.transactionTime);
          bValue = new Date(b.transactionTime);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedStatus, selectedType, selectedChannel, sortBy, sortOrder]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update some transaction timestamps
      setTransactions(prevTxns => 
        prevTxns.map(txn => {
          if (Math.random() < 0.05) { // 5% chance to update
            return {
              ...txn,
              updatedAt: new Date().toISOString()
            };
          }
          return txn;
        })
      );
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED: return 'default';
      case TransactionStatus.PENDING: return 'secondary';
      case TransactionStatus.FAILED: return 'destructive';
      case TransactionStatus.CANCELLED: return 'outline';
      case TransactionStatus.BLOCKED: return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED: return <CheckCircleIcon className="h-4 w-4" />;
      case TransactionStatus.PENDING: return <ClockIcon className="h-4 w-4" />;
      case TransactionStatus.FAILED: return <XCircleIcon className="h-4 w-4" />;
      case TransactionStatus.CANCELLED: return <XCircleIcon className="h-4 w-4" />;
      case TransactionStatus.BLOCKED: return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TRANSFER: return <ArrowRightIcon className="h-4 w-4" />;
      case TransactionType.PAYMENT: return <CreditCardIcon className="h-4 w-4" />;
      case TransactionType.WITHDRAWAL: return <ArrowUpIcon className="h-4 w-4" />;
      case TransactionType.DEPOSIT: return <ArrowDownIcon className="h-4 w-4" />;
      default: return <BanknotesIcon className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case Channel.MOBILE_APP: return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case Channel.WEB: return <ComputerDesktopIcon className="h-4 w-4" />;
      case Channel.ATM: return <CreditCardIcon className="h-4 w-4" />;
      default: return <BanknotesIcon className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 dark:text-red-400';
    if (score >= 0.6) return 'text-orange-600 dark:text-orange-400';
    if (score >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleViewTransaction = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  const handleViewAccount = (accountId: string) => {
    router.push(`/accounts/${accountId}`);
  };

  const getAccountInfo = (accountId: string) => {
    return mockAccounts[accountId] || {
      accountNumber: '****????',
      holderName: 'Unknown Account',
      bankName: 'Unknown Bank'
    };
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Real-time transaction monitoring and fraud detection analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
            Live Monitoring
          </Badge>
          <span className="text-sm text-muted-foreground">
            {filteredTransactions.length} of {transactions.length} transactions
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.totalCount.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+{mockSummary.trends.volumeChange}%</span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockSummary.totalAmount)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+{mockSummary.trends.amountChange}%</span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockSummary.averageAmount)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Medium</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownIcon className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">{mockSummary.trends.riskScoreChange}%</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions, accounts, references..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    {selectedStatus === 'ALL' ? 'All Status' : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedStatus('ALL')}>
                    All Status
                  </DropdownMenuItem>
                  {Object.values(TransactionStatus).map((status) => (
                    <DropdownMenuItem 
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    {selectedType === 'ALL' ? 'All Types' : selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedType('ALL')}>
                    All Types
                  </DropdownMenuItem>
                  {Object.values(TransactionType).map((type) => (
                    <DropdownMenuItem 
                      key={type}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Channel Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    {selectedChannel === 'ALL' ? 'All Channels' : selectedChannel}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Channel</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedChannel('ALL')}>
                    All Channels
                  </DropdownMenuItem>
                  {Object.values(Channel).map((channel) => (
                    <DropdownMenuItem 
                      key={channel}
                      onClick={() => setSelectedChannel(channel)}
                    >
                      {channel}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    Sort: {sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy('time')}>
                    Time
                  </DropdownMenuItem>
<DropdownMenuItem onClick={() => setSortBy('amount')}>
Amount
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setSortBy('risk')}>
Risk Score
</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
{sortOrder === 'asc' ? 'Descending' : 'Ascending'}
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</div>
</div>
</CardContent>
</Card>
  {/* Main Content */}
  <Tabs defaultValue="list" className="w-full">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="list">Transaction List</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
    </TabsList>

    {/* Transaction List Tab */}
    <TabsContent value="list">
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>
            Real-time transaction monitoring with fraud detection scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type & Channel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Accounts</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const senderAccount = getAccountInfo(transaction.senderAccountId);
                  const receiverAccount = getAccountInfo(transaction.receiverAccountId);
                  
                  return (
                    <TableRow key={transaction.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div>
                          <button
                            onClick={() => handleViewTransaction(transaction.id)}
                            className="font-medium text-foreground hover:text-primary underline-offset-4 hover:underline"
                          >
                            {transaction.transactionId}
                          </button>
                          <p className="text-sm text-muted-foreground mt-1">
                            {transaction.description}
                          </p>
                          {transaction.reference && (
                            <p className="text-xs text-muted-foreground">
                              Ref: {transaction.reference}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(transaction.transactionType)}
                            <span className="text-sm">{transaction.transactionType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {getChannelIcon(transaction.channel)}
                          <span className="text-xs text-muted-foreground">{transaction.channel}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <p className="text-xs text-muted-foreground">{transaction.currency}</p>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">From:</span>
                            <button
                              onClick={() => handleViewAccount(transaction.senderAccountId)}
                              className="ml-1 hover:text-primary hover:underline"
                            >
                              {senderAccount.holderName}
                            </button>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">To:</span>
                            <button
                              onClick={() => handleViewAccount(transaction.receiverAccountId)}
                              className="ml-1 hover:text-primary hover:underline"
                            >
                              {receiverAccount.holderName}
                            </button>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {transaction.riskScore !== undefined ? (
                          <div>
                            <div className={`font-semibold ${getRiskScoreColor(transaction.riskScore)}`}>
                              {(transaction.riskScore * 100).toFixed(1)}%
                            </div>
                            <Progress 
                              value={transaction.riskScore * 100} 
                              className="h-2 mt-1" 
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant={getStatusColor(transaction.status) as any} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="text-sm">{formatDateTime(transaction.transactionTime)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatRelativeTime(transaction.transactionTime)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTransaction(transaction.id)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewTransaction(transaction.id)}>
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewAccount(transaction.senderAccountId)}>
                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                View Sender Account
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewAccount(transaction.receiverAccountId)}>
                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                View Receiver Account
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <DocumentTextIcon className="h-4 w-4 mr-2" />
                                Generate Report
                              </DropdownMenuItem>
                              {transaction.status === TransactionStatus.PENDING && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                                    Block Transaction
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <BanknotesIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedStatus !== 'ALL' || selectedType !== 'ALL' || selectedChannel !== 'ALL'
                    ? 'Try adjusting your filters or search terms.'
                    : 'No transactions available for the selected period.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Analytics Tab */}
    <TabsContent value="analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Distribution</CardTitle>
            <CardDescription>Breakdown by transaction status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockSummary.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status as TransactionStatus)}
                    <span className="text-sm font-medium">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{count.toLocaleString()}</span>
                    <div className="w-20">
                      <Progress value={(count / mockSummary.totalCount) * 100} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-12">
                      {((count / mockSummary.totalCount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Volume by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Type Distribution</CardTitle>
            <CardDescription>Breakdown by transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockSummary.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type as TransactionType)}
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{count.toLocaleString()}</span>
                    <div className="w-20">
                      <Progress value={(count / mockSummary.totalCount) * 100} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-12">
                      {((count / mockSummary.totalCount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Volume by Channel */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Breakdown by transaction channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockSummary.byChannel).map(([channel, count]) => (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel as Channel)}
                    <span className="text-sm font-medium">{channel.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{count.toLocaleString()}</span>
                    <div className="w-20">
                      <Progress value={(count / mockSummary.totalCount) * 100} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-12">
                      {((count / mockSummary.totalCount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Analysis</CardTitle>
            <CardDescription>Distribution of transaction risk scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Low Risk (0-40%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">847</span>
                  <div className="w-20">
                    <Progress value={68} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12">68%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medium Risk (40-70%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">312</span>
                  <div className="w-20">
                    <Progress value={25} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12">25%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">High Risk (70-90%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">75</span>
                  <div className="w-20">
                    <Progress value={6} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12">6%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Critical Risk (90%+)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">13</span>
                  <div className="w-20">
                    <Progress value={1} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12">1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    {/* Pattern Analysis Tab */}
    <TabsContent value="patterns">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspicious Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Suspicious Pattern Detection</CardTitle>
            <CardDescription>AI-detected unusual transaction patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">High-Value Off-Hours Transactions</h4>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Detected 5 transactions above IDR 10M between 2-6 AM in the last 24 hours
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>Pattern detected 2 hours ago</span>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Rapid Consecutive Transfers</h4>
                  <Badge variant="default">High</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Account ACC-7654321098 performed 15 transfers within 1 hour
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>Pattern detected 4 hours ago</span>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Geographic Anomaly</h4>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Transactions from Jakarta and Bali within 30 minutes (impossible travel)
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Pattern detected 6 hours ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Trends</CardTitle>
            <CardDescription>24-hour trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Transaction Volume</span>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span className="text-sm font-semibold">+12.5%</span>
                  </div>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  1,247 transactions (vs 1,108 yesterday)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Transaction Value</span>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span className="text-sm font-semibold">+8.3%</span>
                  </div>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  IDR 125.78B (vs IDR 116.12B yesterday)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Average Risk Score</span>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowDownIcon className="h-3 w-3" />
                    <span className="text-sm font-semibold">-2.1%</span>
                  </div>
                </div>
                <Progress value={35} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  0.34 average risk score (vs 0.35 yesterday)
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Blocked Transactions</span>
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <ArrowUpIcon className="h-3 w-3" />
                    <span className="text-sm font-semibold">+50%</span>
                  </div>
                </div>
                <Progress value={15} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  2 blocked transactions (vs 1 yesterday)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</div>
);
}