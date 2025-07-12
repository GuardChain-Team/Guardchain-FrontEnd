# 🚀 Guardchain Usage Guide

## 📋 Prerequisites

Before running the application, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ All dependencies installed (`npm install`)
- ✅ Database setup and seeded

## 🏃‍♂️ How to Run

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 2. Alternative Development Commands

```bash
# Run with Turbopack (faster builds)
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm run start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Prisma Studio
```

## 👤 User Authentication

### Default User Accounts

Your database is pre-seeded with 3 user accounts:

| Role             | Email                         | Password          | Access Level                         |
| ---------------- | ----------------------------- | ----------------- | ------------------------------------ |
| **Admin**        | `admin@guardchain.com`        | `admin123`        | Full system access                   |
| **Investigator** | `investigator@guardchain.com` | `investigator123` | Investigate alerts, create reports   |
| **Analyst**      | `analyst@guardchain.com`      | `analyst123`      | View analytics, monitor transactions |

### Login Process

1. **Navigate to Login**: Go to `http://localhost:3000/login`
2. **Enter Credentials**: Use one of the accounts above
3. **Dashboard Access**: Redirected to role-specific dashboard

```javascript
// Example login API call
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@guardchain.com",
    password: "admin123",
  }),
});
```

## 🎯 Key Features & Usage

### 🔍 1. Real-Time Transaction Monitoring

**Location**: `/dashboard` or `/transactions`

**Features**:

- Live transaction feed with real-time updates
- Automatic fraud detection scoring
- Risk-based color coding (Green: Low, Yellow: Medium, Red: High)
- Real-time WebSocket updates

**Sample Data Available**:

- 50 pre-seeded transactions
- Risk scores from 0.1 to 0.95
- Various transaction types (transfer, payment, withdrawal)
- Metadata includes location, channel, device info

### 🚨 2. Fraud Alert System

**Location**: `/alerts`

**Features**:

- 12 pre-seeded high-risk alerts
- Real-time alert notifications
- Risk scoring and categorization
- Alert investigation workflow

**Alert Types**:

- High-value transactions (>$10,000)
- Unusual patterns detected
- Suspicious account behavior
- Geographic anomalies

### 🔎 3. Investigation Workflow

**Location**: `/investigator`

**Features**:

- Assign alerts to investigators
- Track investigation status
- Add investigation notes
- Generate investigation reports
- Evidence collection

**Investigation Statuses**:

- 🟡 Pending
- 🔵 In Progress
- 🟢 Resolved
- 🔴 Escalated

### 📊 4. Analytics Dashboard

**Location**: `/analytics`

**Features**:

- Transaction volume trends
- Fraud detection rates
- Risk score distributions
- Geographic fraud patterns
- Time-based analysis

**Available Charts**:

- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Heat maps for geographic data

### ⚙️ 5. System Settings

**Location**: `/settings`

**Features**:

- Risk scoring thresholds
- Alert notification settings
- User management (Admin only)
- System configuration
- Audit log viewing

## 🌐 Real-Time Features

### WebSocket Connection

The application uses WebSockets for real-time updates:

```javascript
// WebSocket endpoint
//localhost:3000/api/websocket

// Real-time events
ws: -new_transaction - new_alert - alert_updated - investigation_status_changed;
```

### Live Data Updates

**What Updates in Real-Time**:

- New transactions appearing in feeds
- Alert notifications
- Investigation status changes
- Risk score updates
- Dashboard statistics

## 🧪 Testing the System

### 1. Create New Transactions

**API Endpoint**: `POST /api/transactions`

```javascript
// Create a new transaction
const newTransaction = {
  transactionId: "TXN-" + Date.now(),
  amount: 25000,
  fromAccount: "ACC-123",
  toAccount: "ACC-456",
  type: "transfer",
  metadata: {
    channel: "mobile",
    location: "Jakarta",
    deviceId: "device-789",
  },
};

fetch("/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${your_jwt_token}`,
  },
  body: JSON.stringify(newTransaction),
});
```

### 2. Trigger Fraud Alerts

**High-Risk Transaction Criteria**:

- Amount > $15,000
- Unusual geographic patterns
- Off-hours transactions
- Multiple rapid transactions

### 3. Test Investigation Workflow

1. **View Alerts**: Go to `/alerts`
2. **Select Alert**: Click on high-risk alert
3. **Start Investigation**: Click "Investigate"
4. **Add Notes**: Document findings
5. **Update Status**: Change from Pending → In Progress → Resolved

## 📱 User Interface Guide

### Navigation Structure

```
🏠 Dashboard
├── 📊 Analytics
├── 🚨 Alerts
├── 💳 Transactions
├── 🔍 Investigations
└── ⚙️ Settings
```

### Role-Based Access

**Admin Users**:

- Full system access
- User management
- System configuration
- All reports and analytics

**Investigators**:

- Alert investigation
- Report generation
- Transaction analysis
- Investigation management

**Analysts**:

- View-only access to analytics
- Transaction monitoring
- Trend analysis
- Dashboard viewing

## 🔧 Development & Debugging

### Database Inspection

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

**Available at**: `http://localhost:5555`

### API Testing

**Authentication Required**: Most endpoints require JWT token

```javascript
// Get JWT token after login
const { token } = await response.json()

// Use in subsequent requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Key API Endpoints

| Endpoint             | Method   | Purpose                |
| -------------------- | -------- | ---------------------- |
| `/api/auth/login`    | POST     | User authentication    |
| `/api/auth/register` | POST     | Create new user        |
| `/api/transactions`  | GET/POST | Transaction management |
| `/api/fraud/alerts`  | GET      | Fraud alerts           |
| `/api/analytics/*`   | GET      | Analytics data         |
| `/api/websocket`     | WS       | Real-time updates      |

## 🚀 Next Steps

1. **Start the server**: `npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Login**: Use admin@guardchain.com / admin123
4. **Explore**: Navigate through different sections
5. **Test features**: Create transactions, investigate alerts
6. **Monitor real-time**: Watch live updates

## 💡 Tips for Best Experience

- **Use Chrome/Firefox** for best WebSocket support
- **Keep browser console open** to see real-time events
- **Try different user roles** to see access differences
- **Create high-value transactions** to trigger alerts
- **Use Prisma Studio** to see database changes in real-time

---

🎉 **Your Guardchain fraud detection system is ready to use!**

For any issues, check the browser console and terminal output for debugging information.
