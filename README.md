# **GuardChain Frontend - Next.js 15 Application**

## **📋 Project Overview**

**GuardChain** is a comprehensive AI-powered fraud detection platform designed specifically for Indonesian financial institutions. This Next.js 15 frontend application provides real-time fraud monitoring, investigation tools, and analytics dashboards for compliance officers, fraud investigators, and banking administrators.

### **🎯 Key Features**
- **Real-time Fraud Detection**: Live monitoring of suspicious transactions with ML-powered risk scoring
- **Investigation Management**: Comprehensive case management with AI-assisted investigation tools
- **Analytics Dashboard**: Advanced fraud analytics, trends, and performance metrics
- **Multi-platform Support**: Responsive design for desktop, tablet, and mobile devices
- **Real-time Notifications**: WebSocket-based live alerts and updates
- **Compliance Tools**: Regulatory reporting and audit trail management

### **🏢 Target Users**
- **Compliance Officers**: Monitor fraud alerts, manage investigations, generate reports
- **Fraud Investigators**: Conduct detailed investigations, collect evidence, analyze patterns
- **Bank Administrators**: Configure fraud rules, manage users, oversee system operations
- **Data Analysts**: Access fraud analytics, trend analysis, and performance metrics
- **System Administrators**: System configuration, user management, audit oversight

## **🏗️ Technical Architecture**

### **Frontend Stack**
```
Framework: Next.js 15 (App Router)
Language: TypeScript 5.0+
Styling: Tailwind CSS 3.3+
State Management: Zustand + TanStack Query
UI Components: Radix UI + Headless UI
Charts: Recharts + D3.js
Real-time: Socket.IO Client
Authentication: NextAuth.js
```

### **Backend Integration**
```
API: FastAPI (Python) - RESTful APIs
Real-time: WebSocket connections for live updates
Database: PostgreSQL with Redis caching
Message Queue: Apache Kafka for transaction streaming
ML Engine: TensorFlow/PyTorch for fraud detection
Authentication: JWT tokens with refresh mechanism
```

### **Key Integrations**
```
Payment Systems: BI-FAST, QRIS, GPN integration
Banking APIs: Real-time transaction data streaming
ML Models: Graph Neural Networks + Isolation Forest
Notification Services: Email, SMS, push notifications
Export Services: PDF, Excel, CSV report generation
```

## **🚀 Getting Started**

### **Prerequisites**
```bash
Node.js >= 18.18.0
npm >= 10.0.0 (or pnpm >= 8.0.0)
Git
```

### **Installation**
```bash
# Clone repository
git clone https://github.com/your-org/guardchain-frontend.git
cd guardchain-frontend

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

### **Environment Configuration**
```bash
# Application
NEXT_PUBLIC_APP_NAME=GuardChain
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# External Services
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## **📁 Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/             # Main application routes
│   │   ├── alerts/              # Fraud alerts management
│   │   ├── transactions/        # Transaction monitoring
│   │   ├── investigator/        # Investigation tools
│   │   ├── analytics/           # Analytics & reporting
│   │   ├── settings/            # System configuration
│   │   ├── page.tsx            # Dashboard home
│   │   └── layout.tsx          # Dashboard layout
│   ├── api/                     # API routes (if needed)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   ├── layout/                  # Layout components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard widgets
│   ├── fraud/                   # Fraud detection components
│   ├── transactions/            # Transaction components
│   ├── charts/                  # Chart components
│   ├── forms/                   # Form components
│   └── common/                  # Common utilities
├── lib/                         # Utility libraries
│   ├── api/                     # API clients
│   ├── auth/                    # Authentication utilities
│   ├── utils/                   # Helper functions
│   ├── realtime/                # WebSocket management
│   └── config/                  # Configuration files
├── hooks/                       # Custom React hooks
├── stores/                      # State management (Zustand)
├── types/                       # TypeScript definitions
├── constants/                   # Application constants
└── styles/                      # Additional styles
```

## **🔧 Key Components & Features**

### **1. Real-time Fraud Monitoring**
```typescript
// Real-time fraud alerts with WebSocket integration
const AlertsPage = () => {
  const { alerts, isConnected } = useRealTimeAlerts();
  const { blockTransaction, investigateAlert } = useAlertActions();
  
  return (
    <div className="space-y-6">
      <AlertsHeader connected={isConnected} />
      <AlertsFilters />
      <AlertsList 
        alerts={alerts}
        onBlock={blockTransaction}
        onInvestigate={investigateAlert}
      />
    </div>
  );
};
```

### **2. Investigation Management**
```typescript
// AI-powered investigation interface
const InvestigatorPage = () => {
  const { runInvestigation } = useInvestigatorBot();
  const { networkGraph, evidence } = useInvestigationData();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InvestigationPanel onRunAI={runInvestigation} />
      <NetworkVisualization data={networkGraph} />
      <EvidenceManager evidence={evidence} />
    </div>
  );
};
```

### **3. Analytics Dashboard**
```typescript
// Comprehensive fraud analytics
const AnalyticsPage = () => {
  const { fraudTrends, performance } = useAnalytics();
  
  return (
    <div className="space-y-8">
      <KPICards metrics={performance.kpis} />
      <FraudTrendsChart data={fraudTrends} />
      <RiskDistributionChart data={performance.riskDistribution} />
      <ModelPerformancePanel metrics={performance.models} />
    </div>
  );
};
```

## **🛠️ Development Guidelines**

### **Code Structure**
```typescript
// Use TypeScript for all components
interface AlertCardProps {
  alert: FraudAlert;
  onAction: (action: AlertAction) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAction }) => {
  // Component implementation
};

// Use proper error boundaries
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Error handling implementation
};
```

### **State Management Pattern**
```typescript
// Zustand stores for global state
interface AlertStore {
  alerts: FraudAlert[];
  filters: AlertFilters;
  setAlerts: (alerts: FraudAlert[]) => void;
  updateFilter: (filter: Partial<AlertFilters>) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  filters: DEFAULT_FILTERS,
  setAlerts: (alerts) => set({ alerts }),
  updateFilter: (filter) => set((state) => ({ 
    filters: { ...state.filters, ...filter } 
  })),
}));
```

### **API Integration**
```typescript
// TanStack Query for server state
export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsApi.getAlerts(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// WebSocket integration
export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const socket = io(WEBSOCKET_URL);
    // Socket implementation
  }, []);
  
  return { alerts, isConnected };
};
```

## **📊 Data Models & Types**

### **Core Data Structures**
```typescript
// Fraud Alert
interface FraudAlert {
  id: string;
  alertId: string;
  transactionId: string;
  accountId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  riskScore: number;
  riskFactors: RiskFactor[];
  description: string;
  status: AlertStatus;
  assignedTo?: string;
  detectedAt: string;
  resolvedAt?: string;
  evidence?: Evidence[];
}

// Transaction
interface Transaction {
  id: string;
  transactionId: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  channel: Channel;
  status: TransactionStatus;
  transactionTime: string;
  location?: LocationData;
  riskScore?: number;
}

// Investigation
interface Investigation {
  id: string;
  caseNumber: string;
  caseTitle: string;
  caseType: CaseType;
  priority: Priority;
  status: InvestigationStatus;
  primaryAccountId: string;
  assignedInvestigator?: string;
  caseOpened: string;
  caseClosed?: string;
  findings?: InvestigationFindings;
  estimatedLoss?: number;
  confirmedLoss?: number;
}
```

### **API Response Types**
```typescript
// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
  };
}

// Pagination
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
```

## **🎨 UI/UX Design System**

### **Color Palette**
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Danger/Alert Colors */
--danger-50: #fef2f2;
--danger-500: #ef4444;
--danger-900: #7f1d1d;

/* Success Colors */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-900: #14532d;

/* Warning Colors */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-900: #78350f;
```

### **Typography**
```css
/* Font Families */
font-family: 'Inter', sans-serif; /* Primary */
font-family: 'JetBrains Mono', monospace; /* Code/Data */

/* Font Sizes */
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
text-2xl: 1.5rem;    /* 24px */
text-3xl: 1.875rem;  /* 30px */
```

### **Component Guidelines**
```typescript
// Button variants
<Button variant="primary" size="md">Primary Action</Button>
<Button variant="danger" size="sm">Block Transaction</Button>
<Button variant="ghost" size="lg">Secondary Action</Button>

// Alert components
<Alert severity="high" type="fraud">
  High-risk transaction detected
</Alert>

// Data display
<DataTable
  data={transactions}
  columns={transactionColumns}
  pagination={true}
  realTime={true}
/>
```

## **⚡ Performance Optimization**

### **Code Splitting**
```typescript
// Lazy loading for heavy components
const NetworkVisualization = lazy(() => import('./NetworkVisualization'));
const AdvancedAnalytics = lazy(() => import('./AdvancedAnalytics'));

// Route-based code splitting (automatic with App Router)
```

### **Caching Strategy**
```typescript
// TanStack Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Image optimization
<Image
  src="/fraud-chart.png"
  alt="Fraud trends"
  width={800}
  height={400}
  priority={true}
/>
```

### **Bundle Optimization**
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    config.optimization.splitChunks.chunks = 'all';
    return config;
  },
};
```

## **🔒 Security Implementation**

### **Authentication Flow**
```typescript
// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Authentication logic
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // JWT customization
    },
    async session({ session, token }) {
      // Session customization
    }
  }
};
```

### **Route Protection**
```typescript
// Middleware for route protection
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
```

### **Data Validation**
```typescript
// Zod schemas for validation
const alertSchema = z.object({
  alertType: z.enum(['AMOUNT_ANOMALY', 'PATTERN_MATCH', 'NETWORK_RISK']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  riskScore: z.number().min(0).max(1),
});

// Form validation
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(alertSchema)
});
```

## **🧪 Testing Strategy**

### **Unit Testing**
```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { AlertCard } from './AlertCard';

describe('AlertCard', () => {
  it('renders alert information correctly', () => {
    const mockAlert = createMockAlert();
    render(<AlertCard alert={mockAlert} onAction={jest.fn()} />);
    
    expect(screen.getByText(mockAlert.description)).toBeInTheDocument();
    expect(screen.getByText(`Risk: ${mockAlert.riskScore}`)).toBeInTheDocument();
  });
});
```

### **Integration Testing**
```typescript
// API integration testing
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/alerts', (req, res, ctx) => {
    return res(ctx.json({ alerts: mockAlerts }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### **E2E Testing**
```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test('fraud investigation workflow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="alerts-tab"]');
  await page.click('[data-testid="investigate-button"]');
  
  await expect(page.locator('[data-testid="investigation-panel"]')).toBeVisible();
});
```

## **📈 Monitoring & Analytics**

### **Performance Monitoring**
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

function sendToAnalytics(metric) {
  // Send to analytics service
}
```

### **Error Tracking**
```typescript
// Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
});

// Error boundary
export class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }
}
```

## **🚀 Deployment**

### **Build Process**
```bash
# Production build
pnpm build

# Performance analysis
pnpm analyze

# Docker build
docker build -t guardchain-frontend .
```

### **Environment Configuration**
```bash
# Production environment
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_BASE_URL=https://api.guardchain.ai
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.guardchain.ai/ws

# Performance optimizations
NEXT_PUBLIC_DISABLE_DEVTOOLS=true
NEXT_TELEMETRY_DISABLED=1
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## **📚 Additional Resources**

### **Documentation**
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### **Related Repositories**
- [GuardChain Backend](https://github.com/your-org/guardchain-backend)
- [GuardChain ML Models](https://github.com/your-org/guardchain-ml)
- [GuardChain Documentation](https://github.com/your-org/guardchain-docs)

### **Support**
- **Technical Issues**: Create an issue in this repository
- **Security Concerns**: Email security@guardchain.ai
- **General Questions**: Contact dev@guardchain.ai

---

**Built with ❤️ for Indonesian Financial Security**

This README provides comprehensive context about the GuardChain frontend application, enabling AI assistants to understand the project requirements, architecture, and implementation details for effective assistance with development tasks.