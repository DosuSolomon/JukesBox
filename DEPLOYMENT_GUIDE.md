# JukesBox Deployment Guide

## Problem
The songs are not populating when the QR code is scanned because the frontend needs to connect to a deployed backend API.

---

## Part 1: Deploy Backend on Render

### Step 1: Create PostgreSQL Database
1. Go to https://dashboard.render.com/
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `jukesbox-db`
   - **Database**: `jukesbox`
   - **User**: `jukesbox`
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait for it to provision, then copy the **"Internal Database URL"** (you'll need this later)

### Step 2: Create Web Service for Backend
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `jukesbox-server`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Scroll down to **"Environment Variables"** and add:
   - `NODE_ENV` = `production`
   - `POSTGRES_DB` = `jukesbox`
   - `POSTGRES_USER` = `jukesbox`
   - `POSTGRES_PASSWORD` = (the password you set when creating the database)
   - `POSTGRES_HOST` = (from your internal database URL - the part after `@` and before `:`)
   - `POSTGRES_PORT` = `5432`
   - `DATABASE_URL` = (paste your full Internal Database URL here)
5. Click **"Create Web Service"**
6. Wait for deployment to complete

### Step 3: Get Your Backend URL
After deployment, you'll see a URL like:
```
https://jukesbox-server.onrender.com
```
Copy this URL.

---

## Part 2: Configure Frontend

### Option A: Update Frontend on Render
1. Go to your frontend service on Render (where you deployed the React app)
2. Click **"Environment"**
3. Add environment variable:
   - `VITE_API_URL` = `https://jukesbox-server.onrender.com` (your backend URL)
4. Redeploy the frontend

### Option B: Or use Vercel for Frontend
If you're using Vercel for the frontend:
1. Go to your Vercel project settings
2. Add environment variable:
   - `VITE_API_URL` = `https://jukesbox-server.onrender.com`
3. Redeploy

---

## Part 3: Test It
1. Visit your deployed frontend
2. Go to Artist Dashboard and add some songs
3. Scan the QR code or visit the Request Song page
4. Songs should now populate!

---

## Troubleshooting

### Songs still not loading?
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Make sure backend is running (visit `https://your-backend-url.onrender.com/api/health`)

### Database connection errors?
- Verify all POSTGRES environment variables are correct
- Check that the database is not paused (free databases pause after 90 days of inactivity)
