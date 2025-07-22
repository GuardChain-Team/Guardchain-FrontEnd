// src/components/fraud/alert-filters.tsx
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertSeverity, AlertStatus } from "@/types/global";
import { AlertType } from "@/types/fraud";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type FilterValue = string | string[] | DateRange | undefined;

interface AlertFilters {
  search?: string;
  severity?: AlertSeverity | "ALL";
  status?: AlertStatus | "ALL";
  type?: AlertType | "ALL";
  dateRange?: DateRange;
}

interface AlertFiltersProps {
  onFiltersChange: (filters: AlertFilters) => void;
  activeFilters: AlertFilters;
}

export function AlertFilters({
  onFiltersChange,
  activeFilters,
}: AlertFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    activeFilters.dateRange as DateRange
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onFiltersChange({ ...activeFilters, search: value });
    },
    [activeFilters, onFiltersChange]
  );

  type FilterKey = keyof AlertFilters;

  const handleFilterChange = useCallback(
    (key: FilterKey, value: FilterValue) => {
      onFiltersChange({ ...activeFilters, [key]: value });
    },
    [activeFilters, onFiltersChange]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      if (range) {
        setDateRange(range);
        handleFilterChange("dateRange", range);
      }
    },
    [handleFilterChange]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setDateRange(undefined);
    onFiltersChange({
      search: "",
      severity: "ALL",
      status: "ALL",
      type: "ALL",
      dateRange: undefined,
    });
  }, [onFiltersChange]);

  const activeFilterCount = Object.entries(activeFilters).filter(
    ([key, value]) => value && value !== "ALL" && key !== "search"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters & Search</h3>
        {activeFilterCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <XMarkIcon className="h-4 w-4 mr-2" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Severity Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center">
                <FunnelIcon className="h-4 w-4 mr-2" />
                {activeFilters.severity === "ALL" || !activeFilters.severity
                  ? "All Severities"
                  : activeFilters.severity}
              </span>
              {activeFilters.severity && activeFilters.severity !== "ALL" && (
                <Badge variant="secondary" className="ml-2">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilterChange("severity", "ALL")}
            >
              All Severities
            </DropdownMenuItem>
            {Object.values(AlertSeverity).map((severity) => (
              <DropdownMenuItem
                key={severity}
                onClick={() => handleFilterChange("severity", severity)}
              >
                {severity}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center">
                <FunnelIcon className="h-4 w-4 mr-2" />
                {activeFilters.status === "ALL" || !activeFilters.status
                  ? "All Status"
                  : activeFilters.status}
              </span>
              {activeFilters.status && activeFilters.status !== "ALL" && (
                <Badge variant="secondary" className="ml-2">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilterChange("status", "ALL")}
            >
              All Status
            </DropdownMenuItem>
            {Object.values(AlertStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleFilterChange("status", status)}
              >
                {status.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange?.from ? "Custom Range" : "All Dates"}
              </span>
              {dateRange?.from && (
                <Badge variant="secondary" className="ml-2">
                  1
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === "ALL" || key === "search") return null;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {key}:{" "}
                {value instanceof Object ? "Custom Range" : String(value)}
                <XMarkIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(key as FilterKey, "ALL")}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
