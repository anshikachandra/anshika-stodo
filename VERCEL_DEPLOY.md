# How to Deploy on Vercel

## The Problem
You're getting a 404 error because Vercel doesn't know where your frontend code is.

## Solution: Deploy the Frontend Folder Only

### Option 1: Deploy from Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `anshikachandra/anshika-stodo`
3. **IMPORTANT**: Set the Root Directory to `todolist` (not the root)
4. Framework Preset: Vite
5. Build Command: `npm run build` (default is fine)
6. Output Directory: `dist` (default is fine)
7. Click "Deploy"

### Option 2: Deploy via CLI

```bash
cd /home/admin-090/Desktop/Todolist/todolist
vercel --prod
```

## Important Notes

⚠️ **Backend Note**: Vercel will only host your FRONTEND (the React app). 

Your backend (Server folder) needs to be deployed separately on:
- Railway.app
- Render.com
- Heroku
- Any Node.js hosting service

After deploying the backend, update your frontend to use the production backend URL instead of `localhost:3001`.

## Current Setup Issues

1. ❌ **Root deployment won't work** - Your app structure has frontend in `/todolist` subfolder
2. ✅ **Deploy only the todolist folder** - This contains your Vite/React app
3. ⚠️ **Backend runs separately** - You'll need to deploy it elsewhere

## Why 404 Happens

- Vercel looked in the root folder
- Found no `index.html` or build files
- Returned 404

**Solution**: Point Vercel to the `todolist` folder where your actual app lives!
