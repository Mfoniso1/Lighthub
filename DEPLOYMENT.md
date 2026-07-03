# Lighthub.edu Deployment Guide 🚀

This guide explains how to deploy the Lighthub.edu full-stack application (Next.js frontend + FastAPI backend) completely for free using Vercel and Render.

## 1. Backend Deployment (Render)

The backend handles AI generation (via OpenRouter), PDF ingestion, and vector embeddings (ChromaDB).

### Option A: Using Blueprints (Automated)
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Connect your GitHub account and select your repository (`Mfoniso1/Lighthub`).
3. Render will automatically read the `render.yaml` file in the root directory.
4. Click **Apply**. Render will automatically provision the Free tier web service.

### Option B: Manual Setup (If Blueprints asks for a card)
1. Go to the [Render Dashboard](https://dashboard.render.com) and click **New > Web Service**.
2. Select **Build and deploy from a Git repository** and connect `Mfoniso1/Lighthub`.
3. Configure the following settings:
   - **Name**: `lighthub-backend`
   - **Environment**: `Python 3`
   - **Region**: Any (e.g., Frankfurt or Ohio)
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
4. Under **Advanced**, add your Environment Variables:
   - `OPENROUTER_API_KEY`: *(Your OpenRouter key)*
   - `OPENROUTER_MODEL`: `anthropic/claude-3.5-sonnet` (or any other model)
5. Click **Deploy Web Service**.

> 🔗 **Important:** Once deployed, copy your backend URL (e.g., `https://lighthub-backend.onrender.com`). You will need this for the frontend!

---

## 2. Frontend Deployment (Vercel)

The frontend is built with Next.js and TailwindCSS.

1. Go to [Vercel's Git Import Page](https://vercel.com/new).
2. Authorize GitHub and select the `Mfoniso1/Lighthub` repository.
3. Vercel will automatically detect that it is a Next.js project.
4. **Before clicking Deploy**, expand the **Environment Variables** section and add:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: *(The Render URL you copied in Step 1, with NO trailing slash)*
5. Click **Deploy**.

## 3. Architecture & Persistence Notes

* **CORS:** The FastAPI backend is configured to accept cross-origin requests from any domain (`allow_origins=["*"]`).
* **Vector Database (ChromaDB):** For hackathons and free tiers, Render uses an ephemeral disk. This means `chroma_db/` resets when the server sleeps. You will need to re-upload your syllabus PDFs when waking up the app for a demo.
* **Next.js API Rewrites:** The `next.config.mjs` is configured to route all frontend calls from `/api/*` to the `BACKEND_URL` environment variable seamlessly.
