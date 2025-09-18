# Prepare Trek Tribe for Render Deployment
# This script helps you prepare for Render deployment

Write-Host "🚀 Preparing Trek Tribe for Render + Vercel Deployment..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Environment Variables:" -ForegroundColor Yellow
Write-Host "   JWT_SECRET: 01746CD09C1EE37BA7BDC2EFC9EF445E" -ForegroundColor White
Write-Host "   SESSION_SECRET: 04280DAC546C0A188E96ED4C450801B8" -ForegroundColor White
Write-Host ""

Write-Host "🗄️ MongoDB Atlas Setup Required:" -ForegroundColor Yellow
Write-Host "   1. Create free cluster at mongodb.com/atlas" -ForegroundColor White
Write-Host "   2. Create database user with username/password" -ForegroundColor White
Write-Host "   3. Set network access to 0.0.0.0/0 (Allow from anywhere)" -ForegroundColor White
Write-Host "   4. Get connection string for MONGODB_URI" -ForegroundColor White
Write-Host ""

Write-Host "🖥️ Render Backend Deployment:" -ForegroundColor Yellow
Write-Host "   1. Go to render.com and sign up" -ForegroundColor White
Write-Host "   2. Create Web Service" -ForegroundColor White
Write-Host "   3. Connect GitHub: https://github.com/saksham012345/trekk-tribeclass" -ForegroundColor White
Write-Host "   4. Set Root Directory: services/api" -ForegroundColor White
Write-Host "   5. Add environment variables (see ENV_VARIABLES_GUIDE.md)" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Vercel Frontend Deployment:" -ForegroundColor Yellow
Write-Host "   1. Go to vercel.com and sign up" -ForegroundColor White
Write-Host "   2. Import GitHub project" -ForegroundColor White
Write-Host "   3. Set Root Directory: web" -ForegroundColor White
Write-Host "   4. Add REACT_APP_API_URL with your Render service URL" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation Available:" -ForegroundColor Cyan
Write-Host "   📖 ENV_VARIABLES_GUIDE.md - All environment variables" -ForegroundColor White
Write-Host "   📖 RENDER_DEPLOYMENT_GUIDE.md - Complete deployment guide" -ForegroundColor White
Write-Host "   📖 VERCEL_DEPLOYMENT_GUIDE.md - Vercel-only deployment" -ForegroundColor White
Write-Host ""

Write-Host "🧪 Testing locally before deployment..." -ForegroundColor Cyan

# Test if dependencies are installed
try {
    if (Test-Path "services/api/node_modules") {
        Write-Host "✅ API dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ API dependencies missing. Running npm install..." -ForegroundColor Yellow
        cd services/api
        npm install
        cd ../..
        Write-Host "✅ API dependencies installed" -ForegroundColor Green
    }
    
    if (Test-Path "web/node_modules") {
        Write-Host "✅ Web dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Web dependencies missing. Running npm install..." -ForegroundColor Yellow
        cd web
        npm install
        cd ..
        Write-Host "✅ Web dependencies installed" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Could not check dependencies. Make sure Node.js is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏗️ Testing builds..." -ForegroundColor Cyan

# Test API build
try {
    cd services/api
    npm run build
    Write-Host "✅ API builds successfully" -ForegroundColor Green
    cd ../..
} catch {
    Write-Host "❌ API build failed. Check for errors above." -ForegroundColor Red
    cd ../..
}

# Test Web build  
try {
    cd web
    npm run build
    Write-Host "✅ Web builds successfully" -ForegroundColor Green
    cd ..
} catch {
    Write-Host "❌ Web build failed. Check for errors above." -ForegroundColor Red
    cd ..
}

Write-Host ""
Write-Host "🎯 Your project is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up MongoDB Atlas (if not done)" -ForegroundColor White
Write-Host "2. Deploy backend to Render with provided environment variables" -ForegroundColor White
Write-Host "3. Deploy frontend to Vercel with Render API URL" -ForegroundColor White
Write-Host "4. Update FRONTEND_URL in Render with Vercel URL" -ForegroundColor White
Write-Host "5. Test your deployed application" -ForegroundColor White
Write-Host ""
Write-Host "📖 Detailed instructions in RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
