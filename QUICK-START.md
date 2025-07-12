# 🎯 Guardchain Quick Start Guide

## 🚀 Step-by-Step Launch Instructions

### Step 1: Prepare the Environment

```powershell
# Navigate to your project directory
cd "C:\Users\carlo\OneDrive\Documents\BI-OJK Hackathon 2025\test2\Guardchain-FrontEnd"

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npm run db:generate

# Ensure database is seeded with test data
npm run db:seed
```

### Step 2: Start the Application

```powershell
# Start the development server
npm run dev
```

**Expected Output:**

```
▲ Next.js 15.3.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 3: Access the Application

1. **Open your browser** and go to: `http://localhost:3000`
2. **You'll see the landing page** with login options

## 🔐 Login & Authentication

### Available Test Accounts

| Role                | Email                         | Password          | Dashboard Access        |
| ------------------- | ----------------------------- | ----------------- | ----------------------- |
| **👨‍💼 Admin**        | `admin@guardchain.com`        | `admin123`        | Full system control     |
| **🔍 Investigator** | `investigator@guardchain.com` | `investigator123` | Investigation workflows |
| **📊 Analyst**      | `analyst@guardchain.com`      | `analyst123`      | Analytics & monitoring  |

### Login Process

1. **Go to Login**: `http://localhost:3000/login`
2. **Enter credentials** (try the Admin account first)
3. **Automatic redirect** to dashboard upon successful login

## 📊 Dashboard Features Tour

### 🏠 Main Dashboard (`/dashboard`)

**What you'll see:**

- **Statistics Cards**: Total transactions, alerts, investigations
- **Real-time Transaction Feed**: Live updates of new transactions
- **Recent Alerts**: Latest fraud alerts requiring attention
- **Quick Actions**: Fast access to common tasks

**Pre-loaded Data:**

- ✅ 50 transactions with varying risk scores
- ✅ 12 high-risk fraud alerts
- ✅ 3 user accounts with different roles
- ✅ Sample investigation records

### 💳 Transactions (`/transactions`)

**Features:**

- **Live Transaction List**: All 50 pre-seeded transactions
- **Risk-based Color Coding**:
  - 🟢 Green: Low risk (0.0 - 0.3)
  - 🟡 Yellow: Medium risk (0.3 - 0.7)
  - 🔴 Red: High risk (0.7 - 1.0)
- **Real-time Updates**: New transactions appear automatically
- **Detailed View**: Click any transaction for full details

**Sample Transaction Data:**

```
TXN-001: $15,000 transfer (Risk: 0.85) 🔴
TXN-002: $2,500 payment (Risk: 0.25) 🟢
TXN-003: $45,000 withdrawal (Risk: 0.92) 🔴
```

### 🚨 Alerts (`/alerts`)

**Pre-loaded Alerts:**

- 12 high-risk transaction alerts
- Various alert types: High Amount, Unusual Pattern, Geographic Anomaly
- Different statuses: Pending, In Progress, Resolved

**Interactive Features:**

- **Click to Investigate**: Start investigation workflow
- **Status Updates**: Change alert status in real-time
- **Notes & Comments**: Add investigation findings

### 🔍 Investigations (`/investigator`)

**Investigation Workflow:**

1. **Select Alert**: Choose from pending alerts
2. **Assign Investigator**: Assign to team member
3. **Add Evidence**: Upload documents, add notes
4. **Update Status**: Track progress (Pending → In Progress → Resolved)
5. **Generate Report**: Create investigation summary

### 📈 Analytics (`/analytics`)

**Available Charts & Metrics:**

- **Transaction Volume**: Daily/weekly trends
- **Fraud Detection Rate**: Success metrics
- **Risk Score Distribution**: Pattern analysis
- **Geographic Fraud Patterns**: Location-based insights
- **Time-based Analysis**: Peak fraud hours

## 🌐 Real-Time Features Demo

### Testing Real-Time Updates

**Method 1: Use the Demo Script**

1. Open browser console (F12)
2. Copy and paste the demo script from `demo-script.js`
3. Run: `guardchainDemo.runDemo()`

**Method 2: Manual Testing**

1. **Open two browser tabs** with the dashboard
2. **Create new transaction** in one tab
3. **Watch real-time update** in the other tab

**Method 3: API Testing**

```javascript
// Create high-risk transaction via console
fetch("/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${your_jwt_token}`,
  },
  body: JSON.stringify({
    transactionId: "TXN-TEST-" + Date.now(),
    amount: 75000, // High amount triggers alert
    fromAccount: "ACC-TEST-1",
    toAccount: "ACC-TEST-2",
    type: "transfer",
  }),
});
```

## 🧪 Testing Scenarios

### Scenario 1: High-Value Transaction Alert

1. **Login as Admin**
2. **Go to Transactions** (`/transactions`)
3. **Create transaction** > $50,000
4. **Watch alert appear** in real-time
5. **Check Alerts page** for new alert

### Scenario 2: Investigation Workflow

1. **Login as Investigator**
2. **Go to Alerts** (`/alerts`)
3. **Click "Investigate"** on any pending alert
4. **Add investigation notes**
5. **Update status** to "In Progress"
6. **Generate report** when complete

### Scenario 3: Analytics Monitoring

1. **Login as Analyst**
2. **Go to Analytics** (`/analytics`)
3. **View current metrics**
4. **Create new transactions** (using demo script)
5. **Watch metrics update** in real-time

### Scenario 4: Multi-User Testing

1. **Open multiple browser windows**
2. **Login with different accounts**:
   - Window 1: Admin
   - Window 2: Investigator
   - Window 3: Analyst
3. **Create transactions as Admin**
4. **Watch updates** in other windows
5. **Test role-based access** differences

## 🔧 Troubleshooting

### Common Issues & Solutions

**Issue**: "Cannot connect to database"

```powershell
# Solution: Regenerate Prisma client
npm run db:generate
npm run db:push
```

**Issue**: "No transactions showing"

```powershell
# Solution: Reseed database
npm run db:seed
```

**Issue**: "Login not working"

- **Check**: Verify you're using correct credentials
- **Reset**: Try `npm run db:reset` to reset database

**Issue**: "Real-time updates not working"

- **Check**: Browser console for WebSocket errors
- **Try**: Refresh page or restart dev server

### Debug Tools

**Prisma Studio** (Database GUI):

```powershell
npm run db:studio
# Opens at http://localhost:5555
```

**Browser Console**:

- Press F12 to open developer tools
- Check Console tab for errors
- Check Network tab for API calls

## 🎉 Success Indicators

✅ **Application Running**: Server starts on port 3000  
✅ **Login Working**: Can authenticate with test accounts  
✅ **Dashboard Loading**: Statistics and data visible  
✅ **Real-time Updates**: New transactions appear automatically  
✅ **Alerts Functional**: High-risk transactions trigger alerts  
✅ **Investigation Workflow**: Can update alert statuses  
✅ **Analytics Working**: Charts and metrics display

## 🚀 Next Steps

1. **Explore the Interface**: Navigate through all sections
2. **Test Real-time Features**: Use the demo script
3. **Try Different Roles**: Login with different accounts
4. **Create Custom Data**: Add your own transactions
5. **Investigate Alerts**: Complete the full workflow

---

🎊 **Your Guardchain fraud detection system is ready for demonstration!**

**Pro Tip**: Keep the browser console open to see real-time WebSocket events and API calls.
