#🏫 School Payment & Dashboard Application

Full-stack app to manage school payments, transactions, and status tracking with a modern React dashboard.

**🌐 Live URLs**

Frontend (Vercel): https://your-frontend.vercel.app

Backend API (Railway/Render): https://your-backend.onrailway.app

API Docs (Swagger): https://your-backend.onrailway.app/api

Replace the placeholders after you deploy.

**🏗️ Architecture**
Frontend (Vercel)  ⇄  Backend API (Railway/Render)  ⇄  MongoDB Atlas


**📦 Packages**
school-payment-app/
├─ backend/    # NestJS API (MongoDB, JWT, Webhooks)
└─ frontend/   # React + Vite + Tailwind dashboard (SPA)

**🛠 Tech Stack**

Backend: NestJS, MongoDB Atlas (Mongoose), JWT, Swagger
Frontend: React, TypeScript, Vite, Tailwind CSS (dark mode, custom animations)
Tooling: Axios, React Router, Postman, ESLint/Prettier

**✨ Screens (Frontend)**

Login • Create Payment • All Transactions • Transaction Status • Analytics • Schools • Settings • Help & Support


**✨ Key Features**

🔐 JWT Auth (login protects API routes)

💳 Create payment (proxy to payment gateway; redirect user to hosted page)

🧾 Webhook to update transaction status

📊 Transactions table (search, filter, sort, paginate)

🔎 Status lookup by custom_order_id

🌓 Dark/Light theme, responsive UI

**🚀 Quick Start (Local)**

Prerequisites

Node.js 18+

MongoDB Atlas connection string

Payment gateway credentials (store in backend .env)

1) Backend (NestJS)
cd backend
npm install
cp .env.example .env         # fill values (see below)
npm run start:dev            # (http://localhost:5173)


Backend .env (example)

# server
PORT=3001
NODE_ENV=development

# database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/school-payments

# auth
JWT_SECRET=your-very-secret
JWT_EXPIRES_IN=1d

# CORS
FRONTEND_URL=http://localhost:5173

# Payment provider (placeholders)
PG_KEY=pg_test_key
PAYMENT_API_KEY=replace_with_real_token
SCHOOL_ID=65b0e6293e9f76a9694d84b4

2) Frontend (Vite + Tailwind)
cd frontend
npm install
cp .env.example .env         # fill values (see below)
npm run dev                  # http://localhost:5173


Frontend .env (example)

VITE_APP_BASE_URL=http://localhost:5173
VITE_APP_NAME=School Payment Dashboard


Tailwind note: files in public/ are served from /.
Example background: bg-[url('/images/university-background.jpg')] or style={{ backgroundImage: "url('/images/university-background.jpg')" }}.

🔌 API Overview
Auth

POST /auth/login → returns JWT

Payments

POST /create-payment → creates payment with provider, returns redirect URL to hosted payment page

Webhook

POST /webhook → provider calls this; updates transaction status in DB





**WebhookLog**

Raw webhook payloads + timestamps (for audit/debug)

Add indexes on: school_id, custom_order_id, collect_id, payment_time for performance.

**🧭 Frontend Pages**

Login (JWT auth)

Transactions Overview (table with search, sort, filters, pagination; URL persists filters)

By School (transactions for a specific school_id)

Status Check (input custom_order_id → show current status)

Global dark/light toggle; animated components via Tailwind keyframes.

**🧪 Testing**

Use Postman (recommended):

Import collection from ./docs/postman_collection.json (add one)

Environment: local (localhost), dev (Railway), etc.

Unit tests (optional): npm run test in backend.

**🚀 Deployment**
Create an account, connect GitHub repository.

Set Root Directory = backend.

Set Build Command = npm install && npm run build (if applicable)
Start Command = npm run start:prod (or npm run start)

Add Environment Variables from .env (don’t commit secrets).

Ensure CORS allows your frontend domain.

Open Swagger at /api.

Frontend → Vercel

Connect GitHub repository.

Set Root Directory = frontend.

Framework Preset = Vite
Build Command = npm run build
Output Directory = dist



}


Frontend calls to /api/... will proxy to your backend (no CORS headaches).

🛡️ Production Checklist

 Disable wildcard CORS; allow only your frontend domain.

 Use long, strong JWT_SECRET; set sensible expiry.

 Ensure webhook route is publicly reachable and logs every event.

 Create MongoDB indexes (school_id, custom_order_id, collect_id, payment_time).

 Add pagination defaults (limit=25, page=1), max limit cap.

 Validate & sanitize all inputs.

 Turn on HTTPS (hosted providers do this by default).

 Rotate API keys and store in envs (never commit).

**🧰 Useful Commands**

Backend

npm run start:dev     # dev
npm run build         # build (if using Nest build)
npm run start:prod    # production


Frontend

npm run dev           # dev server
npm run build         # vite build → dist/
npm run preview       # preview production build

**🐞 Troubleshooting**

Frontend 404s on refresh → Ensure vercel.json SPA rewrite.

Images not loading → Put under frontend/public/ and reference as /images/....

CORS errors → Either allow your Vercel domain in backend CORS or use the /api proxy in vercel.json.

“Missing script: build” → Run in frontend/ and ensure package.json has "build": "vite build".

**🤝 Contributing**

Fork the repo & create a feature branch.

Commit with clear messages.

Open a Pull Request with screenshots and notes.

📄 License

MIT



