// src/app/(dashboard)/investigator/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ClockIcon,
  UserIcon,
  CpuChipIcon,
  PlayIcon,
  StopIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  LinkIcon,
  PhotoIcon,
  CalendarIcon,
  MapPinIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/helpers';
import { 
  Investigation, 
  InvestigationStatus, 
  Priority, 
  CaseType,
  Evidence,
  InvestigationEvent,
  BotTask,
  BotTaskType
} from '@/types/investigation';

// Mock data untuk demonstrasi
const mockInvestigations: Investigation[] = [
  {
    id: 'inv-001',
    caseNumber: 'INV-2024-001',
    caseTitle: 'Suspicious High-Value Transfer Pattern',
    caseType: CaseType.FRAUD_INVESTIGATION,
    priority: Priority.HIGH,
    status: InvestigationStatus.IN_PROGRESS,
    primaryAccountId: 'ACC-1234567890',
    assignedInvestigator: 'John Anderson',
    assignedTeam: 'Fraud Investigation Team',
    caseOpened: '2024-07-01T08:30:00Z',
    estimatedLoss: 25000000,
    alerts: [],
    transactions: [],
    timeline: [],
    evidence: [],
    reports: [],
    tags: ['high-value', 'pattern-analysis', 'urgent'],
    createdAt: '2024-07-01T08:30:00Z',
    updatedAt: '2024-07-05T14:20:00Z'
  },
  {
    id: 'inv-002',
    caseNumber: 'INV-2024-002',
    caseTitle: 'Multiple Account Takeover Attempts',
    caseType: CaseType.FRAUD_INVESTIGATION,
    priority: Priority.CRITICAL,
    status: InvestigationStatus.OPEN,
    primaryAccountId: 'ACC-9876543210',
    assignedInvestigator: 'Sarah Wilson',
    assignedTeam: 'Cyber Fraud Team',
    caseOpened: '2024-07-03T15:45:00Z',
    estimatedLoss: 15000000,
    alerts: [],
    transactions: [],
    timeline: [],
    evidence: [],
    reports: [],
    tags: ['account-takeover', 'cyber-fraud', 'multi-account'],
    createdAt: '2024-07-03T15:45:00Z',
    updatedAt: '2024-07-05T16:30:00Z'
  },
  {
    id: 'inv-003',
    caseNumber: 'INV-2024-003',
    caseTitle: 'Unusual Geographic Transaction Pattern',
    caseType: CaseType.AML_INVESTIGATION,
    priority: Priority.MEDIUM,
    status: InvestigationStatus.PENDING_REVIEW,
    primaryAccountId: 'ACC-5555666677',
    assignedInvestigator: 'Michael Chen',
    assignedTeam: 'AML Compliance Team',
    caseOpened: '2024-06-28T10:15:00Z',
    estimatedLoss: 8000000,
    alerts: [],
    transactions: [],
    timeline: [],
    evidence: [],
    reports: [],
    tags: ['geographic', 'aml', 'cross-border'],
    createdAt: '2024-06-28T10:15:00Z',
    updatedAt: '2024-07-04T11:45:00Z'
  }
];

const mockEvidence: Evidence[] = [
  {
    id: 'ev-001',
    name: 'Transaction Log Export',
    type: 'TRANSACTION_LOG' as any,
    source: 'Core Banking System',
    collectedAt: '2024-07-01T09:00:00Z',
    collectedBy: 'John Anderson',
    description: 'Complete transaction history for suspicious account',
    fileUrl: '/evidence/transaction-log-001.csv',
    fileSize: 245760,
    hash: 'sha256:abc123def456...',
    chainOfCustody: [],
    isAdmissible: true,
    tags: ['transactions', 'banking-data']
  },
  {
    id: 'ev-002',
    name: 'Device Fingerprint Analysis',
    type: 'DEVICE_DATA' as any,
    source: 'Fraud Detection System',
    collectedAt: '2024-07-01T10:30:00Z',
    collectedBy: 'Sarah Wilson',
    description: 'Device fingerprinting data showing multiple device signatures',
    fileUrl: '/evidence/device-analysis-002.json',
    fileSize: 156890,
    isAdmissible: true,
    chainOfCustody: [],
    tags: ['device-analysis', 'fingerprinting']
  }
];

const mockBotTasks: BotTask[] = [
  {
    id: 'task-001',
    type: BotTaskType.PATTERN_ANALYSIS,
    investigationId: 'inv-001',
    status: 'COMPLETED',
    startedAt: '2024-07-02T14:00:00Z',
    completedAt: '2024-07-02T14:15:00Z',
    result: {
      patterns: 5,
      confidence: 0.89,
      recommendations: ['Investigate related accounts', 'Review transaction timing']
    }
  },
  {
    id: 'task-002',
    type: BotTaskType.NETWORK_MAPPING,
    investigationId: 'inv-001',
    status: 'RUNNING',
    startedAt: '2024-07-05T16:30:00Z'
  }
];

const mockTimeline: InvestigationEvent[] = [
  {
    id: 'event-001',
    timestamp: '2024-07-01T08:30:00Z',
    type: 'CASE_CREATED' as any,
    description: 'Investigation case created from high-severity fraud alert',
    actor: 'System',
    isAutomated: true
  },
  {
    id: 'event-002',
    timestamp: '2024-07-01T09:15:00Z',
    type: 'CASE_ASSIGNED' as any,
    description: 'Case assigned to John Anderson from Fraud Investigation Team',
    actor: 'Maria Rodriguez (Team Lead)',
    isAutomated: false
  },
  {
    id: 'event-003',
    timestamp: '2024-07-01T10:00:00Z',
    type: 'EVIDENCE_ADDED' as any,
    description: 'Transaction log evidence collected and verified',
    actor: 'John Anderson',
    isAutomated: false
  }
];

// Utility functions
const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.CRITICAL:
      return 'bg-red-500';
    case Priority.HIGH:
      return 'bg-orange-500';
    case Priority.MEDIUM:
      return 'bg-yellow-500';
    case Priority.LOW:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: InvestigationStatus) => {
  switch (status) {
    case InvestigationStatus.OPEN:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case InvestigationStatus.IN_PROGRESS:
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case InvestigationStatus.PENDING_REVIEW:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case InvestigationStatus.RESOLVED:
      return 'text-green-600 bg-green-50 border-green-200';
    case InvestigationStatus.CLOSED:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case InvestigationStatus.ESCALATED:
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getCaseTypeIcon = (caseType: CaseType) => {
  switch (caseType) {
    case CaseType.FRAUD_INVESTIGATION:
      return ExclamationTriangleIcon;
    case CaseType.AML_INVESTIGATION:
      return ShieldExclamationIcon;
    case CaseType.COMPLIANCE_REVIEW:
      return DocumentTextIcon;
    default:
      return MagnifyingGlassIcon;
  }
};

// Components
const InvestigationCard = ({ investigation }: { investigation: Investigation }) => {
  const IconComponent = getCaseTypeIcon(investigation.caseType);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{investigation.caseTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{investigation.caseNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(investigation.priority))}></div>
            <Badge variant="outline" className={getStatusColor(investigation.status)}>
              {investigation.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Assigned to:</span>
            <span className="font-medium">{investigation.assignedInvestigator}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Est. Loss:</span>
            <span className="font-semibold text-red-600">
              {new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR' 
              }).format(investigation.estimatedLoss || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Case Opened:</span>
            <span>{new Date(investigation.caseOpened).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {investigation.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {investigation.tags && investigation.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{investigation.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BotPanel = () => {
  const [selectedTask, setSelectedTask] = useState<BotTaskType>(BotTaskType.PATTERN_ANALYSIS);
  const [isRunning, setIsRunning] = useState(false);

  const taskDescriptions = {
    [BotTaskType.PATTERN_ANALYSIS]: 'Analyze transaction patterns and detect anomalies using ML algorithms',
    [BotTaskType.NETWORK_MAPPING]: 'Map relationships between accounts, devices, and transactions',
    [BotTaskType.TIMELINE_RECONSTRUCTION]: 'Reconstruct chronological sequence of events',
    [BotTaskType.RISK_ASSESSMENT]: 'Calculate risk scores and probability of fraud',
    [BotTaskType.EVIDENCE_COLLECTION]: 'Automatically collect and organize relevant evidence',
    [BotTaskType.REPORT_GENERATION]: 'Generate preliminary investigation reports'
  };

  const runBotTask = () => {
    setIsRunning(true);
    // Simulate bot execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CpuChipIcon className="h-5 w-5" />
          AI Investigation Assistant
        </CardTitle>
        <CardDescription>
          Automated investigation tools to accelerate case analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Task</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedTask.replace('_', ' ')}
                <FunnelIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {Object.values(BotTaskType).map((task) => (
                <DropdownMenuItem 
                  key={task} 
                  onClick={() => setSelectedTask(task)}
                >
                  {task.replace('_', ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {taskDescriptions[selectedTask]}
          </p>
        </div>

        <Button 
          onClick={runBotTask} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4 mr-2" />
              Run Analysis
            </>
          )}
        </Button>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>67%</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Tasks</h4>
          {mockBotTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  task.status === 'COMPLETED' ? 'bg-green-500' :
                  task.status === 'RUNNING' ? 'bg-blue-500 animate-pulse' :
                  task.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500'
                )}></div>
                <span className="text-sm">{task.type.replace('_', ' ')}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EvidenceManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" />
            Evidence Manager
          </span>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Evidence
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockEvidence.map((evidence) => (
            <div key={evidence.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded">
                  {evidence.type === 'TRANSACTION_LOG' && <DocumentTextIcon className="h-4 w-4" />}
                  {evidence.type === 'DEVICE_DATA' && <CpuChipIcon className="h-4 w-4" />}
                  {evidence.type === 'SCREENSHOT' && <PhotoIcon className="h-4 w-4" />}
                  {evidence.type === 'DOCUMENT' && <DocumentArrowDownIcon className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{evidence.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {evidence.source} • {new Date(evidence.collectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {evidence.isAdmissible && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Admissible
                  </Badge>
                )}
                <Button size="sm" variant="ghost">
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TimelineView = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Investigation Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTimeline.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-3 h-3 rounded-full border-2",
                  event.isAutomated ? "bg-blue-500 border-blue-300" : "bg-green-500 border-green-300"
                )}></div>
                {index < mockTimeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">by {event.actor}</span>
                  {event.isAutomated && (
                    <Badge variant="secondary" className="text-xs">Auto</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function InvestigatorPage() {
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | 'ALL'>('ALL');

  const filteredInvestigations = mockInvestigations.filter(inv => {
    const matchesSearch = inv.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investigation Center</h1>
          <p className="text-muted-foreground">
            AI-powered fraud investigation and case management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bot Tasks Running</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <CpuChipIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cases">Case Management</TabsTrigger>
          <TabsTrigger value="investigation">Active Investigation</TabsTrigger>
          <TabsTrigger value="tools">Investigation Tools</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases by title or case number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status: {statusFilter === 'ALL' ? 'All' : statusFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {Object.values(InvestigationStatus).map((status) => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.replace('_', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInvestigations.map((investigation) => (
              <div 
                key={investigation.id}
                onClick={() => {
                  setSelectedInvestigation(investigation);
                  setActiveTab('investigation');
                }}
              >
                <InvestigationCard investigation={investigation} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investigation" className="space-y-6">
          {selectedInvestigation ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Investigation Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedInvestigation.caseTitle}</CardTitle>
                        <CardDescription>{selectedInvestigation.caseNumber}</CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(selectedInvestigation.status)}>
                        {selectedInvestigation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Priority:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={cn("w-2 h-2 rounded-full", getPriorityColor(selectedInvestigation.priority))}></div>
                          {selectedInvestigation.priority}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Case Type:</span>
                        <p className="mt-1 font-medium">{selectedInvestigation.caseType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned to:</span>
                        <p className="mt-1 font-medium">{selectedInvestigation.assignedInvestigator}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Team:</span>
                        <p className="mt-1 font-medium">{selectedInvestigation.assignedTeam}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Primary Account:</span>
                        <p className="mt-1 font-medium font-mono">{selectedInvestigation.primaryAccountId}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estimated Loss:</span>
                        <p className="mt-1 font-semibold text-red-600">
                          {new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR' 
                          }).format(selectedInvestigation.estimatedLoss || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <TimelineView />
              </div>

{/* Sidebar */}
             <div className="space-y-6">
               <BotPanel />
               <EvidenceManager />
               
               {/* Quick Actions */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Quick Actions</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   <Button variant="outline" size="sm" className="w-full justify-start">
                     <DocumentTextIcon className="h-4 w-4 mr-2" />
                     Add Note
                   </Button>
                   <Button variant="outline" size="sm" className="w-full justify-start">
                     <LinkIcon className="h-4 w-4 mr-2" />
                     Link Alert
                   </Button>
                   <Button variant="outline" size="sm" className="w-full justify-start">
                     <UserIcon className="h-4 w-4 mr-2" />
                     Reassign Case
                   </Button>
                   <Button variant="outline" size="sm" className="w-full justify-start">
                     <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                     Export Data
                   </Button>
                 </CardContent>
               </Card>
             </div>
           </div>
         ) : (
           <Card>
             <CardContent className="flex flex-col items-center justify-center py-12">
               <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground mb-4" />
               <h3 className="text-lg font-semibold mb-2">No Investigation Selected</h3>
               <p className="text-muted-foreground text-center mb-4">
                 Select a case from the Case Management tab to start investigating
               </p>
               <Button onClick={() => setActiveTab('cases')}>
                 Browse Cases
               </Button>
             </CardContent>
           </Card>
         )}
       </TabsContent>

       <TabsContent value="tools" className="space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* AI Investigation Tools */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <CpuChipIcon className="h-5 w-5" />
                 AI Investigation Suite
               </CardTitle>
               <CardDescription>
                 Advanced AI tools for fraud pattern detection and analysis
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                 {Object.values(BotTaskType).map((taskType) => (
                   <Button 
                     key={taskType}
                     variant="outline" 
                     className="h-auto p-4 flex flex-col items-start"
                   >
                     <div className="flex items-center gap-2 mb-2">
                       <ChartBarIcon className="h-4 w-4" />
                       <span className="text-sm font-medium">
                         {taskType.replace('_', ' ')}
                       </span>
                     </div>
                     <p className="text-xs text-muted-foreground text-left">
                       Click to run analysis
                     </p>
                   </Button>
                 ))}
               </div>
             </CardContent>
           </Card>

           {/* Manual Tools */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <MagnifyingGlassIcon className="h-5 w-5" />
                 Manual Investigation Tools
               </CardTitle>
               <CardDescription>
                 Traditional investigation and analysis tools
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               <Button variant="outline" className="w-full justify-start">
                 <DocumentTextIcon className="h-4 w-4 mr-2" />
                 Transaction Search & Analysis
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <UserIcon className="h-4 w-4 mr-2" />
                 Account Profiling Tool
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <MapPinIcon className="h-4 w-4 mr-2" />
                 Geographic Analysis
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <CalendarIcon className="h-4 w-4 mr-2" />
                 Timeline Reconstruction
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <LinkIcon className="h-4 w-4 mr-2" />
                 Network Relationship Mapper
               </Button>
             </CardContent>
           </Card>

           {/* Evidence Collection Tools */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <DocumentArrowDownIcon className="h-5 w-5" />
                 Evidence Collection
               </CardTitle>
               <CardDescription>
                 Tools for collecting and managing digital evidence
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               <Button variant="outline" className="w-full justify-start">
                 <DocumentTextIcon className="h-4 w-4 mr-2" />
                 Transaction Log Exporter
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <CpuChipIcon className="h-4 w-4 mr-2" />
                 Device Fingerprint Collector
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <PhotoIcon className="h-4 w-4 mr-2" />
                 Screenshot & Document Capture
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <BellIcon className="h-4 w-4 mr-2" />
                 System Event Logs
               </Button>
             </CardContent>
           </Card>

           {/* Reporting Tools */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <DocumentTextIcon className="h-5 w-5" />
                 Report Generation
               </CardTitle>
               <CardDescription>
                 Automated and manual report generation tools
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               <Button variant="outline" className="w-full justify-start">
                 <DocumentTextIcon className="h-4 w-4 mr-2" />
                 Preliminary Report Generator
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <ChartBarIcon className="h-4 w-4 mr-2" />
                 Executive Summary Creator
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                 Evidence Compilation Tool
               </Button>
               <Button variant="outline" className="w-full justify-start">
                 <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                 Compliance Report Builder
               </Button>
             </CardContent>
           </Card>
         </div>

         {/* Active Tool Sessions */}
         <Card>
           <CardHeader>
             <CardTitle>Active Tool Sessions</CardTitle>
             <CardDescription>
               Currently running investigation tools and their progress
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {mockBotTasks.map((task) => (
                 <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                   <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-3 h-3 rounded-full",
                       task.status === 'COMPLETED' ? 'bg-green-500' :
                       task.status === 'RUNNING' ? 'bg-blue-500 animate-pulse' :
                       task.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500'
                     )}></div>
                     <div>
                       <p className="font-medium">{task.type.replace('_', ' ')}</p>
                       <p className="text-sm text-muted-foreground">
                         Investigation: {task.investigationId}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Badge variant={
                       task.status === 'COMPLETED' ? 'default' :
                       task.status === 'RUNNING' ? 'secondary' :
                       task.status === 'FAILED' ? 'destructive' : 'outline'
                     }>
                       {task.status}
                     </Badge>
                     {task.status === 'RUNNING' && (
                       <Button size="sm" variant="outline">
                         <StopIcon className="h-4 w-4" />
                       </Button>
                     )}
                     {task.status === 'COMPLETED' && (
                       <Button size="sm" variant="outline">
                         <EyeIcon className="h-4 w-4" />
                       </Button>
                     )}
                   </div>
                 </div>
               ))}
               
               {mockBotTasks.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                   No active tool sessions
                 </div>
               )}
             </div>
           </CardContent>
         </Card>
       </TabsContent>

       <TabsContent value="reports" className="space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Investigation Analytics */}
           <Card className="lg:col-span-2">
             <CardHeader>
               <CardTitle>Investigation Performance Analytics</CardTitle>
               <CardDescription>
                 Key metrics and trends for investigation activities
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="text-center">
                   <p className="text-2xl font-bold text-primary">24</p>
                   <p className="text-sm text-muted-foreground">Cases This Month</p>
                 </div>
                 <div className="text-center">
                   <p className="text-2xl font-bold text-green-600">89%</p>
                   <p className="text-sm text-muted-foreground">Resolution Rate</p>
                 </div>
                 <div className="text-center">
                   <p className="text-2xl font-bold text-blue-600">3.2</p>
                   <p className="text-sm text-muted-foreground">Avg Days to Resolve</p>
                 </div>
                 <div className="text-center">
                   <p className="text-2xl font-bold text-orange-600">IDR 2.1B</p>
                   <p className="text-sm text-muted-foreground">Fraud Prevented</p>
                 </div>
               </div>
               
               <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                 <p className="text-muted-foreground">Investigation trends chart would go here</p>
               </div>
             </CardContent>
           </Card>

           {/* Report Generation */}
           <Card>
             <CardHeader>
               <CardTitle>Generate Reports</CardTitle>
               <CardDescription>
                 Create investigation and compliance reports
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <label className="text-sm font-medium mb-2 block">Report Type</label>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="w-full justify-between">
                       Monthly Summary
                       <FunnelIcon className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent className="w-full">
                     <DropdownMenuItem>Monthly Summary</DropdownMenuItem>
                     <DropdownMenuItem>Case Performance</DropdownMenuItem>
                     <DropdownMenuItem>Team Analytics</DropdownMenuItem>
                     <DropdownMenuItem>Compliance Report</DropdownMenuItem>
                     <DropdownMenuItem>Executive Dashboard</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
               
               <div>
                 <label className="text-sm font-medium mb-2 block">Date Range</label>
                 <div className="grid grid-cols-2 gap-2">
                   <Input type="date" />
                   <Input type="date" />
                 </div>
               </div>
               
               <Button className="w-full">
                 <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                 Generate Report
               </Button>
             </CardContent>
           </Card>
         </div>

         {/* Recent Reports Table */}
         <Card>
           <CardHeader>
             <CardTitle>Recent Reports</CardTitle>
             <CardDescription>
               Previously generated investigation reports
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Report Name</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Generated</TableHead>
                   <TableHead>Generated By</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 <TableRow>
                   <TableCell className="font-medium">July 2024 Investigation Summary</TableCell>
                   <TableCell>Monthly Summary</TableCell>
                   <TableCell>2024-07-01</TableCell>
                   <TableCell>John Anderson</TableCell>
                   <TableCell>
                     <Badge variant="default">Completed</Badge>
                   </TableCell>
                   <TableCell>
                     <div className="flex gap-2">
                       <Button size="sm" variant="ghost">
                         <EyeIcon className="h-4 w-4" />
                       </Button>
                       <Button size="sm" variant="ghost">
                         <DocumentArrowDownIcon className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-medium">Case INV-2024-001 Final Report</TableCell>
                   <TableCell>Case Report</TableCell>
                   <TableCell>2024-06-28</TableCell>
                   <TableCell>Sarah Wilson</TableCell>
                   <TableCell>
                     <Badge variant="default">Completed</Badge>
                   </TableCell>
                   <TableCell>
                     <div className="flex gap-2">
                       <Button size="sm" variant="ghost">
                         <EyeIcon className="h-4 w-4" />
                       </Button>
                       <Button size="sm" variant="ghost">
                         <DocumentArrowDownIcon className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell className="font-medium">Q2 2024 Compliance Review</TableCell>
                   <TableCell>Compliance</TableCell>
                   <TableCell>2024-06-30</TableCell>
                   <TableCell>Michael Chen</TableCell>
                   <TableCell>
                     <Badge variant="secondary">In Review</Badge>
                   </TableCell>
                   <TableCell>
                     <div className="flex gap-2">
                       <Button size="sm" variant="ghost">
                         <EyeIcon className="h-4 w-4" />
                       </Button>
                       <Button size="sm" variant="ghost" disabled>
                         <DocumentArrowDownIcon className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       </TabsContent>
     </Tabs>
   </div>
 );
}