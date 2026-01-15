# This script helps restart the server to pick up code changes
# Please manually stop the current server (Ctrl+C in the terminal where it's running)
# Then run: npm start

Write-Host "NOTE: Please restart the server to pick up the code changes" -ForegroundColor Yellow
Write-Host "1. Stop the current server (Ctrl+C in the server terminal)" -ForegroundColor Cyan
Write-Host "2. Run: npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting 5 seconds for you to restart the server..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Running tests..." -ForegroundColor Green
node test-appointments.js
