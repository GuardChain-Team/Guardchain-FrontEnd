// src/types/investigation.ts
import { BaseEntity, UserRole } from './global';
import { FraudAlert } from './fraud';
import { Transaction } from './transaction';

export interface Investigation extends BaseEntity {
  caseNumber: string;
  caseTitle: string;
  caseType: CaseType;
  priority: Priority;
  status: InvestigationStatus;
  primaryAccountId: string;
  assignedInvestigator?: string;
  assignedTeam?: string;
  caseOpened: string;
  caseClosed?: string;
  estimatedLoss?: number;
  confirmedLoss?: number;
  recoveredAmount?: number;
  alerts: FraudAlert[];
  transactions: Transaction[];
  findings?: InvestigationFindings;
  timeline: InvestigationEvent[];
  evidence: Evidence[];
  reports: InvestigationReport[];
  tags?: string[];
  relatedCases?: string[];
}

export enum CaseType {
  FRAUD_INVESTIGATION = 'FRAUD_INVESTIGATION',
  AML_INVESTIGATION = 'AML_INVESTIGATION',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  CUSTOMER_DISPUTE = 'CUSTOMER_DISPUTE',
  SYSTEM_ANOMALY = 'SYSTEM_ANOMALY'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum InvestigationStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED'
}

export interface InvestigationFindings {
  summary: string;
  fraudConfirmed: boolean;
  fraudType?: string;
  impact: {
    financialLoss: number;
    affectedAccounts: number;
    affectedTransactions: number;
  };
  rootCause: string;
  recommendations: string[];
  preventiveMeasures: string[];
  lessonsLearned?: string[];
}

export interface InvestigationEvent {
  id: string;
  timestamp: string;
  type: EventType;
  description: string;
  actor: string;
  details?: Record<string, any>;
  isAutomated: boolean;
}

export enum EventType {
  CASE_CREATED = 'CASE_CREATED',
  CASE_ASSIGNED = 'CASE_ASSIGNED',
  EVIDENCE_ADDED = 'EVIDENCE_ADDED',
  NOTE_ADDED = 'NOTE_ADDED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  ALERT_LINKED = 'ALERT_LINKED',
  TRANSACTION_ANALYZED = 'TRANSACTION_ANALYZED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  CASE_ESCALATED = 'CASE_ESCALATED',
  CASE_RESOLVED = 'CASE_RESOLVED'
}

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  source: string;
  collectedAt: string;
  collectedBy: string;
  description: string;
  fileUrl?: string;
  fileSize?: number;
  hash?: string;
  chainOfCustody: CustodyRecord[];
  isAdmissible: boolean;
  tags?: string[];
}

export enum EvidenceType {
  TRANSACTION_LOG = 'TRANSACTION_LOG',
  SCREENSHOT = 'SCREENSHOT',
  DOCUMENT = 'DOCUMENT',
  EMAIL = 'EMAIL',
  PHONE_RECORD = 'PHONE_RECORD',
  DEVICE_DATA = 'DEVICE_DATA',
  NETWORK_LOG = 'NETWORK_LOG',
  BEHAVIORAL_DATA = 'BEHAVIORAL_DATA',
  BIOMETRIC_DATA = 'BIOMETRIC_DATA'
}

export interface CustodyRecord {
  timestamp: string;
  action: 'COLLECTED' | 'TRANSFERRED' | 'ANALYZED' | 'STORED';
  actor: string;
  location: string;
  notes?: string;
}

export interface InvestigationReport {
  id: string;
  title: string;
  type: ReportType;
  format: 'PDF' | 'DOCX' | 'HTML' | 'JSON';
  generatedAt: string;
  generatedBy: string;
  fileUrl: string;
  fileSize: number;
  sections: ReportSection[];
  isConfidential: boolean;
  distribution: string[];
}

export enum ReportType {
  PRELIMINARY = 'PRELIMINARY',
  INTERIM = 'INTERIM',
  FINAL = 'FINAL',
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY',
  TECHNICAL = 'TECHNICAL',
  COMPLIANCE = 'COMPLIANCE'
}

export interface ReportSection {
  title: string;
  content: string;
  order: number;
  type: 'TEXT' | 'TABLE' | 'CHART' | 'IMAGE';
  data?: any;
}

export interface InvestigationFilters {
  status?: InvestigationStatus[];
  priority?: Priority[];
  caseType?: CaseType[];
  assignedTo?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  tags?: string[];
  hasFindings?: boolean;
}

export interface InvestigatorBot {
  id: string;
  name: string;
  capabilities: string[];
  isActive: boolean;
  lastRunAt?: string;
  performance: {
    tasksCompleted: number;
    accuracy: number;
    avgProcessingTime: number;
  };
}

export interface BotTask {
  id: string;
  type: BotTaskType;
  investigationId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export enum BotTaskType {
  PATTERN_ANALYSIS = 'PATTERN_ANALYSIS',
  NETWORK_MAPPING = 'NETWORK_MAPPING',
  TIMELINE_RECONSTRUCTION = 'TIMELINE_RECONSTRUCTION',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  EVIDENCE_COLLECTION = 'EVIDENCE_COLLECTION',
  REPORT_GENERATION = 'REPORT_GENERATION'
}