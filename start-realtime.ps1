# GuardChain Real-time Data Generator PowerShell Script

Write-Host "[ROCKET] Starting GuardChain Real-time Data Generation..." -ForegroundColor Green
Write-Host ""

# Check if Next.js is running
$nextjsRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $nextjsRunning = $true
    }
} catch {
    Write-Host "[ERROR] Next.js server is not running on http://localhost:3000" -ForegroundColor Red
    Write-Host "Please start the Next.js server first with: npm run dev" -ForegroundColor Yellow
    exit 1
}

if ($nextjsRunning) {
    Write-Host "[SUCCESS] Next.js server detected on http://localhost:3000" -ForegroundColor Green
    
    # Initialize real-time data generation
    Write-Host "[INIT] Initializing real-time data generation..." -ForegroundColor Cyan
    
    try {
        $initResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/websocket" -Method GET
        Write-Host "[SUCCESS] Real-time services initialized successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[INFO] Real-time Features Active:" -ForegroundColor Yellow
        Write-Host "   * Automatic transaction generation every 3-8 seconds" -ForegroundColor White
        Write-Host "   * Real-time risk scoring and fraud detection" -ForegroundColor White
        Write-Host "   * Automatic alert creation for high-risk transactions" -ForegroundColor White
        Write-Host "   * Live analytics updates" -ForegroundColor White
        Write-Host ""
        Write-Host "[WEB] Access your GuardChain application at:" -ForegroundColor Green
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "   Dashboard: http://localhost:3000/dashboard" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "[DATA] The application is now generating realistic transaction data" -ForegroundColor Yellow
        Write-Host "       and broadcasting real-time updates!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press Ctrl+C to stop monitoring..." -ForegroundColor Gray
        
        # Monitor the application
        $transactionCount = 0
        while ($true) {
            Start-Sleep -Seconds 10
            try {
                $statusResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/websocket" -Method POST -Body '{"action":"status"}' -ContentType "application/json"
                if ($statusResponse.generating) {
                    $transactionCount++
                    Write-Host "[MONITOR] Real-time generation active - Check count: $transactionCount" -ForegroundColor Green
                } else {
                    Write-Host "[WARNING] Real-time generation may have stopped" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "[ERROR] Error checking status" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-Host "[ERROR] Failed to initialize real-time services" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "[READY] GuardChain Real-time System Ready!" -ForegroundColor Green
