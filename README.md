# **GuardChain Frontend - AI-Powered Fraud Detection System**

## **📋 Project Overview**

**GuardChain** is a comprehensive AI-powered fraud detection platform built for the BI-OJK Hackathon 2025. This Next.js 15 application provides real-time fraud monitoring, investigation workflows, and analytics dashboards for financial institutions, featuring advanced ML-powered risk scoring and comprehensive case management tools.

### **🎯 Implemented Features**

#### **🔐 Authentication & Authorization**

- **Multi-role Authentication**: Admin, Investigator, and Analyst roles with JWT tokens
- **Role-based Access Control**: Different permissions and UI access based on user roles
- **Secure Login System**: Password hashing with bcrypt and session management

#### **📊 Real-time Fraud Monitoring**

- **Live Transaction Feed**: Real-time transaction monitoring with WebSocket updates
- **AI Risk Scoring**: ML-powered risk assessment with scores from 0.0 to 1.0
- **Risk-based Color Coding**: Visual indicators (Green: Low, Yellow: Medium, Red: High)
- **Automatic Alert Generation**: High-risk transactions (>0.7) automatically create fraud alerts

#### **🚨 Fraud Alert System**

- **Intelligent Alert Detection**: Automated alerts for suspicious patterns and high-risk transactions
- **Multi-severity Levels**: Critical, High, Medium, Low severity classifications
- **Real-time Notifications**: Instant WebSocket-powered alert notifications
- **Alert Investigation Workflow**: Complete workflow from detection to resolution

#### **🔍 Investigation Management**

- **Case Assignment**: Assign alerts to specific investigators
- **Investigation Timeline**: Track all actions and status changes with timestamps
- **Evidence Management**: Collect and manage digital evidence for cases
- **Status Tracking**: Pending → In Progress → Resolved → Escalated workflow
- **Investigation Notes**: Add detailed findings and comments to cases

#### **📈 Analytics Dashboard**

- **Fraud Metrics**: Transaction volume, fraud detection rates, risk distributions
- **Trend Analysis**: Time-based fraud patterns and detection performance
- **Geographic Analysis**: Location-based fraud patterns and suspicious activities
- **Model Performance**: ML model accuracy and detection statistics

#### **💳 Transaction Management**

- **Comprehensive Transaction View**: Detailed transaction information with metadata
- **Transaction Timeline**: Complete audit trail of all transaction events
- **Risk Assessment Details**: Breakdown of risk factors and ML predictions
- **Location & Device Tracking**: Geographic and device fingerprint analysis
- **Transaction Actions**: Approve, reject, or cancel transactions

#### **⚙️ System Management**

- **User Management**: Create and manage user accounts (Admin only)
- **System Settings**: Configure risk thresholds and alert parameters
- **Audit Logging**: Complete audit trail of all system actions
- **Database Management**: View and manage data through Prisma Studio

### **🏢 User Roles & Capabilities**

| Role                | Capabilities                                                                     |
| ------------------- | -------------------------------------------------------------------------------- |
| **👨‍💼 Admin**        | Full system access, user management, system configuration, all reports           |
| **🔍 Investigator** | Alert investigation, case management, evidence collection, investigation reports |
| **📊 Analyst**      | View analytics, monitor transactions, trend analysis, read-only dashboard access |

## **🏗️ Technical Stack**

### **Frontend Technologies**

```
Framework: Next.js 15 (App Router) with TypeScript
Styling: Tailwind CSS + Radix UI components
State: Zustand for global state management
Charts: Recharts for data visualization
Real-time: WebSocket integration for live updates
Icons: Heroicons for consistent iconography
```

### **Backend & Database**

```
Database: SQLite with Prisma ORM
Authentication: JWT tokens with bcrypt password hashing
API: Next.js API routes with RESTful endpoints
Real-time: WebSocket server for live updates
Validation: Zod schemas for type-safe data validation
```

### **Key Integrations**

```
🔍 Fraud Detection: ML-powered risk scoring algorithms
📊 Analytics: Real-time fraud metrics and trend analysis
🚨 Alert System: Automated alert generation and workflow
💾 Data Management: Comprehensive transaction and user data storage
🔐 Security: Role-based authentication and authorization
```

## **🚀 Getting Started**

### **Prerequisites**

```bash
Node.js >= 18.18.0
npm >= 10.0.0
Git
```

### **Quick Start**

```bash
# 1. Clone the repository
git clone https://github.com/GuardChain-Team/Guardchain-FrontEnd.git
cd Guardchain-FrontEnd

# 2. Install dependencies
npm install

# 3. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
```

### **🌐 Access the Application**

- **Application URL**: `http://localhost:3000`
- **Database Studio**: `http://localhost:5555` (run `npm run db:studio`)

## **👤 Test User Accounts**

The application comes pre-seeded with test accounts for immediate use:

| Role             | Email                         | Password          | Access Level            |
| ---------------- | ----------------------------- | ----------------- | ----------------------- |
| **Admin**        | `admin@guardchain.com`        | `admin123`        | Full system control     |
| **Investigator** | `investigator@guardchain.com` | `investigator123` | Investigation workflows |
| **Analyst**      | `analyst@guardchain.com`      | `analyst123`      | Analytics & monitoring  |

## **📊 Sample Data**

The system includes comprehensive sample data for demonstration:

- **👥 Users**: 3 pre-configured accounts with different roles
- **💳 Transactions**: 50 diverse transactions with varying risk scores (0.1-0.95)
- **🚨 Alerts**: 12 high-risk fraud alerts ready for investigation
- **📍 Locations**: Geographic data from major Indonesian cities
- **🔄 Real-time Data**: Live transaction feeds and alert notifications

## **🎮 How to Use the System**

### **1. Login & Navigation**

```bash
1. Open http://localhost:3000
2. Click "Login" or navigate to /login
3. Use any test account (recommended: admin@guardchain.com / admin123)
4. Navigate through the dashboard using the sidebar menu
```

### **2. Monitor Real-time Transactions**

```bash
📍 Location: /dashboard or /transactions
✨ Features:
   - Live transaction feed with automatic updates
   - Risk-based color coding (🟢 Low, 🟡 Medium, 🔴 High)
   - Click transactions for detailed analysis
   - Real-time WebSocket updates
```

### **3. Investigate Fraud Alerts**

```bash
📍 Location: /alerts
✨ Workflow:
   1. View high-risk alerts (12 pre-loaded)
   2. Click "Investigate" to start investigation
   3. Add investigation notes and evidence
   4. Update status: Pending → In Progress → Resolved
   5. Generate investigation reports
```

### **4. Analyze Fraud Patterns**

```bash
📍 Location: /analytics
✨ Analytics:
   - Transaction volume trends
   - Fraud detection success rates
   - Risk score distributions
   - Geographic fraud patterns
   - Model performance metrics
```

### **5. Manage System Settings**

```bash
📍 Location: /settings (Admin only)
✨ Configuration:
   - User account management
   - Risk scoring thresholds
   - Alert notification settings
   - System audit logs
```

## **🗄️ Database Management**

### **View Database with Prisma Studio**

```bash
# Start Prisma Studio (Database GUI)
npm run db:studio

# Access at: http://localhost:5555
# Browse all tables: User, Transaction, Alert, Investigation, etc.
# View, edit, and manage data directly
```

### **Database Commands**

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Reset database and reseed with sample data
npm run db:reset

# Seed database with sample data
npm run db:seed

# Create new migration
npm run db:migrate
```

### **Database Schema Overview**

```sql
📋 Tables:
├── User (authentication & role management)
├── Transaction (financial transaction records)
├── Alert (fraud alerts & investigations)
├── Investigation (case management)
├── Report (investigation reports)
├── Analytics (fraud metrics & statistics)
├── BlacklistEntry (blacklisted accounts/patterns)
├── AuditLog (system activity tracking)
└── Session (user session management)
```

## **🧪 Testing Real-time Features**

### **Method 1: Demo Script**

```javascript
// Open browser console (F12) and run:
// 1. Load the demo script from demo-script.js
// 2. Execute the demo:

const demo = new GuardchainDemo();
demo.runDemo(); // Runs complete demonstration

// Or test individual features:
demo.createHighRiskTransaction();
demo.createRapidTransactions(5);
demo.getAlerts();
```

### **Method 2: Manual Testing**

```bash
📋 Test Scenarios:
1. 🔄 Real-time Updates:
   - Open dashboard in two browser tabs
   - Create transactions in one tab
   - Watch updates appear in the other tab

2. 🚨 Fraud Alert Generation:
   - Create transaction with amount > $15,000
   - Watch automatic alert generation
   - Test investigation workflow

3. 👥 Multi-user Testing:
   - Login with different roles in separate browsers
   - Test role-based access controls
   - Verify different UI permissions
```

### **Method 3: API Testing**

```javascript
// Create high-risk transaction via browser console
fetch("/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    transactionId: "TXN-TEST-" + Date.now(),
    amount: 75000, // High amount triggers alert
    fromAccount: "ACC-TEST-1",
    toAccount: "ACC-TEST-2",
    type: "transfer",
    metadata: {
      channel: "mobile",
      location: "Jakarta",
      deviceId: "test-device",
    },
  }),
});
```

## **📁 Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   └── layout.tsx           # Auth layout
│   ├── (dashboard)/             # Main application
│   │   ├── alerts/              # 🚨 Fraud alerts & investigations
│   │   ├── analytics/           # 📊 Analytics & reporting
│   │   ├── dashboard/           # 🏠 Main dashboard
│   │   ├── investigator/        # 🔍 Investigation tools
│   │   ├── settings/            # ⚙️ System configuration
│   │   ├── transactions/        # 💳 Transaction monitoring
│   │   └── layout.tsx           # Dashboard layout
│   ├── api/                     # 🔌 API endpoints
│   │   ├── auth/                # Authentication APIs
│   │   ├── transactions/        # Transaction APIs
│   │   ├── fraud/               # Fraud detection APIs
│   │   ├── analytics/           # Analytics APIs
│   │   └── websocket/           # WebSocket server
│   └── globals.css              # Global styles
├── components/                   # 🧩 Reusable components
│   ├── ui/                      # Base UI components (buttons, cards, etc.)
│   ├── layout/                  # Layout components (header, sidebar)
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard widgets
│   ├── fraud/                   # Fraud detection components
│   ├── transactions/            # Transaction components
│   ├── charts/                  # Chart & visualization components
│   └── forms/                   # Form components
├── lib/                         # 🛠️ Utilities & configuration
│   ├── api/                     # API client functions
│   ├── auth/                    # Authentication utilities
│   ├── database/                # Database configuration
│   ├── realtime/                # WebSocket management
│   └── utils/                   # Helper functions
├── stores/                      # 🗃️ State management (Zustand)
├── types/                       # 📝 TypeScript definitions
├── hooks/                       # 🪝 Custom React hooks
└── prisma/                      # 🗄️ Database schema & migrations
    ├── schema.prisma            # Database schema
    └── seed.ts                  # Sample data seeding
```

## **🔌 API Endpoints**

### **Authentication**

```bash
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/logout         # User logout
GET  /api/auth/me            # Get current user info
```

### **Transactions**

```bash
GET  /api/transactions        # List all transactions
POST /api/transactions        # Create new transaction
GET  /api/transactions/[id]   # Get transaction details
PUT  /api/transactions/[id]   # Update transaction
```

### **Fraud Detection**

```bash
GET  /api/fraud/alerts        # List fraud alerts
POST /api/fraud/alerts        # Create new alert
GET  /api/fraud/alerts/[id]   # Get alert details
PUT  /api/fraud/alerts/[id]   # Update alert status

GET  /api/fraud/investigations # List investigations
POST /api/fraud/investigations # Create investigation
PUT  /api/fraud/investigations/[id] # Update investigation
```

### **Analytics**

```bash
GET  /api/analytics           # Dashboard analytics
GET  /api/analytics/overview  # System overview metrics
GET  /api/analytics/trends    # Fraud trend analysis
```

### **Real-time**

```bash
WS   /api/websocket          # WebSocket connection for live updates
```

## **🎯 Key Features Demonstration**

### **1. Real-time Fraud Detection**

```bash
🔄 Live Features:
   ✅ Auto-updating transaction feeds
   ✅ Real-time risk score calculations
   ✅ Instant alert notifications
   ✅ WebSocket-powered live updates
   ✅ Multi-user real-time synchronization
```

### **2. Investigation Workflow**

```bash
🔍 Investigation Process:
   ✅ Alert detection & triage
   ✅ Case assignment to investigators
   ✅ Evidence collection & documentation
   ✅ Timeline tracking with audit trail
   ✅ Status management & resolution
   ✅ Report generation & export
```

### **3. Analytics & Reporting**

```bash
📊 Analytics Features:
   ✅ Fraud detection success rates
   ✅ Transaction volume analysis
   ✅ Risk score distributions
   ✅ Geographic fraud patterns
   ✅ Time-based trend analysis
   ✅ Model performance metrics
```

### **4. Security & Access Control**

```bash
🔐 Security Features:
   ✅ Role-based authentication
   ✅ JWT token security
   ✅ Password encryption (bcrypt)
   ✅ Route protection middleware
   ✅ Audit logging for all actions
   ✅ Session management
```

## **🛠️ Development Commands**

```bash
# 🚀 Development
npm run dev                   # Start development server
npm run build                 # Build for production
npm run start                 # Start production server
npm run lint                  # Run ESLint
npm run type-check           # TypeScript type checking

# 🗄️ Database
npm run db:generate          # Generate Prisma client
npm run db:push              # Push schema to database
npm run db:seed              # Seed with sample data
npm run db:studio            # Open database GUI
npm run db:migrate           # Create new migration
npm run db:reset             # Reset database

# 🧪 Testing
npm run test                 # Run tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
```

## **🔧 Environment Configuration**

Create a `.env.local` file in the root directory:

```bash
# Application
NEXT_PUBLIC_APP_NAME="GuardChain"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-key"

# Development
NODE_ENV="development"
```

## **🚀 Deployment Options**

### **Local Development**

```bash
npm run dev                   # http://localhost:3000
```

### **Production Build**

```bash
npm run build
npm run start                 # Production server
```

### **Docker Deployment**

```bash
docker build -t guardchain-frontend .
docker run -p 3000:3000 guardchain-frontend
```

## **📈 Performance Features**

- **⚡ Next.js 15**: Latest framework with App Router for optimal performance
- **🔄 Real-time Updates**: Efficient WebSocket connections with minimal bandwidth
- **📊 Optimized Charts**: Recharts with performance-optimized rendering
- **💾 Smart Caching**: Intelligent data caching for faster load times
- **📱 Responsive Design**: Mobile-first design with optimal performance
- **🔍 Code Splitting**: Automatic code splitting for faster page loads

## **🎉 Success Indicators**

When everything is working correctly, you should see:

✅ **Server Starts**: Development server runs on `http://localhost:3000`  
✅ **Login Works**: Authentication with test accounts  
✅ **Real-time Updates**: Live transaction feeds and notifications  
✅ **Database Access**: Prisma Studio accessible at `http://localhost:5555`  
✅ **Alerts Generate**: High-risk transactions create automatic alerts  
✅ **Investigation Flow**: Complete investigation workflow functions  
✅ **Analytics Display**: Charts and metrics render correctly  
✅ **Multi-user Support**: Different roles access appropriate features

## **🤝 Support & Contributing**

### **Getting Help**

- **Technical Issues**: Create an issue in this repository
- **Feature Requests**: Submit enhancement proposals
- **Security Issues**: Report via private communication

### **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## **📚 Additional Documentation**

- **[API Documentation](./docs/api.md)**: Detailed API endpoint documentation
- **[Component Guide](./docs/components.md)**: UI component usage guide
- **[Database Schema](./docs/database.md)**: Complete database schema reference
- **[Deployment Guide](./docs/deployment.md)**: Production deployment instructions

---

## **🏆 BI-OJK Hackathon 2025 Submission**

**GuardChain** represents a comprehensive AI-powered fraud detection solution built specifically for Indonesian financial institutions. This application demonstrates advanced real-time fraud monitoring, intelligent investigation workflows, and comprehensive analytics capabilities that can help banks and financial institutions protect against fraud while maintaining operational efficiency.

**Built with ❤️ for Indonesian Financial Security**

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
  children,
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
  updateFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, ...filter },
    })),
}));
```

### **API Integration**

```typescript
// TanStack Query for server state
export const useAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
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
font-family: "Inter", sans-serif; /* Primary */
font-family: "JetBrains Mono", monospace; /* Code/Data */

/* Font Sizes */
text-xs: 0.75rem; /* 12px */
text-sm: 0.875rem; /* 14px */
text-base: 1rem; /* 16px */
text-lg: 1.125rem; /* 18px */
text-xl: 1.25rem; /* 20px */
text-2xl: 1.5rem; /* 24px */
text-3xl: 1.875rem; /* 30px */
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
const NetworkVisualization = lazy(() => import("./NetworkVisualization"));
const AdvancedAnalytics = lazy(() => import("./AdvancedAnalytics"));

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
/>;
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
    formats: ["image/webp", "image/avif"],
  },
  webpack: (config) => {
    config.optimization.splitChunks.chunks = "all";
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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Authentication logic
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // JWT customization
    },
    async session({ session, token }) {
      // Session customization
    },
  },
};
```

### **Route Protection**

```typescript
// Middleware for route protection
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

### **Data Validation**

```typescript
// Zod schemas for validation
const alertSchema = z.object({
  alertType: z.enum(["AMOUNT_ANOMALY", "PATTERN_MATCH", "NETWORK_RISK"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  riskScore: z.number().min(0).max(1),
});

// Form validation
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(alertSchema),
});
```

## **🧪 Testing Strategy**

### **Unit Testing**

```typescript
// Component testing with React Testing Library
import { render, screen } from "@testing-library/react";
import { AlertCard } from "./AlertCard";

describe("AlertCard", () => {
  it("renders alert information correctly", () => {
    const mockAlert = createMockAlert();
    render(<AlertCard alert={mockAlert} onAction={jest.fn()} />);

    expect(screen.getByText(mockAlert.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Risk: ${mockAlert.riskScore}`)
    ).toBeInTheDocument();
  });
});
```

### **Integration Testing**

```typescript
// API integration testing
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/alerts", (req, res, ctx) => {
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
import { test, expect } from "@playwright/test";

test("fraud investigation workflow", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click('[data-testid="alerts-tab"]');
  await page.click('[data-testid="investigate-button"]');

  await expect(
    page.locator('[data-testid="investigation-panel"]')
  ).toBeVisible();
});
```

## **📈 Monitoring & Analytics**

### **Performance Monitoring**

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

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

CARA RUN:
node start-realtime.js

OR

In one terminal: npm run dev (starts Next.js)
In another terminal: npm run server (starts realtime server)
