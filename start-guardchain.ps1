# GuardChain Startup Script
# Comprehensive setup and launch for BI-OJK Hackathon 2025

Write-Host "🚀 GuardChain Fraud Detection System - Startup Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to check if port is in use
function Test-Port($port) {
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "🔍 Checking Prerequisites..." -ForegroundColor Yellow

if (!(Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

if (!(Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm" -ForegroundColor Red
    exit 1
}

# Get Node version
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Get npm version
$npmVersion = npm --version
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

Write-Host ""

# Step 1: Install Dependencies
Write-Host "📦 Step 1: Installing Dependencies..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        throw "npm install failed"
    }
} catch {
    Write-Host "❌ Failed to install dependencies: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Setup Database
Write-Host "🗄️ Step 2: Setting up Database..." -ForegroundColor Yellow

Write-Host "   - Generating Prisma client..." -ForegroundColor Cyan
try {
    npm run db:generate
    Write-Host "   ✅ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host "   - Pushing database schema..." -ForegroundColor Cyan
try {
    npm run db:push
    Write-Host "   ✅ Database schema updated" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to push database schema" -ForegroundColor Red
    exit 1
}

Write-Host "   - Seeding database with sample data..." -ForegroundColor Cyan
try {
    npm run db:seed
    Write-Host "   ✅ Database seeded with sample data" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Check if port 3000 is available
Write-Host "🌐 Step 3: Checking Port Availability..." -ForegroundColor Yellow

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Attempting to find available port..." -ForegroundColor Yellow
    
    # Try ports 3001-3010
    $availablePort = $null
    for ($port = 3001; $port -le 3010; $port++) {
        if (!(Test-Port $port)) {
            $availablePort = $port
            break
        }
    }
    
    if ($availablePort) {
        Write-Host "✅ Using port $availablePort instead" -ForegroundColor Green
        $env:PORT = $availablePort
    } else {
        Write-Host "❌ No available ports found. Please stop the process using port 3000" -ForegroundColor Red
        Write-Host "   Run: netstat -ano | findstr :3000" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Port 3000 is available" -ForegroundColor Green
}

Write-Host ""

# Step 4: Create .env.local if it doesn't exist
Write-Host "⚙️ Step 4: Setting up Environment..." -ForegroundColor Yellow

if (!(Test-Path ".env.local")) {
    Write-Host "   - Creating .env.local file..." -ForegroundColor Cyan
    $envContent = @"
# GuardChain Environment Configuration
NEXT_PUBLIC_APP_NAME="GuardChain"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="guardchain-hackathon-2025-secret-key"
JWT_SECRET="guardchain-jwt-secret-2025"

# Development
NODE_ENV="development"
"@
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "   ✅ .env.local created" -ForegroundColor Green
} else {
    Write-Host "   ✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""

# Step 5: Display Test Accounts
Write-Host "👤 Step 5: Test User Accounts Ready" -ForegroundColor Yellow
Write-Host "   ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "   │                   TEST ACCOUNTS                         │" -ForegroundColor Cyan
Write-Host "   ├─────────────────────────────────────────────────────────┤" -ForegroundColor Cyan
Write-Host "   │ 👨‍💼 Admin:        admin@guardchain.com / admin123        │" -ForegroundColor Cyan
Write-Host "   │ 🔍 Investigator:  investigator@guardchain.com / investigator123 │" -ForegroundColor Cyan
Write-Host "   │ 📊 Analyst:       analyst@guardchain.com / analyst123   │" -ForegroundColor Cyan
Write-Host "   └─────────────────────────────────────────────────────────┘" -ForegroundColor Cyan

Write-Host ""

# Step 6: Start the application
Write-Host "🚀 Step 6: Starting GuardChain Application..." -ForegroundColor Yellow

Write-Host "   - Starting development server..." -ForegroundColor Cyan
Write-Host ""

# Display success information
$port = if ($env:PORT) { $env:PORT } else { "3000" }
Write-Host "🎉 GuardChain is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access URLs:" -ForegroundColor Cyan
Write-Host "   🌐 Application:     http://localhost:$port" -ForegroundColor White
Write-Host "   🔐 Login Page:      http://localhost:$port/login" -ForegroundColor White
Write-Host "   📊 Dashboard:       http://localhost:$port/dashboard" -ForegroundColor White
Write-Host "   🗄️ Database Studio: http://localhost:5555 (run 'npm run db:studio' in new terminal)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready for BI-OJK Hackathon 2025 Demo!" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
