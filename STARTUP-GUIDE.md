# 🚀 GuardChain Startup Scripts

Quick and easy scripts to launch your GuardChain Fraud Detection System for the BI-OJK Hackathon 2025.

## 📁 Available Scripts

### 🎯 Main Startup Scripts

| Script                 | Description                                                    | Usage                    |
| ---------------------- | -------------------------------------------------------------- | ------------------------ |
| `start-guardchain.ps1` | **Complete startup script** - Handles everything automatically | `./start-guardchain.ps1` |
| `start-guardchain.bat` | **Double-click launcher** - Easy Windows execution             | Double-click the file    |
| `database-manager.ps1` | **Database operations** - Interactive database management      | `./database-manager.ps1` |

## 🚀 Quick Start Options

### Option 1: PowerShell Script (Recommended)

```powershell
# Open PowerShell in the project directory
./start-guardchain.ps1
```

### Option 2: Batch File (Easiest)

```bash
# Simply double-click: start-guardchain.bat
# or run in Command Prompt:
start-guardchain.bat
```

### Option 3: Manual Commands

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## 🗄️ Database Management

Use the interactive database manager:

```powershell
./database-manager.ps1
```

**Available operations:**

- 🚀 **Setup Database** - Complete database initialization
- 🔄 **Reset Database** - Clean reset with fresh data
- 📊 **Prisma Studio** - Visual database browser at `http://localhost:5555`
- 🌱 **Seed Data** - Load sample transactions and users
- 🔧 **Generate Client** - Update Prisma client
- 📤 **Push Schema** - Apply schema changes

## 🎯 What the Startup Script Does

### ✅ Automated Steps:

1. **Prerequisites Check**

   - ✅ Verifies Node.js installation
   - ✅ Verifies npm availability
   - ✅ Shows versions

2. **Dependencies**

   - ✅ Runs `npm install`
   - ✅ Installs all required packages

3. **Database Setup**

   - ✅ Generates Prisma client
   - ✅ Pushes schema to SQLite database
   - ✅ Seeds with sample data (50 transactions, 12 alerts, 3 users)

4. **Environment Setup**

   - ✅ Creates `.env.local` if missing
   - ✅ Sets up authentication secrets
   - ✅ Configures database connection

5. **Port Management**

   - ✅ Checks if port 3000 is available
   - ✅ Finds alternative port if needed
   - ✅ Shows access URLs

6. **Application Launch**
   - ✅ Starts Next.js development server
   - ✅ Displays login credentials
   - ✅ Shows access information

## 📍 Access Information

After successful startup, access your application at:

| Service              | URL                               | Description                                       |
| -------------------- | --------------------------------- | ------------------------------------------------- |
| **Main Application** | `http://localhost:3000`           | GuardChain fraud detection system                 |
| **Login Page**       | `http://localhost:3000/login`     | User authentication                               |
| **Dashboard**        | `http://localhost:3000/dashboard` | Main fraud monitoring dashboard                   |
| **Database Studio**  | `http://localhost:5555`           | Visual database browser (run `npm run db:studio`) |

## 👤 Test Accounts

The system comes pre-configured with test accounts:

| Role                | Email                         | Password          | Access Level            |
| ------------------- | ----------------------------- | ----------------- | ----------------------- |
| **👨‍💼 Admin**        | `admin@guardchain.com`        | `admin123`        | Full system control     |
| **🔍 Investigator** | `investigator@guardchain.com` | `investigator123` | Investigation workflows |
| **📊 Analyst**      | `analyst@guardchain.com`      | `analyst123`      | Analytics & monitoring  |

## 🛠️ Troubleshooting

### Common Issues & Solutions

**Issue**: "Execution Policy Error"

```powershell
# Solution: Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Issue**: "Port 3000 already in use"

```bash
# The script automatically finds an alternative port (3001-3010)
# Or manually kill the process:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Issue**: "Database connection error"

```bash
# Reset the database:
./database-manager.ps1
# Choose option 2 (Reset Database)
```

**Issue**: "npm command not found"

```bash
# Install Node.js from: https://nodejs.org
# Restart your terminal after installation
```

## 🔧 Advanced Usage

### Custom Port

```powershell
$env:PORT = "3001"
./start-guardchain.ps1
```

### Development Mode

```bash
# The scripts automatically start in development mode
# For production build:
npm run build
npm run start
```

### Database Operations

```bash
# Individual database commands:
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:seed        # Seed sample data
npm run db:studio      # Open database GUI
npm run db:reset       # Reset and reseed database
```

## 📊 What You Get

After running the startup script, your system includes:

### 📋 **Sample Data**

- **👥 Users**: 3 accounts (Admin, Investigator, Analyst)
- **💳 Transactions**: 50 diverse transactions with risk scores (0.1-0.95)
- **🚨 Alerts**: 12 high-risk fraud alerts ready for investigation
- **📍 Locations**: Geographic data from major Indonesian cities
- **🔄 Real-time**: Live transaction feeds and notifications

### 🎯 **Features Ready for Demo**

- ✅ **Real-time fraud monitoring**
- ✅ **Investigation workflow**
- ✅ **Analytics dashboard**
- ✅ **Role-based access control**
- ✅ **WebSocket live updates**
- ✅ **Complete API backend**

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ **Server Running**: Development server starts successfully  
✅ **Database Connected**: Sample data loaded  
✅ **Login Working**: Can authenticate with test accounts  
✅ **Real-time Active**: Live updates in dashboard  
✅ **Alerts Visible**: 12 fraud alerts displayed  
✅ **Navigation Working**: All pages accessible

## 📞 Support

If you encounter any issues:

1. **Check the console output** for error messages
2. **Try the database manager** to reset data
3. **Restart the script** after fixing issues
4. **Check Node.js version** (requires 18+)

---

🎊 **Your GuardChain fraud detection system is ready for the BI-OJK Hackathon 2025!**

**Built with ❤️ for Indonesian Financial Security**
