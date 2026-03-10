# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub/GitLab/Bitbucket repository
- Vercel account (free)
- MongoDB Atlas database

## 🛠️ Setup Steps

### 1. Repository Structure
```
crccf-resume-builder/
├── frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.production
├── backend/                  # Node.js backend
│   ├── src/
│   ├── server.js
│   └── package.json
├── api/                      # Vercel functions
│   └── index.js
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json
└── README-VERCEL.md
```

### 2. Environment Variables

#### Backend Environment Variables (Set in Vercel Dashboard):
```
NODE_ENV=production
MONGO_URI=mongodb+srv://your-connection-string
TIME_LIMIT_MINUTES=20
ADMIN_KEY=your-secure-admin-key
DEPLOYMENT_TIMESTAMP_AUTO_RESET=false
CORS_ORIGIN=https://your-app-name.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
PDF_MAX_SIZE=10485760
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your-session-secret
LOG_LEVEL=info
```

#### Frontend Environment Variables (.env.production):
```
VITE_API_URL=https://your-app-name.vercel.app
VITE_ADMIN_PASSWORD=your-secure-admin-password
VITE_APP_NAME=CRCCF Resume Builder
VITE_APP_VERSION=1.0.0
VITE_TIME_LIMIT_MINUTES=20
VITE_TIME_CHECK_INTERVAL_SECONDS=30
VITE_ENABLE_WHATSAPP=true
VITE_ENABLE_EMAIL=true
VITE_ENABLE_PRINT=true
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### 3. Vercel Configuration (vercel.json)
✅ Already configured - routes API calls to backend, others to frontend

### 4. Deployment Steps

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Vercel will auto-detect the framework
5. Configure environment variables
6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel --prod
```

### 5. Post-Deployment Configuration

#### Update MongoDB Time Status
After deployment, you need to set the deployment timestamp:

```bash
# Via API call
curl -X POST https://your-app-name.vercel.app/api/time-status/reset \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{"adminKey": "your-admin-key"}'
```

#### Test the Application
- Visit: `https://your-app-name.vercel.app`
- Test resume creation
- Test PDF download
- Test email functionality

## 🔧 Troubleshooting

### Common Issues:

1. **API Routes Not Working**
   - Check `vercel.json` routes configuration
   - Ensure `backend/api/index.js` exists

2. **MongoDB Connection Failed**
   - Verify MONGO_URI in Vercel environment variables
   - Check MongoDB Atlas network access (allow 0.0.0.0/0)

3. **PDF Generation Fails**
   - Check serverless function timeout (max 30 seconds)
   - Verify pdf-lib dependency in backend

4. **CORS Issues**
   - Update CORS_ORIGIN to your Vercel URL
   - Check backend CORS configuration

5. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Check variable names (no VITE_ prefix for backend)

## 📊 Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Error tracking
- Usage metrics

### Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --filter=backend/server.js
```

## 🔄 Continuous Deployment

Vercel automatically:
- Deploys on every push to main branch
- Creates preview URLs for pull requests
- Rollbacks on failed deployments

## 💡 Tips

1. **Optimize Images**: Use Vercel's built-in image optimization
2. **Cache Strategy**: Leverage Vercel's edge caching
3. **Bundle Size**: Keep frontend bundle under 1MB for optimal performance
4. **Function Timeout**: Keep serverless functions under 30 seconds
5. **Environment Variables**: Use different variables for staging/production

## 🆘 Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [cloud.mongodb.com](https://cloud.mongodb.com)
- Issues: Check Vercel deployment logs

---

**🎉 Your CRCCF Resume Builder is now ready for production on Vercel!**
