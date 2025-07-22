// src/lib/config/api.ts

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
      register: '/auth/register',
      resetPassword: '/auth/reset-password',
      changePassword: '/auth/change-password',
    },
    // Fraud Management
    fraud: {
      alerts: '/fraud/alerts',
      alert: (id: string) => `/fraud/alerts/${id}`,
      resolve: (id: string) => `/fraud/alerts/${id}/resolve`,
      escalate: (id: string) => `/fraud/alerts/${id}/escalate`,
      patterns: '/fraud/patterns',
      models: '/fraud/models',
    },
    // Transactions
    transactions: {
      list: '/transactions',
      details: (id: string) => `/transactions/${id}`,
      search: '/transactions/search',
      export: '/transactions/export',
      summary: '/transactions/summary',
    },

    // Investigations
    investigations: {
      list: '/investigations',
      create: '/investigations',
      details: (id: string) => `/investigations/${id}`,
      update: (id: string) => `/investigations/${id}`,
      timeline: (id: string) => `/investigations/${id}/timeline`,
      evidence: (id: string) => `/investigations/${id}/evidence`,
      reports: (id: string) => `/investigations/${id}/reports`,
    },

    // Analytics
    analytics: {
      dashboard: '/analytics/dashboard',
      trends: '/analytics/trends',
      performance: '/analytics/performance',
      export: '/analytics/export',
      realtime: '/analytics/realtime',
    },

    // User Management
    users: {
      list: '/users',
      create: '/users',
      details: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
      permissions: (id: string) => `/users/${id}/permissions`,
    },

    // Settings
    settings: {
      system: '/settings/system',
      alerts: '/settings/alerts',
      notifications: '/settings/notifications',
      integrations: '/settings/integrations',
    },

    // File Management
    files: {
      upload: '/files/upload',
      download: (id: string) => `/files/${id}`,
      delete: (id: string) => `/files/${id}`,
    },

    // Health Check
    health: '/health',
    
    // WebSocket
    websocket: {
      connect: '/ws/connect',
      alerts: '/ws/alerts',
      transactions: '/ws/transactions',
    },
  },

  // HTTP Status Codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  },

  // Error Messages
  errorMessages: {
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Internal server error. Please try again later.',
    VALIDATION_ERROR: 'Validation error occurred.',
    UNKNOWN_ERROR: 'An unknown error occurred.',
  },
} as const;