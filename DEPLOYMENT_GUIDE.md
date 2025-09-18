# 🚀 Complete Deployment Guide - Trek Tribe

This guide will help you deploy the Trek Tribe project with:
- **Backend API**: Render
- **Frontend**: Vercel  
- **Database**: MongoDB Atlas

## 📋 Prerequisites

1. GitHub account (project is already pushed)
2. MongoDB Atlas account
3. Render account
4. Vercel account

---

## 🗄️ Step 1: Set up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new organization and project

### 1.2 Create Database Cluster
1. Click "Create Cluster"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a region close to you
4. Name your cluster (e.g., `trekk-tribe-cluster`)
5. Click "Create Cluster" (takes 3-5 minutes)

### 1.3 Set up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Set up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `trekktribe`

**Example**: `mongodb+srv://username:password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority`

---

## 🖥️ Step 2: Deploy Backend API to Render

### 2.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up using your GitHub account

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `https://github.com/saksham012345/trekk-tribeclass.git`
3. Configure the service:
   - **Name**: `trekk-tribe-api`
   - **Root Directory**: `services/api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2.3 Add Environment Variables
In the Environment Variables section, add these:

```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long-random-string
SESSION_SECRET=your-super-secure-session-secret-at-least-32-characters-long-random-string
FRONTEND_URL=https://your-app-name.vercel.app
```

**Optional (for email notifications):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@trekktribe.com
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://your-service-name.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up using your GitHub account

### 3.2 Import Project
1. Click "New Project"
2. Import your GitHub repository: `https://github.com/saksham012345/trekk-tribeclass.git`
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

### 3.3 Add Environment Variables
1. Go to "Environment Variables" section
2. Add:
   ```
   REACT_APP_API_URL=https://your-render-service.onrender.com
   ```
   (Replace with your actual Render API URL from Step 2)

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Your frontend will be available at: `https://your-project-name.vercel.app`

---

## 🔄 Step 4: Update Cross-Origin Settings

### 4.1 Update Backend Environment
1. Go back to your Render dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL
3. Save and redeploy

### 4.2 Test the Connection
1. Visit your Vercel URL
2. Try to register/login
3. Create and join trips to test notifications

---

## 🔧 Step 5: Generate Secure Secrets

Use these commands to generate secure secrets:

```powershell
# For JWT_SECRET (run in PowerShell)
-join ((1..64) | ForEach {'{0:X}' -f (Get-Random -Max 16)})

# For SESSION_SECRET (run in PowerShell)
-join ((1..64) | ForEach {'{0:X}' -f (Get-Random -Max 16)})
```

---

## 🧪 Step 6: Test Your Deployment

### 6.1 Test API Health
Visit: `https://your-render-service.onrender.com/health`
You should see health information.

### 6.2 Test Full Application
1. Visit your Vercel URL
2. Register a new account
3. Create a trip (as organizer)
4. Join a trip (as traveler)
5. Check if notifications work

---

## 📝 Common Issues & Solutions

### Issue 1: API deployment fails
**Solution**: Check the build logs in Render. Make sure all dependencies are in `package.json`.

### Issue 2: Frontend can't connect to API
**Solution**: 
1. Check CORS settings in the API
2. Verify `REACT_APP_API_URL` is correct
3. Make sure API is deployed and running

### Issue 3: Database connection fails
**Solution**:
1. Check MongoDB Atlas connection string
2. Verify database user permissions
3. Ensure network access allows all IPs

### Issue 4: Real-time notifications don't work
**Solution**:
1. Check if WebSocket connections are allowed
2. Verify Socket.IO is properly configured
3. Check browser console for connection errors

---

## 🔒 Security Considerations

1. **Never commit secrets**: Keep `.env` files in `.gitignore`
2. **Use strong secrets**: Generate random 32+ character strings
3. **HTTPS only**: Both Render and Vercel provide HTTPS by default
4. **Database security**: Use MongoDB Atlas security features

---

## 📊 Monitoring & Logs

### Render Logs
- Go to your Render service dashboard
- Click on "Logs" to see real-time logs

### Vercel Logs  
- Go to your Vercel project dashboard
- Click on "Functions" tab for logs

---

## 🎯 Final Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user and network access set up
- [ ] Backend deployed to Render with all environment variables
- [ ] Frontend deployed to Vercel with API URL
- [ ] Cross-origin settings updated
- [ ] Application tested end-to-end
- [ ] Real-time notifications working
- [ ] Email notifications configured (optional)

---

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas connection

Your deployed application URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-service.onrender.com`
- **API Health Check**: `https://your-service.onrender.com/health`
