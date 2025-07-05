// src/lib/utils/format.ts
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format currency (Indonesian Rupiah)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with separators
 */
export function formatNumber(
  num: number,
  decimals: number = 0,
  locale: string = 'id-ID'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// src/lib/utils/format.ts (continued)
/**
* Format percentage
*/
export function formatPercentage(
 value: number,
 decimals: number = 1,
 locale: string = 'id-ID'
): string {
 return new Intl.NumberFormat(locale, {
   style: 'percent',
   minimumFractionDigits: decimals,
   maximumFractionDigits: decimals,
 }).format(value / 100);
}

/**
* Format date to various formats
*/
export function formatDate(
 date: string | Date,
 formatStr: string = 'dd MMM yyyy'
): string {
 try {
   const dateObj = typeof date === 'string' ? parseISO(date) : date;
   if (!isValid(dateObj)) return 'Invalid Date';
   return format(dateObj, formatStr, { locale: id });
 } catch {
   return 'Invalid Date';
 }
}

/**
* Format date with time
*/
export function formatDateTime(
 date: string | Date,
 formatStr: string = 'dd MMM yyyy, HH:mm'
): string {
 return formatDate(date, formatStr);
}

/**
* Format relative time (e.g., "2 hours ago")
*/
export function formatRelativeTime(date: string | Date): string {
 try {
   const dateObj = typeof date === 'string' ? parseISO(date) : date;
   if (!isValid(dateObj)) return 'Invalid Date';
   return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
 } catch {
   return 'Invalid Date';
 }
}

/**
* Format duration in milliseconds to human readable format
*/
export function formatDuration(ms: number): string {
 if (ms < 1000) return `${ms}ms`;
 if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
 if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
 
 const hours = Math.floor(ms / 3600000);
 const minutes = Math.floor((ms % 3600000) / 60000);
 return `${hours}h ${minutes}m`;
}

/**
* Format risk score to color and label
*/
export function formatRiskScore(score: number): {
 label: string;
 color: string;
 bgColor: string;
} {
 if (score >= 0.8) {
   return {
     label: 'Critical',
     color: 'text-red-600',
     bgColor: 'bg-red-50 border-red-200'
   };
 } else if (score >= 0.6) {
   return {
     label: 'High',
     color: 'text-orange-600',
     bgColor: 'bg-orange-50 border-orange-200'
   };
 } else if (score >= 0.4) {
   return {
     label: 'Medium',
     color: 'text-yellow-600',
     bgColor: 'bg-yellow-50 border-yellow-200'
   };
 } else {
   return {
     label: 'Low',
     color: 'text-green-600',
     bgColor: 'bg-green-50 border-green-200'
   };
 }
}

/**
* Format transaction amount with currency
*/
export function formatTransactionAmount(
 amount: number,
 currency: string = 'IDR'
): string {
 const isNegative = amount < 0;
 const absAmount = Math.abs(amount);
 const formatted = formatCurrency(absAmount, currency);
 
 return isNegative ? `-${formatted}` : formatted;
}

/**
* Format bank account number with masking
*/
export function formatAccountNumber(
 accountNumber: string,
 showLast: number = 4
): string {
 if (accountNumber.length <= showLast) return accountNumber;
 
 const masked = '*'.repeat(accountNumber.length - showLast);
 const visible = accountNumber.slice(-showLast);
 
 return `${masked}${visible}`;
}

/**
* Format phone number (Indonesian format)
*/
export function formatPhoneNumber(phone: string): string {
 // Remove all non-digits
 const cleaned = phone.replace(/\D/g, '');
 
 // Indonesian phone number formatting
 if (cleaned.startsWith('62')) {
   // +62 format
   const number = cleaned.substring(2);
   if (number.length >= 9) {
     return `+62 ${number.substring(0, 3)} ${number.substring(3, 7)} ${number.substring(7)}`;
   }
 } else if (cleaned.startsWith('0')) {
   // 0xxx format
   if (cleaned.length >= 10) {
     return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 8)} ${cleaned.substring(8)}`;
   }
 }
 
 return phone; // Return original if can't format
}

/**
* Format file size
*/
export function formatFileSize(bytes: number): string {
 const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
 if (bytes === 0) return '0 Bytes';
 
 const i = Math.floor(Math.log(bytes) / Math.log(1024));
 const size = bytes / Math.pow(1024, i);
 
 return `${size.toFixed(1)} ${sizes[i]}`;
}

/**
* Format status with appropriate styling
*/
export function formatStatus(status: string): {
 label: string;
 color: string;
 bgColor: string;
} {
 const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
   ACTIVE: { label: 'Active', color: 'text-green-600', bgColor: 'bg-green-50' },
   INACTIVE: { label: 'Inactive', color: 'text-gray-600', bgColor: 'bg-gray-50' },
   PENDING: { label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
   APPROVED: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-50' },
   REJECTED: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50' },
   BLOCKED: { label: 'Blocked', color: 'text-red-600', bgColor: 'bg-red-50' },
   COMPLETED: { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-50' },
   FAILED: { label: 'Failed', color: 'text-red-600', bgColor: 'bg-red-50' },
   CANCELLED: { label: 'Cancelled', color: 'text-gray-600', bgColor: 'bg-gray-50' },
   OPEN: { label: 'Open', color: 'text-blue-600', bgColor: 'bg-blue-50' },
   IN_PROGRESS: { label: 'In Progress', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
   RESOLVED: { label: 'Resolved', color: 'text-green-600', bgColor: 'bg-green-50' },
   ESCALATED: { label: 'Escalated', color: 'text-red-600', bgColor: 'bg-red-50' },
 };
 
 return statusMap[status] || { 
   label: status, 
   color: 'text-gray-600', 
   bgColor: 'bg-gray-50' 
 };
}

/**
* Format confidence score as percentage
*/
export function formatConfidence(confidence: number): string {
 return `${Math.round(confidence * 100)}%`;
}

/**
* Format large numbers with K, M, B suffixes
*/
export function formatCompactNumber(num: number): string {
 if (num < 1000) return num.toString();
 if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
 if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
 return `${(num / 1000000000).toFixed(1)}B`;
}

/**
* Format IP address with location if available
*/
export function formatIPAddress(ip: string, location?: string): string {
 if (location) {
   return `${ip} (${location})`;
 }
 return ip;
}

/**
* Format investigation case number
*/
export function formatCaseNumber(caseNumber: string): string {
 // Format: CASE-YYYY-NNNNNN
 if (caseNumber.includes('-')) {
   return caseNumber.toUpperCase();
 }
 
 // If no formatting, add it
 const year = new Date().getFullYear();
 return `CASE-${year}-${caseNumber.padStart(6, '0')}`;
}

/**
* Format alert ID for display
*/
export function formatAlertId(alertId: string): string {
 // Format: ALERT-YYYYMMDD-NNNN
 return alertId.toUpperCase();
}

/**
* Format device info for display
*/
export function formatDeviceInfo(deviceInfo: {
 deviceType?: string;
 os?: string;
 browser?: string;
}): string {
 const parts = [];
 
 if (deviceInfo.deviceType) {
   parts.push(deviceInfo.deviceType);
 }
 
 if (deviceInfo.os) {
   parts.push(deviceInfo.os);
 }
 
 if (deviceInfo.browser) {
   parts.push(deviceInfo.browser);
 }
 
 return parts.join(' • ') || 'Unknown Device';
}

/**
* Format change indicator (increase/decrease)
*/
export function formatChange(
 current: number,
 previous: number,
 asPercentage: boolean = true
): {
 value: string;
 type: 'increase' | 'decrease' | 'neutral';
 color: string;
} {
 const change = current - previous;
 const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
 
 const type = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral';
 const color = type === 'increase' ? 'text-green-600' : 
               type === 'decrease' ? 'text-red-600' : 'text-gray-600';
 
 const value = asPercentage 
   ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`
   : `${change >= 0 ? '+' : ''}${formatNumber(change)}`;
 
 return { value, type, color };
}