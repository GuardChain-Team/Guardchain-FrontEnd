import { Transaction } from "./transaction";
import { FraudAlert } from "./fraud";
import { Investigation } from "./investigation";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface ExportRequestBody {
  format: "csv" | "xlsx";
  dateRange: DateRange;
  includeFields: string[];
  filters: {
    status: string;
  };
}

export interface ExportResponse {
  transactions: Transaction[];
  alerts: FraudAlert[];
  investigations: Investigation[];
}
