# Quick Start: Deploy to Vercel

This guide gets you up and running with Networked A-Frame on Vercel in under 5 minutes.

## 🚀 One-Click Deploy (Frontend Only)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/networked1.7.1)

> ⚠️ **Note**: This deploys only the static frontend. You'll need to deploy the backend separately (see below).

## 📋 What You Need

- **Frontend Hosting**: Vercel (free tier works great!)
- **Backend Hosting**: Railway, Render, or Heroku (for Socket.IO/WebRTC)
- **Total Time**: ~10 minutes

## 🎯 Step-by-Step Deployment

### Step 1: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy!
vercel --prod
```

That's it! Your frontend is live. 🎉

### Step 2: Deploy Backend to Railway

1. **Sign up at** [railway.app](https://railway.app) (free tier available)

2. **Click "New Project"** → "Deploy from GitHub repo"

3. **Create a new GitHub repo** with these files:
   ```
   backend/
   ├── package.json         (use backend-package.json as template)
   ├── app/
   │   ├── server/
   │   │   └── easyrtc-server.js
   │   └── examples/        (needed for static serving)
   ```

4. **Railway auto-deploys** and gives you a URL like:
   ```
   https://your-app.railway.app
   ```

### Step 3: Connect Frontend to Backend

Update your `public/index.html` (and other HTML files):

```html
<!-- Find this line -->
<a-scene networked-scene="
  room: test;
  adapter: easyrtc;
  debug: true;
  audio: true;
  video: true;
">

<!-- Update serverURL if needed -->
<a-scene networked-scene="
  room: test;
  adapter: easyrtc;
  serverURL: https://your-app.railway.app;
  debug: true;
  audio: true;
  video: true;
">
```

### Step 4: Redeploy Frontend

```bash
vercel --prod
```

### Step 5: Test!

1. Open your Vercel URL in two browser tabs
2. You should see avatars syncing between tabs
3. Try moving around - positions should sync in real-time

## 🛠️ Development Setup

```bash
# Frontend development
cd app
npm install
npm run dev

# Visit http://localhost:8080
```

## 📁 Project Structure

```
networked1.7.1/
├── public/              # ✅ Deployed to Vercel
│   ├── index.html       # Main VR scene
│   ├── dist/            # Networked-aframe library
│   ├── js/              # Components
│   ├── css/             # Styles
│   └── assets/          # 3D models, textures
│
├── app/
│   ├── server/          # 🔧 Deploy separately to Railway/Render
│   │   ├── easyrtc-server.js
│   │   └── socketio-server.js
│   └── src/             # Source code (built into dist/)
│
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json
└── backend-package.json # Backend deployment template
```

## 🐛 Common Issues & Fixes

### "Cannot connect to server"

**Problem**: Frontend can't reach backend.

**Fix**:
1. Check backend is running: `curl https://your-backend.railway.app`
2. Update `serverURL` in HTML files
3. Check CORS settings in backend

### "Mixed Content" Warning

**Problem**: Loading HTTP backend from HTTPS frontend.

**Fix**: Ensure backend URL uses HTTPS (Railway/Render provide this automatically)

### Assets Not Loading

**Problem**: 3D models or images return 404.

**Fix**:
1. Check files exist in `public/assets/`
2. Use relative paths: `./assets/model.glb`
3. Clear browser cache

## 🔧 Backend CORS Configuration

If you get CORS errors, update your backend server:

```javascript
// In app/server/easyrtc-server.js
const socketServer = socketIo.listen(webServer, {
  cors: {
    origin: [
      "https://your-vercel-app.vercel.app",
      "https://your-custom-domain.com",
      "http://localhost:8080"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

## 🚀 Alternative Backend Hosting

### Render.com

```bash
# 1. Create render.yaml
services:
  - type: web
    name: networked-aframe-backend
    env: node
    buildCommand: npm install
    startCommand: npm start

# 2. Push to GitHub
# 3. Connect to Render
```

### Heroku

```bash
# 1. Create Procfile
web: npm start

# 2. Deploy
heroku create
git push heroku main
```

### Fly.io (Supports WebSockets!)

```bash
# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login and launch
fly auth login
fly launch
```

## 📊 Monitoring

- **Vercel**: Built-in analytics in dashboard
- **Railway**: Real-time logs in dashboard
- **Uptime**: Use [UptimeRobot](https://uptimerobot.com) (free)

## 🔐 Environment Variables

### Frontend (Vercel)

Add in Vercel dashboard → Settings → Environment Variables:

```env
BACKEND_URL=https://your-backend.railway.app
NODE_ENV=production
```

### Backend (Railway)

Add in Railway dashboard → Variables:

```env
PORT=8080
NODE_ENV=production
```

## 💰 Cost Estimate

- **Vercel Frontend**: Free (100GB bandwidth/month)
- **Railway Backend**: $5/month (free for personal projects)
- **Custom Domain**: $10-15/year (optional)

**Total**: Essentially free for personal projects! 🎉

## 📚 Full Documentation

For detailed deployment instructions, troubleshooting, and advanced configuration:

👉 See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Need Help?

- [Networked A-Frame Docs](https://github.com/networked-aframe/networked-aframe)
- [Vercel Support](https://vercel.com/support)
- [Railway Docs](https://docs.railway.app/)

## 🎮 What's Next?

1. ✅ Add custom domain
2. ✅ Optimize 3D models (use GLB + Draco)
3. ✅ Add environment variables for configuration
4. ✅ Set up monitoring and analytics
5. ✅ Enable audio/video permissions
6. ✅ Customize avatar templates

Happy building! 🚀✨
