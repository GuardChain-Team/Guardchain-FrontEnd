# GuardChain Database Manager
# Quick database operations and Prisma Studio launcher

Write-Host "🗄️ GuardChain Database Manager" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "Select an option:" -ForegroundColor Yellow
    Write-Host "1. 🚀 Setup Database (Generate + Push + Seed)" -ForegroundColor White
    Write-Host "2. 🔄 Reset Database (Reset + Seed)" -ForegroundColor White
    Write-Host "3. 📊 Open Prisma Studio (Database GUI)" -ForegroundColor White
    Write-Host "4. 🌱 Seed Sample Data Only" -ForegroundColor White
    Write-Host "5. 🔧 Generate Prisma Client Only" -ForegroundColor White
    Write-Host "6. 📤 Push Schema to Database" -ForegroundColor White
    Write-Host "7. ❌ Exit" -ForegroundColor White
    Write-Host ""
}

do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-7)"
    
    switch ($choice) {
        "1" {
            Write-Host "🚀 Setting up database..." -ForegroundColor Green
            npm run db:generate
            npm run db:push
            npm run db:seed
            Write-Host "✅ Database setup complete!" -ForegroundColor Green
        }
        "2" {
            Write-Host "🔄 Resetting database..." -ForegroundColor Yellow
            npm run db:reset
            Write-Host "✅ Database reset complete!" -ForegroundColor Green
        }
        "3" {
            Write-Host "📊 Opening Prisma Studio..." -ForegroundColor Cyan
            Write-Host "   Access at: http://localhost:5555" -ForegroundColor White
            npm run db:studio
        }
        "4" {
            Write-Host "🌱 Seeding sample data..." -ForegroundColor Green
            npm run db:seed
            Write-Host "✅ Sample data seeded!" -ForegroundColor Green
        }
        "5" {
            Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
            npm run db:generate
            Write-Host "✅ Prisma client generated!" -ForegroundColor Green
        }
        "6" {
            Write-Host "📤 Pushing schema to database..." -ForegroundColor Cyan
            npm run db:push
            Write-Host "✅ Schema pushed to database!" -ForegroundColor Green
        }
        "7" {
            Write-Host "👋 Goodbye!" -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "❌ Invalid choice. Please select 1-7." -ForegroundColor Red
        }
    }
    
    if ($choice -ne "7") {
        Write-Host ""
        Read-Host "Press Enter to continue..."
        Clear-Host
    }
} while ($choice -ne "7")
