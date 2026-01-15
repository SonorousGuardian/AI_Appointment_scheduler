Write-Host "🔄 Restarting server to load fixed code..." -ForegroundColor Cyan

# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*server*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Start the server in a new window
Write-Host "Starting server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test the specific case
Write-Host "`n🧪 Testing: 'Book a cardiologist at 3pm on friday at 3/2/13'" -ForegroundColor Cyan
Start-Sleep -Seconds 2
node test-specific-case.js
