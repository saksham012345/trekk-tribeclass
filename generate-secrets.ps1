# Generate Secure Secrets for Trek Tribe Deployment
# Run this script in PowerShell to generate secure random secrets

Write-Host "🔐 Generating secure secrets for Trek Tribe deployment..." -ForegroundColor Green
Write-Host ""

# Generate JWT Secret
$jwtSecret = -join ((1..64) | ForEach {'{0:X}' -f (Get-Random -Max 16)})
Write-Host "JWT_SECRET:" -ForegroundColor Yellow
Write-Host $jwtSecret -ForegroundColor White
Write-Host ""

# Generate Session Secret  
$sessionSecret = -join ((1..64) | ForEach {'{0:X}' -f (Get-Random -Max 16)})
Write-Host "SESSION_SECRET:" -ForegroundColor Yellow
Write-Host $sessionSecret -ForegroundColor White
Write-Host ""

Write-Host "✅ Secrets generated successfully!" -ForegroundColor Green
Write-Host "Copy these values to your Render environment variables." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Keep these secrets secure and never commit them to version control!" -ForegroundColor Red
