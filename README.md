# Todo List Application

A professional todo list application with React frontend and Express backend.

## 🚀 Quick Start

### Important URLs:
- **Todo App (Frontend)**: http://localhost:5173
- **Backend API**: http://localhost:3001

⚠️ **Note**: Always access the app at http://localhost:5173 (NOT port 3001)
- Port 3001 is for the backend API only
- If you see "Cannot GET", make sure you're accessing http://localhost:5173

### Start the Application:

**Option 1: Use the start script (Recommended)**
```bash
cd /home/admin-090/Desktop/Todolist
./start.sh
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd /home/admin-090/Desktop/Todolist/Server
npm start

# Terminal 2 - Frontend
cd /home/admin-090/Desktop/Todolist/todolist
npm run dev
```

Then open your browser to: **http://localhost:5173**

The server listens on http://localhost:3001. If you have MongoDB and want persistence, create `Server/.env` with:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.../dbname
```

To run locally over HTTPS (recommended for testing secure pages), generate locally-trusted certificates and start both client and server with HTTPS enabled (instructions below).

4) Useful other commands:

```bash
# run frontend linter
cd todolist
npm run lint

# install frontend deps (if needed)
cd todolist
npm install

# install server deps (if needed)
cd Server
npm install
```

Git & workflow
- I created a branch `feat/ui-enhancements` and committed the UI/styling/server changes. If you'd like, I can push to a remote (you'll need to add a remote).
- To inspect the branch locally:

```bash
cd /home/admin-090/Desktop/Todolist
git branch --show-current
git log --oneline --decorate -n 10
```

Notes
- Server fallback: when no `MONGO_URI` is configured, the server uses an in-memory store (non-persistent). This is useful for local testing without DB setup.
- I added: delete, edit, mark-complete, clear-completed, sorting, counts and improved CSS.

Local HTTPS (recommended)
1) Install mkcert: https://github.com/FiloSottile/mkcert

2) From the repo root generate certs and store them in `/home/admin-090/Desktop/Todolist/certs`:

```bash
cd /home/admin-090/Desktop/Todolist
mkdir -p certs
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

3) Start server and client with HTTPS enabled (server auto-detects the cert files or set USE_HTTPS=true):

```bash
# start server (reads certs automatically)
USE_HTTPS=true npm start

# start vite dev server (will pick up certs automatically)
npm run dev
```

Open https://localhost:5173 in your browser (you should see a secure padlock). The API will be available at https://localhost:3001.

Next suggestions
- Add tests (server: supertest; client: Jest + React Testing Library).
- Add CI to run lint & tests on PRs.

Vercel deployment notes

This repo contains a Vite frontend in `todolist/` and an Express backend in `Server/`.

Important: Vercel is a static & serverless hosting platform. It will happily build and host the frontend (static site) from `todolist/dist`, but it won't run your existing Express server as-is. You have two options:

1) Deploy frontend to Vercel and run the backend elsewhere (recommended):
	- Vercel will build the frontend using the `todolist/package.json` build script. I added a `vercel.json` file so Vercel knows to build from the `todolist` directory and serve the `dist` output.
	- Host the Express API on a separate host (Render, Railway, Fly, Heroku) or convert it to serverless functions.

2) Convert Express to serverless API routes for Vercel (larger change):
	- Move API logic into `/api` serverless functions. This will require changes to `Server/index.js` and the Mongoose usage.

How to deploy the frontend to Vercel (simple):
  - Push this repository to GitHub.
  - In the Vercel dashboard create a new project and import the GitHub repository.
  - During import set the "Root Directory" to `/` (the repo root) — the included `vercel.json` points Vercel at `todolist/package.json` and will run the build correctly.
  - Build command: leave default (Vercel will detect `@vercel/static-build` from `vercel.json`), Output Directory: `todolist/dist` (the `vercel.json` already configures this).
  - Environment: If your frontend needs to call your API, set an environment variable (for example `REACT_APP_API_BASE`) to point to your hosted API URL (e.g., `https://api.example.com`) and update the frontend to use that env variable in production.

How to push changes to GitHub from this repo (example):
```bash
# create remote (run once)
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
# push current branch
git push -u origin main
```

If you'd like, I can:
- Create a small `dev:all` script to run both client and server for local development.
- Convert the Express API into Vercel Serverless functions (I can scaffold this, but it is a larger change).
- Attempt to push to your GitHub if you provide a repo URL or set the remote.

If you want me to push to a remote or create a PR, tell me which remote to use (or provide the remote URL). 
