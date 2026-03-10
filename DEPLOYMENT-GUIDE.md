# 🚀 Deployment Guide: Vercel Frontend + Render Backend

## 📋 Overview
- **Frontend**: Vercel (Static React App)
- **Backend**: Render (Node.js + MongoDB)
- **Database**: MongoDB Atlas

---

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. **Build Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Runtime: Node 18+

### 3. Environment Variables (Render)
Set these in Render Dashboard:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://your-connection-string
TIME_LIMIT_MINUTES=20
ADMIN_KEY=your-secure-admin-key
CORS_ORIGIN=https://your-app-name.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
PDF_MAX_SIZE=10485760
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your-session-secret
LOG_LEVEL=info
```

### 4. MongoDB Setup
- Add Render's IP to MongoDB Atlas whitelist
- Or use `0.0.0.0/0` for testing

---

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend
```bash
# Navigate to frontend
cd frontend

# Update .env.production with your Render URL
VITE_API_URL=https://your-app-name.onrender.com

# Install dependencies
npm install
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. **Root Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### 3. Environment Variables (Vercel)
Only need frontend variables in `.env.production`:
```
VITE_API_URL=https://your-app-name.onrender.com
VITE_ADMIN_PASSWORD=your-secure-password
```

---

## 🔄 Post-Deployment Setup

### 1. Test Backend
```bash
curl https://your-app.onrender.com/health
```

### 2. Test Frontend
- Visit your Vercel URL
- Test resume creation
- Test PDF download

### 3. Set Deployment Timestamp
```bash
curl -X POST https://your-app.onrender.com/api/time-status/reset \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{"adminKey": "your-admin-key"}'
```

---

## 🛠️ Troubleshooting

### Backend Issues
- **MongoDB Connection**: Check MONGO_URI and IP whitelist
- **CORS Errors**: Verify CORS_ORIGIN matches Vercel URL
- **Build Failures**: Check package.json and dependencies

### Frontend Issues
- **API Errors**: Verify VITE_API_URL is correct
- **Build Failures**: Check terser dependency
- **Environment Variables**: Ensure VITE_ prefix for frontend

### Common Fixes
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild frontend
npm run build
```

---

## 📊 Architecture

```
User → Vercel Frontend → Render Backend → MongoDB Atlas
       (Static Site)    (API Server)    (Database)
```

### Benefits
- ✅ **Scalable**: Frontend and backend scale independently
- ✅ **Fast**: Vercel CDN for frontend
- ✅ **Reliable**: Render handles backend uptime
- ✅ **Cost Effective**: Free tiers available for both

---

**🎉 Your CRCCF Resume Builder is now ready for production!**
