# Image Detection Frontend (v4.0)

A minimal, professional, production-ready web client for deep learning image authenticity classification and supporting analysis. Built with React 18, TypeScript, Tailwind CSS, and Vite.

---

## 🚀 Key Features

- **Dual-Theme System**: True Light (`#FAFAFA`) and Dark (`#0A0A0A`) themes with neutral grayscale tokens and high-contrast accessibility.
- **Collapsible Navigation**: Responsive left sidebar (MAIN: Dashboard, Analyze, History; TOOLS: Reports, Model Information; SYSTEM: Settings).
- **Minimal Top Header**: Non-distracting top bar with mobile navigation trigger, active page breadcrumb, instant theme toggle, and authenticated user identity.
- **Deep Learning Analysis Pipeline**:
  - Drag-and-drop / file selector with instant local thumbnail preview.
  - Asynchronous submission to FastAPI backend.
  - Three-tier verdict classification: `Real`, `AI-Generated`, or `Needs Review`.
- **Structured Explanations**: Dedicated *"Why was this image classified this way?"* card breaking down model basis, primary factors, supporting signals, and limitations.
- **Grad-CAM Model Focus**: Visual heatmap overlay displaying spatial regions that influenced the convolutional model's classification.
- **Hidden Evaluation Mode**:
  - Accessible via `Settings -> Evaluation Mode` (default: OFF).
  - Designed for controlled benchmark testing.
  - Allows selecting known image ground truth (`Real` or `AI-Generated`).
  - **Ground truth never enters the ML model**; it is evaluated strictly post-prediction to calculate classification correctness.
- **Google OAuth Authentication**: Powered by Supabase Auth with persistent sessions, automatic token refresh, and multi-tab sync.
- **PDF Report Generation**: Instant viewing and export of formal verification detection certificates.

---

## 🛠 Tech Stack

- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS (Semantic CSS variables)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6, HashRouter for zero-config static hosting)
- **Auth**: Supabase Auth JS SDK
- **HTTP Client**: Native Fetch API / Axios

---

## 📁 Directory Structure

```
Image-Detection-Frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── auth/              # AuthProvider, AuthContext, Supabase auth service
│   ├── components/        # Sidebar, Header, ResultCard, UploadBox, ProtectedRoute
│   ├── lib/               # Supabase client singleton configuration
│   ├── pages/             # Dashboard, Analyze, Results, History, Reports, Settings, Model
│   ├── services/          # Backend API client (REST endpoints, signed URLs)
│   ├── types/             # TypeScript schemas & interfaces
│   ├── App.tsx            # Main shell layout with sidebar and header
│   ├── index.css          # Semantic CSS variables for Light and Dark themes
│   └── main.tsx           # React DOM root entry
├── .env.example           # Template for environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Semantic design tokens mapped to CSS variables
├── tsconfig.json          # Strict TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following variables:

```env
# Backend API URL (FastAPI)
VITE_API_URL=http://127.0.0.1:8000/api

# Supabase Auth & Storage (Client-Safe Public Keys ONLY)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Important**: Never add `SUPABASE_SERVICE_ROLE_KEY` to the frontend `.env`. Only publishable anonymous keys belong in client-side bundles.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Generates minified static assets in `dist/`.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment Guide

### Deploying to Vercel
1. Push this folder to a GitHub repository.
2. Import repository in [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Configure Environment Variables (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Click **Deploy**.

### Deploying to Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add environment variables in Netlify site settings.
5. Deploy.

---

## 📄 License
MIT License. Created for production-grade image detection and verification workflows.
