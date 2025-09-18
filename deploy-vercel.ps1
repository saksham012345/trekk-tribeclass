# Deploy Trek Tribe to Vercel
# Run this script to deploy your project to Vercel

Write-Host "🚀 Deploying Trek Tribe to Vercel..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm run install:all

Write-Host ""
Write-Host "🏗️ Building project..." -ForegroundColor Cyan
npm run build:all

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
Write-Host "Follow the prompts to configure your deployment." -ForegroundColor Yellow
Write-Host ""

# Deploy to Vercel
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Check your Vercel dashboard for the deployment URL." -ForegroundColor Cyan
