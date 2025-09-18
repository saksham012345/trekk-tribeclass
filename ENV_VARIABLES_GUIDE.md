# 🔐 Complete Environment Variables Guide - Trek Tribe

## 🔑 Your Generated Secure Secrets
- **JWT_SECRET**: `01746CD09C1EE37BA7BDC2EFC9EF445E`
- **SESSION_SECRET**: `04280DAC546C0A188E96ED4C450801B8`

---

## 🚀 RENDER BACKEND DEPLOYMENT

### Environment Variables for Render Web Service:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Optional (Email Notifications):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@trekktribe.com
```

### Render Deployment Steps:
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `https://github.com/saksham012345/trekk-tribeclass`
4. Configure:
   - **Name**: `trekk-tribe-api`
   - **Root Directory**: `services/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add all environment variables above
6. Deploy

---

## ☁️ VERCEL FRONTEND DEPLOYMENT

### Environment Variables for Vercel:

```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

### Vercel Deployment Steps:
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import GitHub repo: `https://github.com/saksham012345/trekk-tribeclass`
4. Configure:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto-detected)
5. Add environment variable above
6. Deploy

---

## 🌐 FULL VERCEL DEPLOYMENT (Alternative)

### Environment Variables for Full-Stack Vercel:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/trekktribe?retryWrites=true&w=majority
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
```

**Optional:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@trekktribe.com
```

---

## 🗄️ MONGODB ATLAS SETUP

### 1. Create MongoDB Atlas Account:
- Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Sign up for free account

### 2. Create Cluster:
- Choose FREE tier (M0)
- Select region close to you

### 3. Database Access:
- Create database user with username/password
- Set privileges to "Read and write to any database"

### 4. Network Access:
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)

### 5. Get Connection String:
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your password
- Replace `<database>` with `trekktribe`

**Example Connection String:**
```
mongodb+srv://trekktribe_user:MyPassword123@cluster0.abc123.mongodb.net/trekktribe?retryWrites=true&w=majority
```

---

## 📧 GMAIL EMAIL SETUP (Optional)

### 1. Enable 2-Factor Authentication:
- Go to Google Account settings
- Enable 2FA

### 2. Create App Password:
- Go to Google Account → Security
- Click "App passwords"
- Select "Mail" and "Other (Custom name)"
- Name it "Trek Tribe"
- Copy the 16-character password

### 3. Environment Variables:
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

---

## 🏠 LOCAL DEVELOPMENT

### services/api/.env:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/trekktribe
JWT_SECRET=01746CD09C1EE37BA7BDC2EFC9EF445E
SESSION_SECRET=04280DAC546C0A188E96ED4C450801B8
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@trekktribe.com
```

### web/.env:
```env
REACT_APP_API_URL=http://localhost:4000
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### Test API Health:
- **Local**: http://localhost:4000/health
- **Render**: https://your-service.onrender.com/health
- **Vercel**: https://your-app.vercel.app/api/health

### Test Full App:
1. Register new account
2. Create trip (as organizer)
3. Join trip (as traveler)
4. Test notifications

---

## 🔒 SECURITY CHECKLIST

- [ ] Use provided JWT/Session secrets
- [ ] Use MongoDB Atlas (not local) for production
- [ ] Enable 2FA for Gmail
- [ ] Use App Password (not regular password)
- [ ] Set NODE_ENV=production
- [ ] Never commit .env files

---

## 🆘 COMMON ISSUES

### Database Connection Fails:
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify username/password in connection string
- Ensure database user has proper permissions

### Email Not Working:
- Enable 2FA on Gmail
- Use App Password, not regular Gmail password
- Check SMTP configuration

### CORS Errors:
- Verify FRONTEND_URL matches your frontend domain
- Check API URL in frontend environment variables

---

## 📋 DEPLOYMENT CHECKLIST

### MongoDB Atlas:
- [ ] Cluster created
- [ ] Database user created  
- [ ] IP whitelist configured
- [ ] Connection string copied

### Render Backend:
- [ ] Web service created
- [ ] GitHub connected
- [ ] Root directory: `services/api`
- [ ] Environment variables added
- [ ] Deployed successfully

### Vercel Frontend:
- [ ] Project imported
- [ ] Root directory: `web`
- [ ] API URL environment variable added
- [ ] Deployed successfully

### Testing:
- [ ] API health check works
- [ ] Frontend loads
- [ ] Authentication works
- [ ] Trip creation works
- [ ] Notifications work

---

**Your deployment is ready! Use the secrets and configurations above.** 🚀
