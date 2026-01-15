# AI Appointment Scheduler - One-Click Installation Script (Windows)
# Run this in PowerShell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "AI Appointment Scheduler Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
cd server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Build backend
Write-Host "🔨 Building backend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend built successfully" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
cd ..\client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

cd ..

Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend (Terminal 1):" -ForegroundColor Cyan
Write-Host "  cd server"
Write-Host "  npm start"
Write-Host ""
Write-Host "Frontend (Terminal 2):" -ForegroundColor Cyan
Write-Host "  cd client"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Green
