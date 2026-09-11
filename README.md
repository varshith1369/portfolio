# Yannabathula Varshith Reddy – Personal Portfolio

A sleek, animated developer portfolio for **Yannabathula Varshith Reddy** (B.Tech Computer Science & Engineering).

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Features

- **Hero Section**: Animated introduction, social links, resume/contact quick actions.
- **Interactive Projects Showcase**: Detailed views for projects like *TalentForge*, *BiteNow*, and *Mental Health Analysis*.
- **Certificates Slideshow**: High-resolution interactive certificate viewer with lightbox support.
- **Skills Matrix**: Categorized tech stacks across AI/ML, Data Science, Full-Stack, and Databases.
- **Education & Achievements**: Timeline view with custom gradients and stat callouts.
- **Edit Terminal & Admin Mode**:
  - Hidden from public navigation; accessible via `Menu > Edit Terminal` or `/edit`.
  - Protected with a **4-digit PIN** (default: `1369`).
  - Forgot PIN recovery workflow sending an OTP to registered Gmail.
  - Interactive Unix-style CLI Terminal (`varshith@portfolio:~$`) and Visual GUI Editor to update portfolio content on the fly.
- **Contact Form**: Direct messaging powered by FormSubmit AJAX API with honeypot spam protection.

---

## 🚀 Deploying to Vercel

This repository is already configured for one-click Vercel deployment with `vercel.json` SPA routing support.

### Option 1: Import directly from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: `varshith1369/portfolio`.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. (Optional) In **Environment Variables**, add the Supabase keys if using Supabase features:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
6. Click **"Deploy"**!

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/varshith1369/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Animation**: Framer Motion + Canvas Particles + Tailwind Animate
- **Routing**: React Router v6
- **Deployment**: Vercel (configured with `vercel.json`)
