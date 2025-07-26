"use client";
// Utility: Severity color
const getSeverityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return 'destructive';
    case AlertSeverity.HIGH:
      return 'warning';
    case AlertSeverity.MEDIUM:
      return 'secondary';
    case AlertSeverity.LOW:
      return 'outline';
    default:
      return 'outline';
  }
};

// Handler stubs
const handleViewAlert = (alertId: string) => {
  // TODO: Implement view logic
};

const handleAlertAction = (alertId: string, action: string) => {
  // TODO: Implement action logic
};

import { useState, useEffect } from 'react';
import { useRealtimeAlerts } from '@/lib/hooks/use-analytics';
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
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  BellIcon,
  DocumentTextIcon,
  MapPinIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
// ✅ Fix: Import dari file yang benar
import { AlertSeverity, AlertStatus } from '@/types/global';
import { AlertType, FraudAlert } from '@/types/fraud';
import { useRouter } from 'next/navigation'; // Tambah import ini

export default function AlertsPage() {
  const { alerts: realtimeAlerts, isLoading, mutate } = useRealtimeAlerts();
  const [filteredAlerts, setFilteredAlerts] = useState<FraudAlert[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * alertsPerPage, currentPage * alertsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'ALL'>('ALL');
  const router = useRouter();

  useEffect(() => {
    if (!realtimeAlerts) return;
    let filtered = realtimeAlerts;
    if (searchTerm) {
      filtered = filtered.filter((alert: FraudAlert) =>
        alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.accountId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSeverity !== 'ALL') {
      filtered = filtered.filter((alert: FraudAlert) => alert.severity === selectedSeverity);
    }
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter((alert: FraudAlert) => alert.status === selectedStatus);
    }
    setFilteredAlerts(filtered);
  }, [realtimeAlerts, searchTerm, selectedSeverity, selectedStatus]);

  // Utility functions
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
      case AlertType.AMOUNT_ANOMALY: return <ShieldCheckIcon className="h-5 w-5" />;
      case AlertType.NETWORK_RISK: return <ComputerDesktopIcon className="h-5 w-5" />;
      case AlertType.VELOCITY_CHECK: return <ClockIcon className="h-5 w-5" />;
      case AlertType.GEOLOCATION_RISK: return <MapPinIcon className="h-5 w-5" />;
      case AlertType.DEVICE_FINGERPRINT: return <ComputerDesktopIcon className="h-5 w-5" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
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

  // Summary stats from real-time alerts
  const alertStats = {
    total: realtimeAlerts ? realtimeAlerts.length : 0,
    critical: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.severity === AlertSeverity.CRITICAL).length : 0,
    high: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.severity === AlertSeverity.HIGH).length : 0,
    medium: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.severity === AlertSeverity.MEDIUM).length : 0,
    low: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.severity === AlertSeverity.LOW).length : 0,
    open: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.status === AlertStatus.OPEN).length : 0,
    underReview: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.status === AlertStatus.UNDER_REVIEW).length : 0,
    resolved: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.status === AlertStatus.RESOLVED).length : 0,
    escalated: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.status === AlertStatus.ESCALATED).length : 0,
    falsePositive: realtimeAlerts ? realtimeAlerts.filter((a: FraudAlert) => a.status === AlertStatus.FALSE_POSITIVE).length : 0,
  };

  // ...existing JSX code...
  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fraud Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage fraud detection alerts in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
            Live Monitoring
          </Badge>
          <span className="text-sm text-muted-foreground">
            {filteredAlerts.length} of {realtimeAlerts ? realtimeAlerts.length : 0} alerts
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.total}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{alertStats.critical}</div>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <ShieldCheckIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{alertStats.high}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <ClockIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{alertStats.open}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{alertStats.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positive</CardTitle>
            <XCircleIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{alertStats.falsePositive}</div>
            <p className="text-xs text-muted-foreground">Model learning</p>
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts, transactions, accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px]">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  {selectedSeverity === 'ALL' ? 'All Severities' : selectedSeverity}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedSeverity('ALL')}>
                  All Severities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSeverity(AlertSeverity.CRITICAL)}>
                  Critical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSeverity(AlertSeverity.HIGH)}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSeverity(AlertSeverity.MEDIUM)}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSeverity(AlertSeverity.LOW)}>
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px]">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {selectedStatus === 'ALL' ? 'All Status' : selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus('ALL')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(AlertStatus.OPEN)}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(AlertStatus.UNDER_REVIEW)}>
                  Under Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(AlertStatus.RESOLVED)}>
                  Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(AlertStatus.ESCALATED)}>
                  Escalated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(AlertStatus.FALSE_POSITIVE)}>
                  False Positive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
          <CardDescription>
            Fraud alerts detected by AI models and rule-based systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedAlerts.map((alert: FraudAlert) => (
              // ...existing code for rendering each alert...
              <div
                key={alert.id}
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                {/* ...existing code for each alert... */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Alert Type Icon */}
                    <div className={`p-2 rounded-lg ${ 
                      alert.severity === AlertSeverity.CRITICAL ? 'bg-red-100 dark:bg-red-900/20' :
                      alert.severity === AlertSeverity.HIGH ? 'bg-orange-100 dark:bg-orange-900/20' :
                      alert.severity === AlertSeverity.MEDIUM ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      {getAlertTypeIcon(alert.alertType)}
                    </div>

                    {/* Alert Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {/* ✅ Make Alert ID clickable */}
                        <button
                          onClick={() => handleViewAlert(alert.id)}
                          className="font-semibold text-foreground hover:text-primary underline-offset-4 hover:underline"
                        >
                          {alert.alertId}
                        </button>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={getStatusColor(alert.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(alert.status)}
                          {alert.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Transaction:</span>
                          <p className="font-mono">{alert.transactionId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Account:</span>
                          <p className="font-mono">{alert.accountId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Detected:</span>
                          <p>{formatRelativeTime(alert.detectedAt)}</p>
                        </div>
                      </div>

                      {/* Risk Score */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-muted-foreground">Risk Score:</span>
                          <span className="text-sm font-semibold">{(alert.riskScore * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={alert.riskScore * 100} className="h-2" />
                      </div>

                      {/* Risk Factors */}
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {(alert.riskFactors ? alert.riskFactors : []).slice(0, 3).map((factor) => (
                            <Badge key={factor.id} variant="outline" className="text-xs">
                              {factor.type}: {factor.value}
                            </Badge>
                          ))}
                          {(alert.riskFactors ? alert.riskFactors : []).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(alert.riskFactors ? alert.riskFactors : []).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Assigned User */}
                      {alert.assignedTo && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <UserIcon className="h-4 w-4" />
                          Assigned to: {alert.assignedTo.username || alert.assignedTo.email || "User"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                        <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewAlert(alert.id)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
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
                        {alert.status === AlertStatus.OPEN && (
                          <>
                            <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'resolve')}><CheckCircleIcon className="h-4 w-4 mr-2" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'escalate')}>
                              <ArrowUpIcon className="h-4 w-4 mr-2" />
                              Escalate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAlertAction(alert.id, 'false_positive')}>
                              <XCircleIcon className="h-4 w-4 mr-2" />
                              Mark False Positive
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Add Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserIcon className="h-4 w-4 mr-2" />
                          Assign User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedSeverity !== 'ALL' || selectedStatus !== 'ALL'
                ? 'Try adjusting your filters or search terms.'
                : 'All systems are operating normally.'}
            </p>
          </div>
        )}
        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>

  {/* Quick Stats Footer */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detection Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
            <span className="text-sm font-semibold">94.7%</span>
          </div>
          <Progress value={94.7} className="h-2" />
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">False Positive Rate</span>
            <span className="text-sm font-semibold">2.1%</span>
          </div>
          <Progress value={2.1} className="h-2" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Today vs Yesterday</span>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <ArrowUpIcon className="h-3 w-3 rotate-180" />
              <span className="text-sm font-semibold">-12%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Week</span>
            <span className="text-sm font-semibold">147 alerts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="text-sm font-semibold">2.3 minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Alert Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount Anomaly</span>
            <span className="text-sm font-semibold">35%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Network Risk</span>
            <span className="text-sm font-semibold">28%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Velocity Check</span>
            <span className="text-sm font-semibold">22%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Geo Risk</span>
            <span className="text-sm font-semibold">15%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
);
}
