Write-Host "`n🔄 Restarting Server with Fixed Code`n" -ForegroundColor Cyan

# Find and kill the old server process
Write-Host "Stopping old server..." -ForegroundColor Yellow
$serverProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -and $_.CommandLine -like "*server*start*"
}

if ($serverProcess) {
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host "✅ Old server stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
}
else {
    Write-Host "⚠️  No running server found" -ForegroundColor Yellow
}

# Start new server
Write-Host "`nStarting server with FIXED code..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🚀 Server Starting...' -ForegroundColor Green; npm start"

# Wait for server to start
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test both cases
Write-Host "`n📋 Testing both cases:`n" -ForegroundColor Cyan
node compare-tests.js

Write-Host "`n✅ Server restart complete!" -ForegroundColor Green
