#!/usr/bin/env pwsh
# AI Council Development Server Startup Script

Write-Host "🚀 Starting AI Council Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Check if backend directory exists
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: backend directory not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Check if frontend directory exists
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: frontend directory not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Check if backend .env exists
if (-not (Test-Path "backend/.env")) {
    Write-Host "⚠️  Warning: backend/.env not found" -ForegroundColor Yellow
    Write-Host "Copying from backend/.env.example..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✅ Created backend/.env - Please update with your credentials" -ForegroundColor Green
}

# Check if frontend .env.local exists
if (-not (Test-Path "frontend/.env.local")) {
    Write-Host "⚠️  Warning: frontend/.env.local not found" -ForegroundColor Yellow
    Write-Host "Copying from frontend/.env.local.example..." -ForegroundColor Yellow
    Copy-Item "frontend/.env.local.example" "frontend/.env.local"
    Write-Host "✅ Created frontend/.env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Starting servers in separate windows..." -ForegroundColor Cyan
Write-Host ""

# Start backend in new PowerShell window
Write-Host "🔧 Starting Backend Server (Port 8000)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Write-Host "⚛️  Starting Frontend Server (Port 3000)..." -ForegroundColor Blue
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host '⚛️  Frontend Server Starting...' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:8000/api/v1/docs" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait 10-15 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop servers: Close the PowerShell windows or press CTRL+C in each" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For detailed instructions, see START_SERVERS.md" -ForegroundColor Cyan
Write-Host ""

# Wait a bit more and then try to open browser
Start-Sleep -Seconds 8
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✨ All set! Happy testing!" -ForegroundColor Green
Write-Host ""
