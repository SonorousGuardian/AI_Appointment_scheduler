Write-Host "🔄 Restarting server with updated code..." -ForegroundColor Cyan

# Kill any existing node processes running the server
Write-Host "Stopping existing server processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*server*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Start the server in a new window
Write-Host "Starting server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
    
    # Run tests
    Write-Host "`n🧪 Running tests..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    node test-appointments.js
}
catch {
    Write-Host "❌ Server is not responding. Please start it manually with 'npm start'" -ForegroundColor Red
}
