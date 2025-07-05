// src/components/fraud/alert-filters.tsx (perbaiki nama file dari aler-filters.tsx)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AlertSeverity, AlertStatus } from '@/types/global';
import { AlertType } from '@/types/fraud';

interface AlertFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export function AlertFilters({ onFiltersChange, activeFilters }: AlertFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...activeFilters, search: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...activeFilters, [key]: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ from: undefined, to: undefined });
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] && activeFilters[key] !== 'ALL'
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
                {activeFilters.severity === 'ALL' || !activeFilters.severity 
                  ? 'All Severities' 
                  : activeFilters.severity}
              </span>
              {activeFilters.severity && activeFilters.severity !== 'ALL' && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('severity', 'ALL')}>
              All Severities
            </DropdownMenuItem>
            {Object.values(AlertSeverity).map((severity) => (
              <DropdownMenuItem 
                key={severity}
                onClick={() => handleFilterChange('severity', severity)}
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
                {activeFilters.status === 'ALL' || !activeFilters.status 
                  ? 'All Status' 
                  : activeFilters.status}
              </span>
              {activeFilters.status && activeFilters.status !== 'ALL' && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange('status', 'ALL')}>
              All Status
            </DropdownMenuItem>
            {Object.values(AlertStatus).map((status) => (
              <DropdownMenuItem 
                key={status}
                onClick={() => handleFilterChange('status', status)}
              >
                {status.replace('_', ' ')}
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
                {dateRange.from ? 'Custom Range' : 'All Dates'}
              </span>
              {dateRange.from && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === 'ALL') return null;
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {String(value)}
                <XMarkIcon 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange(key, 'ALL')}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}