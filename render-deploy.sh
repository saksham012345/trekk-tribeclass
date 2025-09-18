#!/bin/bash
# Render Deployment Script for Trek Tribe API

echo "🚀 Starting Render deployment for Trek Tribe API..."

# Navigate to API directory
cd services/api

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🏗️ Building application..."
npm run build

# The start command will be handled by Render
echo "✅ Build complete! Render will now start the application..."

# Health check endpoint will be available at /health
