# 🚀 Complete Render Deployment Script for Trek Tribe
# This script prepares and guides you through deploying to Render

param(
    [switch]$Test,
    [switch]$Deploy
)

Write-Host "🚀 Trek Tribe - Render Deployment Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Function to display status with colors
function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "INFO",
        [switch]$NoNewLine
    )
    
    switch ($Status) {
        "SUCCESS" { 
            if ($NoNewLine) {
                Write-Host "✅ $Message" -ForegroundColor Green -NoNewline
            } else {
                Write-Host "✅ $Message" -ForegroundColor Green
            }
        }
        "ERROR" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "⚠️ $Message" -ForegroundColor Yellow }
        "INFO" { Write-Host "ℹ️ $Message" -ForegroundColor Cyan }
        default { Write-Host "$Message" -ForegroundColor White }
    }
}

# Check prerequisites
Write-Host "🔍 Checking Prerequisites..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Status "Node.js version: $nodeVersion" "SUCCESS"
} catch {
    Write-Status "Node.js not found. Please install Node.js first." "ERROR"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Status "npm version: $npmVersion" "SUCCESS"
} catch {
    Write-Status "npm not found. Please install npm first." "ERROR"
    exit 1
}

Write-Host ""

# Test MongoDB connection
Write-Host "🗄️ Testing MongoDB Atlas Connection..." -ForegroundColor Cyan
Write-Host ""

$mongoTestScript = @"
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Atlas connection successful');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Atlas connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
"@

# Create temporary test file
$mongoTestScript | Out-File -FilePath "temp-mongo-test.js" -Encoding UTF8

try {
    Set-Location "services\api"
    node "..\..\temp-mongo-test.js"
    Write-Status "MongoDB Atlas connection verified" "SUCCESS"
    Set-Location "..\\.."
} catch {
    Write-Status "MongoDB Atlas connection failed" "ERROR"
    Set-Location "..\\.."
    Remove-Item "temp-mongo-test.js" -ErrorAction SilentlyContinue
    Write-Host ""
    Write-Host "💡 Please check your MongoDB Atlas configuration:" -ForegroundColor Yellow
    Write-Host "   • Verify your connection string is correct" -ForegroundColor White
    Write-Host "   • Ensure your IP is whitelisted (0.0.0.0/0)" -ForegroundColor White
    Write-Host "   • Check your MongoDB Atlas username and password" -ForegroundColor White
    exit 1
}

# Clean up temp file
Remove-Item "temp-mongo-test.js" -ErrorAction SilentlyContinue

Write-Host ""

# Check project structure
Write-Host "📁 Verifying Project Structure..." -ForegroundColor Cyan

$requiredFiles = @(
    "services\api\package.json",
    "services\api\src\index.ts",
    "services\api\.env",
    "web\package.json",
    "web\src\App.tsx",
    "web\.env"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Status $file "SUCCESS"
    } else {
        Write-Status "$file - Missing" "ERROR"
    }
}

Write-Host ""

# Check dependencies
Write-Host "📦 Checking Dependencies..." -ForegroundColor Cyan

if (Test-Path "services\api\node_modules") {
    Write-Status "API dependencies installed" "SUCCESS"
} else {
    Write-Status "Installing API dependencies..." "INFO"
    try {
        Set-Location "services\api"
        npm install
        Set-Location "..\\.."
        Write-Status "API dependencies installed" "SUCCESS"
    } catch {
        Write-Status "Failed to install API dependencies" "ERROR"
        Set-Location "..\\.."
        exit 1
    }
}

if (Test-Path "web\node_modules") {
    Write-Status "Web dependencies installed" "SUCCESS"
} else {
    Write-Status "Installing Web dependencies..." "INFO"
    try {
        Set-Location "web"
        npm install
        Set-Location ".."
        Write-Status "Web dependencies installed" "SUCCESS"
    } catch {
        Write-Status "Failed to install Web dependencies" "ERROR"
        Set-Location ".."
        exit 1
    }
}

Write-Host ""

# Test builds
if ($Test) {
    Write-Host "🏗️ Testing Builds..." -ForegroundColor Cyan
    
    # Test API build
    Write-Status "Building API..." "INFO"
    try {
        Set-Location "services\api"
        npm run build | Out-Host
        Set-Location "..\\.."
        Write-Status "API build successful" "SUCCESS"
    } catch {
        Set-Location "..\\.."
        Write-Status "API build failed" "ERROR"
        exit 1
    }
    
    # Test Web build
    Write-Status "Building Web..." "INFO"
    try {
        Set-Location "web"
        npm run build | Out-Host
        Set-Location ".."
        Write-Status "Web build successful" "SUCCESS"
    } catch {
        Set-Location ".."
        Write-Status "Web build failed" "ERROR"
        exit 1
    }
    
    Write-Host ""
}

# Display deployment information
Write-Host "🚀 Deployment Information" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

Write-Host "🔑 Your Environment Variables (Ready to Copy):" -ForegroundColor Yellow
Write-Host ""
Write-Host "For Render Backend:" -ForegroundColor Cyan
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "PORT=10000" -ForegroundColor White
Write-Host "MONGODB_URI=mongodb+srv://saksham:Saksham%404700@class.gvvpl45.mongodb.net/trek-tribe?retryWrites=true&w=majority&appName=class" -ForegroundColor White
Write-Host "JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E" -ForegroundColor White
Write-Host "SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8" -ForegroundColor White
Write-Host "FRONTEND_URL=https://your-vercel-app.vercel.app" -ForegroundColor White
Write-Host ""

Write-Host "For Vercel Frontend:" -ForegroundColor Cyan
Write-Host "REACT_APP_API_URL=https://your-render-service.onrender.com" -ForegroundColor White
Write-Host ""

if ($Deploy) {
    Write-Host "🌐 Opening Deployment Websites..." -ForegroundColor Cyan
    
    # Open Render
    Write-Status "Opening Render..." "INFO"
    Start-Process "https://render.com"
    Start-Sleep -Seconds 2
    
    # Open Vercel
    Write-Status "Opening Vercel..." "INFO"
    Start-Process "https://vercel.com"
    Start-Sleep -Seconds 2
    
    Write-Host ""
}

Write-Host "📋 Deployment Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "RENDER BACKEND:" -ForegroundColor Cyan
Write-Host "1. Go to render.com → Sign up with GitHub" -ForegroundColor White
Write-Host "2. New + → Web Service → Connect GitHub repo" -ForegroundColor White
Write-Host "3. Repository: saksham012345/trekk-tribeclass" -ForegroundColor White
Write-Host "4. Root Directory: services/api" -ForegroundColor White
Write-Host "5. Build Command: npm install && npm run build" -ForegroundColor White
Write-Host "6. Start Command: npm start" -ForegroundColor White
Write-Host "7. Add environment variables above" -ForegroundColor White
Write-Host ""

Write-Host "VERCEL FRONTEND:" -ForegroundColor Cyan
Write-Host "1. Go to vercel.com → Sign up with GitHub" -ForegroundColor White
Write-Host "2. New Project → Import GitHub repo" -ForegroundColor White
Write-Host "3. Repository: saksham012345/trekk-tribeclass" -ForegroundColor White
Write-Host "4. Root Directory: web" -ForegroundColor White
Write-Host "5. Add REACT_APP_API_URL environment variable" -ForegroundColor White
Write-Host ""

Write-Host "✅ READY FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Additional Resources:" -ForegroundColor Yellow
Write-Host "• DEPLOY_TO_RENDER.md - Step-by-step guide" -ForegroundColor White
Write-Host "• ENV_VARIABLES_GUIDE.md - All environment variables" -ForegroundColor White
Write-Host "• RENDER_DEPLOYMENT_GUIDE.md - Detailed troubleshooting" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Step: Deploy to Render first, then Vercel!" -ForegroundColor Green

# Usage instructions
Write-Host ""
Write-Host "💡 Script Usage:" -ForegroundColor Yellow
Write-Host "• .\deploy-to-render.ps1          - Basic check and info" -ForegroundColor White
Write-Host "• .\deploy-to-render.ps1 -Test    - Include build tests" -ForegroundColor White
Write-Host "• .\deploy-to-render.ps1 -Deploy  - Open deployment sites" -ForegroundColor White
