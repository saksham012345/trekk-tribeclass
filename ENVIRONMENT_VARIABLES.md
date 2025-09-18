# 🔐 Environment Variables Guide - Trek Tribe

This document contains all the environment variables needed for different deployment scenarios.

## 🔑 Your Generated Secure Secrets

**Use these secrets for all deployments:**
- **JWT_SECRET**: `01746CD09C1EE37BA7BDC2EFC9EF445E`
- **SESSION_SECRET**: `04280DAC546C0A188E96ED4C450801B8`

---

## 🚀 Render Deployment Environment Variables

### Backend API (Render Web Service)

**Required Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Optional Variables (for email notifications):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@trekktribe.com
```

### Frontend (Vercel)

**Required Variables:**
```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

---

## ☁️ Vercel Deployment Environment Variables

### Full-Stack (Vercel - Single Deployment)

**Required Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
```

**Optional Variables:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@trekktribe.com
```

---

## 🏠 Local Development Environment Variables

### Backend API (.env file in services/api/)

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/trekktribe

# For MongoDB Atlas (alternative):
# MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority

# Authentication
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@trekktribe.com
```

### Frontend (.env file in web/)

```env
REACT_APP_API_URL=http://localhost:4000
```

---

## 🗄️ MongoDB Atlas Connection Strings

### Production Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Example:
```
mongodb+srv://trekktribe_user:MySecurePassword123@trekktribe-cluster.abc123.mongodb.net/trekktribe?retryWrites=true&w=majority
```

**How to get your connection string:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with `trekktribe`

---

## 📧 Email Configuration (Gmail Setup)

### Step 1: Enable 2-Factor Authentication
1. Go to Google Account settings
2. Enable 2-factor authentication

### Step 2: Create App Password
1. Go to Google Account → Security
2. Click "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Name it "Trek Tribe App"
5. Copy the generated 16-character password

### Step 3: Use in Environment Variables
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

---

## 🔄 Deployment-Specific Instructions

### For Render Backend Deployment:

1. **Create Web Service in Render**
2. **Connect GitHub repository**
3. **Set Root Directory**: `services/api`
4. **Add Environment Variables** (see Render section above)
5. **Deploy**

### For Vercel Frontend Deployment:

1. **Import project to Vercel**
2. **Set Root Directory**: `web`
3. **Add Environment Variables** (see Vercel section above)
4. **Deploy**

### For Full Vercel Deployment:

1. **Import project to Vercel**
2. **Leave Root Directory as**: `.` (root)
3. **Add Environment Variables** (see Vercel Full-Stack section above)
4. **Deploy**

---

## 🔒 Security Best Practices

### ✅ DO:
- Use the provided secure secrets for JWT and Session
- Use MongoDB Atlas connection strings for production
- Enable 2FA and use App Passwords for email
- Set `NODE_ENV=production` in production
- Use HTTPS URLs in production environment variables

### ❌ DON'T:
- Commit `.env` files to version control
- Use weak or default secrets
- Use local MongoDB in production
- Share secrets in plain text
- Use regular Gmail passwords (use App Passwords)

---

## 🧪 Testing Your Environment Variables

### Test MongoDB Connection:
```javascript
// Test in Node.js console
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

### Test API Health:
- **Local**: http://localhost:4000/health
- **Render**: https://your-service.onrender.com/health
- **Vercel**: https://your-app.vercel.app/api/health

### Test Email Configuration:
The app includes a test notification endpoint you can use to verify email setup.

---

## 📋 Environment Variables Checklist

### MongoDB Atlas Setup:
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied and tested

### Render Backend:
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` set with Atlas connection string
- [ ] `JWT_SECRET` set with provided secret
- [ ] `SESSION_SECRET` set with provided secret
- [ ] `FRONTEND_URL` set with your Vercel URL
- [ ] Optional: SMTP variables for email

### Frontend (Vercel/Other):
- [ ] `REACT_APP_API_URL` set with your backend URL

### Email (Optional):
- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] SMTP variables configured

---

## 🆘 Common Issues & Solutions

### Issue 1: "Authentication failed" (MongoDB)
**Solution**: 
- Check username/password in connection string
- Verify database user permissions
- Ensure special characters in password are URL-encoded

### Issue 2: "Network timeout" (MongoDB)
**Solution**: 
- Add 0.0.0.0/0 to IP whitelist in Atlas
- Check if your hosting provider's IPs need whitelisting

### Issue 3: Email notifications not working
**Solution**: 
- Verify 2FA is enabled on Gmail
- Use App Password, not regular Gmail password
- Check SMTP settings are correct

### Issue 4: CORS errors
**Solution**: 
- Verify `FRONTEND_URL` is set correctly
- Check that frontend and backend URLs match

### Issue 5: Sessions not working
**Solution**: 
- Ensure `SESSION_SECRET` is set
- Verify MongoDB connection for session storage
- Check cookie settings in production

---

## 📞 Quick Reference

### Generate New Secrets (if needed):
```powershell
# JWT Secret (32+ characters)
-join ((1..32) | ForEach {'{0:X}' -f (Get-Random -Max 16)})

# Session Secret (32+ characters)
-join ((1..32) | ForEach {'{0:X}' -f (Get-Random -Max 16)})
```

### Your Current Secrets:
- **JWT_SECRET**: `01746CD09C1EE37BA7BDC2EFC9EF445E`
- **SESSION_SECRET**: `04280DAC546C0A188E96ED4C450801B8`

**Keep these secrets secure and never share them publicly!** 🔐
