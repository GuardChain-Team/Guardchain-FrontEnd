export interface AlertTrendData {
  hour: string;
  count: number;
}

export interface RiskDistributionData {
  name: string;
  value: number;
}

export interface TransactionVolumeData {
  name: string;
  amount: number;
  count: number;
}

export interface ChartProps<T> {
  data: T[];
}
