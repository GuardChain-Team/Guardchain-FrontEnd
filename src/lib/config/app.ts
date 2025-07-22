// src/lib/config/app.ts
import { env } from './env';

const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  version: env.NEXT_PUBLIC_APP_VERSION,
  environment: env.NEXT_PUBLIC_ENVIRONMENT,
  // API Configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    retries: 3,
  },
  // WebSocket Configuration
  websocket: {
    url: env.NEXT_PUBLIC_WEBSOCKET_URL,
    reconnectAttempts: 5,
    reconnectInterval: 5000,
  },
  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },
  // Table configuration
  table: {
    defaultPageSize: 20,
    maxRows: 1000,
  },
  // Chart configuration
  charts: {
    defaultColors: [
      '#3B82F6', // blue-500
      '#EF4444', // red-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#06B6D4', // cyan-500
      '#84CC16', // lime-500
    ],
    animation: {
      duration: 750,
      easing: 'ease-in-out',
    },
  },
  // Toast configuration
  toast: {
    duration: 5000,
    maxToasts: 5,
    position: 'bottom-right' as const,
  },
  // File upload configuration
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  // Risk score thresholds
  riskThresholds: {
    low: 0.3,
    medium: 0.6,
    high: 0.8,
  },
  // Alert severity configuration
  alertSeverity: {
    LOW: {
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    MEDIUM: {
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    HIGH: {
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    CRITICAL: {
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
  },
  // Feature flags
  features: {
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    realtime: env.NEXT_PUBLIC_ENABLE_REALTIME,
  },
  // Date and time formats
  dateFormats: {
    short: 'dd/MM/yyyy',
    medium: 'dd MMM yyyy',
    long: 'dd MMMM yyyy',
    datetime: 'dd/MM/yyyy HH:mm',
    time: 'HH:mm',
  },
  // Currency configuration
  currency: {
    default: 'IDR',
    locale: 'id-ID',
    symbol: 'Rp',
  },
  // Animation configuration
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

export default appConfig;