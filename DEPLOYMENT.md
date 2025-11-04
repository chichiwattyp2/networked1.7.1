# Deployment Guide for Networked A-Frame on Vercel

This guide explains how to deploy your Networked A-Frame VR application with Vercel for the frontend and a separate backend service for real-time networking.

## Architecture Overview

This application has two main components:

1. **Frontend (Static)**: A-Frame VR scenes, HTML, CSS, JavaScript
2. **Backend (Real-time)**: Socket.IO/EasyRTC server for WebRTC signaling and networking

## Frontend Deployment on Vercel

### Prerequisites

- [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`
- Vercel account: [vercel.com/signup](https://vercel.com/signup)

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### File Structure for Vercel

```
networked1.7.1/
├── public/              # Static files served by Vercel
│   ├── index.html       # Main VR scene
│   ├── dist/            # Networked-aframe bundle
│   ├── js/              # Components and scripts
│   ├── css/             # Stylesheets
│   ├── assets/          # 3D models, images
│   └── adapter-test/    # Testing pages
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json for Vercel
└── .vercelignore        # Files to exclude from deployment
```

### Environment Variables

If you're connecting to an external backend server, add these environment variables in the Vercel dashboard:

- `BACKEND_URL`: Your backend server URL (e.g., `https://your-backend.herokuapp.com`)
- `SOCKET_IO_URL`: Socket.IO server URL (same as BACKEND_URL in most cases)

## Backend Deployment (Socket.IO/EasyRTC)

Since Vercel doesn't support persistent WebSocket connections required by Socket.IO and EasyRTC, you need to deploy the backend separately.

### Recommended Backend Hosting Options

1. **Railway** (Easiest, with free tier)
   - Website: [railway.app](https://railway.app)
   - Supports WebSockets out of the box
   - Automatic deployments from GitHub

2. **Render** (Free tier available)
   - Website: [render.com](https://render.com)
   - Good for Node.js apps with WebSockets

3. **Heroku** (Classic choice)
   - Website: [heroku.com](https://heroku.com)
   - Well-documented for Node.js

4. **DigitalOcean App Platform**
   - Website: [digitalocean.com](https://www.digitalocean.com/products/app-platform)
   - Full control with managed hosting

### Deploy Backend to Railway (Recommended)

1. **Create a new GitHub repository** with the `app/server` directory

2. **Create `package.json` for the backend**:
   ```json
   {
     "name": "networked-aframe-server",
     "version": "1.0.0",
     "main": "server/easyrtc-server.js",
     "scripts": {
       "start": "node server/easyrtc-server.js"
     },
     "dependencies": {
       "express": "^4.17.1",
       "open-easyrtc": "^2.0.5",
       "socket.io": "^2.3.0"
     },
     "engines": {
       "node": ">=14.x"
     }
   }
   ```

3. **Deploy to Railway**:
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your backend repository
   - Railway will auto-detect and deploy

4. **Get your backend URL**:
   - Railway will provide a URL like: `https://your-app.railway.app`

### Deploy Backend to Render

1. **Create a `render.yaml` file**:
   ```yaml
   services:
     - type: web
       name: networked-aframe-backend
       env: node
       buildCommand: npm install
       startCommand: node server/easyrtc-server.js
       envVars:
         - key: NODE_ENV
           value: production
   ```

2. **Deploy**:
   - Visit [render.com](https://render.com)
   - Create a new "Web Service"
   - Connect your GitHub repository
   - Render will automatically deploy

## Connecting Frontend to Backend

After deploying the backend, update your frontend to connect to the external server:

### Option 1: Environment Variables (Recommended)

In Vercel dashboard, add:
```
BACKEND_URL=https://your-backend.railway.app
```

Then update your HTML files to use this variable.

### Option 2: Direct URL Update

Update the networked-scene component in your HTML files:

```html
<!-- Before -->
<a-scene networked-scene="
  room: test;
  adapter: easyrtc;
  serverURL: /;
">

<!-- After -->
<a-scene networked-scene="
  room: test;
  adapter: easyrtc;
  serverURL: https://your-backend.railway.app;
">
```

## Testing the Deployment

1. **Test Frontend**: Open your Vercel URL in a browser
2. **Test Backend**: Check that `https://your-backend-url/socket.io/socket.io.js` is accessible
3. **Test Networking**: Open the app in two different browser windows/devices

## Troubleshooting

### CORS Issues

If you encounter CORS errors, update your backend server to allow requests from your Vercel domain:

```javascript
// In server/easyrtc-server.js or server/socketio-server.js
const io = require("socket.io")(webServer, {
  cors: {
    origin: [
      "https://your-vercel-app.vercel.app",
      "http://localhost:8080"
    ],
    methods: ["GET", "POST"]
  }
});
```

### WebSocket Connection Fails

1. Ensure your backend is running: `curl https://your-backend-url`
2. Check backend logs for errors
3. Verify the `serverURL` in networked-scene matches your backend URL

### Assets Not Loading

1. Check that all asset paths are relative: `./assets/model.glb` not `/assets/model.glb`
2. Verify files exist in the `public/` directory
3. Check browser console for 404 errors

## Performance Optimization

### Enable Caching

The `vercel.json` already includes cache headers for static assets:
- `/dist/*` - Cached for 1 year (immutable)
- `/assets/*` - Cached for 1 year (immutable)

### Optimize 3D Models

1. Use GLB format instead of GLTF
2. Compress textures
3. Use Draco compression for geometry
4. Tools: [glTF Transform](https://gltf-transform.donmccurdy.com/)

### Enable Compression

Vercel automatically enables gzip/brotli compression for text files.

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Backend Monitoring**: Use Railway logs or Render logs
- **Error Tracking**: Consider [Sentry](https://sentry.io) for both frontend and backend

## Custom Domain

### Vercel Frontend

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Backend Domain

Configure your DNS to point to your backend hosting service (Railway/Render/etc).

## Development Workflow

1. **Local Development**:
   ```bash
   cd app
   npm run dev  # Runs local server with hot reload
   ```

2. **Preview Deployments**:
   ```bash
   vercel  # Creates preview deployment
   ```

3. **Production Deployment**:
   ```bash
   vercel --prod  # Deploys to production
   ```

## Support & Resources

- [Networked A-Frame Docs](https://github.com/networked-aframe/networked-aframe)
- [Vercel Documentation](https://vercel.com/docs)
- [A-Frame Documentation](https://aframe.io/docs/1.7.0/introduction/)
- [Railway Documentation](https://docs.railway.app/)

## Alternative: All-in-One Deployment

If you need everything in one place with WebSocket support, consider:

- **DigitalOcean Droplet** + Nginx
- **AWS EC2** + Load Balancer
- **Vultr** or **Linode** VPS
- **Fly.io** (supports WebSockets)

These options require more setup but give you full control.
