# ✅ Vercel Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Repository Setup
- [ ] Push all changes to GitHub
- [ ] Ensure `vercel.json` exists in root
- [ ] Verify `backend/api/index.js` exists
- [ ] Check `frontend/.env.production` is configured
- [ ] Update root `package.json` with workspaces

### ✅ Environment Variables
#### Backend (Set in Vercel Dashboard)
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `NODE_ENV=production`
- [ ] `TIME_LIMIT_MINUTES=20`
- [ ] `ADMIN_KEY` - Secure admin key
- [ ] `CORS_ORIGIN=https://your-app-name.vercel.app`

#### Frontend (.env.production)
- [ ] `VITE_API_URL=https://your-app-name.vercel.app`
- [ ] `VITE_ADMIN_PASSWORD` - Secure password
- [ ] Other VITE_ variables configured

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Database user created
- [ ] Connection string tested

## 🚀 Deployment Steps

### Option A: Vercel Dashboard (Recommended)
1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Click "New Project"
3. [ ] Connect GitHub repository
4. [ ] Configure build settings (auto-detected)
5. [ ] Add environment variables
6. [ ] Click "Deploy"

### Option B: Vercel CLI
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔄 Post-Deployment

### ✅ Testing Checklist
- [ ] Homepage loads correctly
- [ ] Resume form works
- [ ] PDF download functions
- [ ] Email sending works
- [ ] Timer displays correctly
- [ ] Modal forms save data
- [ ] Mobile responsive design

### ✅ Admin Setup
- [ ] Set deployment timestamp:
```bash
curl -X POST https://your-app-name.vercel.app/api/time-status/reset \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{"adminKey": "your-admin-key"}'
```

### ✅ Performance Check
- [ ] Page load speed < 3 seconds
- [ ] Mobile performance > 90
- [ ] No console errors
- [ ] All images load properly

## 🆘 Troubleshooting

### Common Issues & Solutions

#### ❌ "API routes not working"
**Solution**: Check `vercel.json` routes configuration

#### ❌ "MongoDB connection failed"
**Solution**: 
- Verify MONGO_URI in Vercel env vars
- Check Atlas network access
- Ensure IP whitelisting

#### ❌ "PDF generation fails"
**Solution**: 
- Check function timeout (max 30s)
- Verify pdf-lib dependency
- Check server logs

#### ❌ "CORS errors"
**Solution**: 
- Update CORS_ORIGIN env var
- Check backend CORS config

#### ❌ "Environment variables not loading"
**Solution**: 
- Vercel env vars no VITE_ prefix for backend
- Frontend .env.production needs VITE_ prefix

## 📊 Monitoring

### ✅ Set Up Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring set up

### ✅ Logs Access
```bash
# View recent logs
vercel logs

# Function-specific logs
vercel logs --filter=backend/server.js
```

## 🎉 Success Indicators

✅ **Your app is live when:**
- Homepage loads at your-app.vercel.app
- All forms submit successfully
- PDF downloads work
- No console errors
- Mobile version works
- Timer counts down correctly
- All modals save data

---

**🚀 Ready for production! Your CRCCF Resume Builder is now live on Vercel!**
