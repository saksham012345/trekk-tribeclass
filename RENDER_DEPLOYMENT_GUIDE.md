# 🚀 Complete Render Deployment Guide - Trek Tribe

This guide covers deploying the Trek Tribe backend API to Render and frontend to Vercel.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas**: Free cluster setup
4. **GitHub Repository**: Your code is already pushed

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
4. Create username and password (**save these!**)
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
2. Connect your GitHub repository: `https://github.com/saksham012345/trekk-tribeclass`
3. Configure the service:
   - **Name**: `trekk-tribe-api`
   - **Root Directory**: `services/api`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` or closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2.3 Add Environment Variables

In the Environment Variables section, add these **exact** variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Optional (for email notifications):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
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
2. Import your GitHub repository: `https://github.com/saksham012345/trekk-tribeclass`
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

### 3.3 Add Environment Variables
1. Go to "Environment Variables" section
2. Add:
   ```
   REACT_APP_API_URL=https://your-render-service-name.onrender.com
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
3. Save and redeploy (this happens automatically)

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test API Health
Visit: `https://your-render-service.onrender.com/health`
You should see health information with database status.

### 5.2 Test Full Application
1. Visit your Vercel URL
2. Register a new account
3. Create a trip (as organizer)
4. Join a trip (as traveler)
5. Test notifications

---

## 📝 Important Notes for Render

### Free Tier Limitations:
- **Automatic Sleep**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes 10-30 seconds
- **750 Hours/Month**: Free tier limit
- **No Custom Domains**: Use `.onrender.com` subdomain

### Performance Optimization:
- Render services have built-in health checks
- Database connections are automatically managed
- Services auto-restart if they crash

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Build fails on Render
**Solutions**: 
- Check that `services/api/package.json` has all dependencies
- Verify TypeScript compiles locally: `cd services/api && npm run build`
- Check Render build logs for specific errors

### Issue 2: API returns 503 Service Unavailable
**Solution**: 
- Service is likely sleeping (free tier limitation)
- Wait 30 seconds for cold start
- Consider upgrading to paid plan for always-on service

### Issue 3: Database connection fails
**Solutions**:
- Verify MongoDB Atlas connection string format
- Check database user permissions
- Ensure network access allows all IPs (0.0.0.0/0)

### Issue 4: CORS errors between frontend and backend
**Solutions**:
- Verify `FRONTEND_URL` in Render matches your Vercel domain
- Check `REACT_APP_API_URL` in Vercel matches your Render service URL
- Ensure no trailing slashes in URLs

### Issue 5: Environment variables not working
**Solutions**:
- Restart the Render service after adding variables
- Check variable names match exactly (case-sensitive)
- Verify no extra spaces in variable values

---

## 🔒 Security Best Practices

### Environment Variables:
- ✅ Use the provided secure JWT and Session secrets
- ✅ Use MongoDB Atlas connection strings for production
- ✅ Set `NODE_ENV=production`
- ❌ Never commit `.env` files to version control

### Database Security:
- ✅ Use strong database user passwords
- ✅ Limit database user privileges to specific database
- ✅ Enable MongoDB Atlas security features

---

## 📊 Monitoring Your Deployment

### Render Monitoring:
- Check "Logs" tab for real-time application logs
- Monitor "Metrics" for performance data
- Set up email alerts for service failures

### Vercel Monitoring:
- Check "Functions" tab for API request logs
- Monitor "Analytics" for user traffic
- Review "Speed Insights" for performance

---

## 🎯 Final Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user with proper permissions created
- [ ] Network access set to allow all IPs (0.0.0.0/0)
- [ ] Render web service deployed with all environment variables
- [ ] Vercel frontend deployed with API URL
- [ ] Cross-origin settings updated
- [ ] API health check responding correctly
- [ ] Frontend loading and connecting to API
- [ ] User registration/login working
- [ ] Trip creation and joining functional
- [ ] Email notifications configured (optional)

---

## 🌟 Your Deployed Application URLs

After successful deployment:
- **Frontend**: `https://your-vercel-project.vercel.app`
- **Backend API**: `https://your-render-service.onrender.com`
- **API Health Check**: `https://your-render-service.onrender.com/health`

---

## 📞 Support Resources

### Render Support:
- [Render Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

### Vercel Support:
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Discussions](https://github.com/vercel/vercel/discussions)
- [Discord Community](https://vercel.com/discord)

### MongoDB Atlas:
- [Atlas Documentation](https://docs.atlas.mongodb.com)
- [Community Forum](https://developer.mongodb.com/community/forums)
- [University Courses](https://university.mongodb.com)

---

**Your Trek Tribe application is now live on Render + Vercel! 🎉**

The combination of Render (backend) and Vercel (frontend) provides:
- ✅ Full-stack deployment
- ✅ Real-time notifications (Socket.IO works on Render)
- ✅ Email notifications
- ✅ Secure authentication
- ✅ Scalable architecture
