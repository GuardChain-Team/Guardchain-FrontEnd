// src/types/analytics.ts
import { DateRange } from './global';

export interface AnalyticsDashboard {
  kpis: KPIMetrics;
  charts: ChartData[];
  trends: TrendAnalysis;
  alerts: AlertAnalytics;
  performance: ModelPerformance;
  realTimeStats: RealTimeStats;
}

export interface KPIMetrics {
  totalTransactions: MetricValue;
  fraudDetected: MetricValue;
  falsePositives: MetricValue;
  truePositives: MetricValue;
  detectionRate: MetricValue;
  averageResponseTime: MetricValue;
  costSavings: MetricValue;
  riskScore: MetricValue;
}

export interface MetricValue {
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  unit?: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  timeframe: string;
  data: ChartDataPoint[];
  metadata?: {
    currency?: string;
    unit?: string;
    threshold?: number;
  };
}

export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  AREA = 'AREA',
  SCATTER = 'SCATTER',
  HEATMAP = 'HEATMAP',
  GAUGE = 'GAUGE',
  FUNNEL = 'FUNNEL'
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TrendAnalysis {
  fraudTrends: TrendData;
  volumeTrends: TrendData;
  geographicTrends: GeographicTrendData[];
  temporalPatterns: TemporalPattern[];
  seasonality: SeasonalityData;
}

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
  confidence: number;
  forecast?: ForecastData[];
}

export interface GeographicTrendData {
  region: string;
  country: string;
  city?: string;
  fraudCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  change: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TemporalPattern {
  period: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  pattern: number[];
  anomalies: AnomalyData[];
  confidence: number;
}

export interface AnomalyData {
  timestamp: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SeasonalityData {
  hasSeasonality: boolean;
  period: string;
  strength: number;
  peaks: string[];
  troughs: string[];
}

export interface ForecastData {
  timestamp: string;
  value: number;
  confidence: {
    lower: number;
    upper: number;
  };
}

export interface AlertAnalytics {
  distribution: AlertDistribution;
  resolution: AlertResolutionMetrics;
  performance: AlertPerformanceMetrics;
  trends: AlertTrendData[];
}

export interface AlertDistribution {
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byAssignee: Record<string, number>;
}

export interface AlertResolutionMetrics {
  averageResolutionTime: number;
  resolutionTimeByType: Record<string, number>;
  escalationRate: number;
  falsePositiveRate: number;
  customerSatisfaction?: number;
}

export interface AlertPerformanceMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  auc: number;
  byAlertType: Record<string, ModelMetrics>;
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface AlertTrendData {
  date: string;
  total: number;
  resolved: number;
  escalated: number;
  falsePositives: number;
}

export interface ModelPerformance {
  models: ModelMetrics[];
  comparison: ModelComparison;
  driftDetection: DriftAnalysis;
  featureImportance: FeatureImportance[];
}

export interface ModelComparison {
  current: string;
  baseline: string;
  improvement: number;
  deploymentDate: string;
  rollbackThreshold: number;
}

export interface DriftAnalysis {
  hasDrift: boolean;
  driftScore: number;
  features: FeatureDrift[];
  recommendActions: string[];
  lastChecked: string;
}

export interface FeatureDrift {
  feature: string;
  currentDistribution: number[];
  baselineDistribution: number[];
  driftScore: number;
  threshold: number;
  status: 'STABLE' | 'WARNING' | 'DRIFT';
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

export interface RealTimeStats {
  currentLoad: number;
  transactionsPerSecond: number;
  alertsPerMinute: number;
  systemHealth: {
    api: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    database: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    mlEngine: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    queue: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  };
  performance: {
    apiLatency: number;
    dbLatency: number;
    mlLatency: number;
    queueDepth: number;
  };
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  regions?: string[];
  alertTypes?: string[];
  riskLevels?: string[];
  channels?: string[];
  models?: string[];
  granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface ExportOptions {
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  includeCharts: boolean;
  includeRawData: boolean;
  dateRange: DateRange;
  filters?: AnalyticsFilters;
}