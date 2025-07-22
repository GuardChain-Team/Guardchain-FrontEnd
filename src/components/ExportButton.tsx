import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import * as XLSX from "xlsx";
import { DateRange, ExportRequestBody, ExportResponse } from "@/types/export";

interface ExportButtonProps {
  onExport?: (data: Blob) => void;
  className?: string;
}

export function ExportButton({ onExport, className }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [fields, setFields] = useState<string[]>([
    "transactions",
    "alerts",
    "investigations",
  ]);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          dateRange,
          includeFields: fields,
          filters: { status: "ALL" },
        }),
      });

      if (!response.ok) throw new Error("Export failed");

      const data = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_export_${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      if (onExport) onExport(data);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcelExport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateRange, includeFields: fields }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      // Convert to Excel
      const ws = XLSX.utils.json_to_sheet(data.transactions);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");

      // Save Excel file
      XLSX.writeFile(wb, `transactions_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error("Excel export error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Transaction Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>Export Format</label>
            <Select
              value={format}
              onValueChange={(value: "csv" | "xlsx") => setFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>Date Range</label>
            <div className="flex gap-2">
              <DatePicker
                value={dateRange.from}
                onChange={(date: Date | undefined) =>
                  setDateRange((prev) => ({ ...prev, from: date }))
                }
              />
              <DatePicker
                value={dateRange.to}
                onChange={(date: Date | undefined) =>
                  setDateRange((prev) => ({ ...prev, to: date }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDateRange({ from: undefined, to: undefined })}
            >
              Reset
            </Button>
            <Button
              onClick={format === "xlsx" ? handleExcelExport : handleExport}
              disabled={loading}
            >
              {loading ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
