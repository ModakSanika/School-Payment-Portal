# School Payment & Dashboard

Full-stack application to manage school payments, transactions and status tracking, with a modern React dashboard and a secure NestJS backend.

---

## 🚀 Live (Replace with your deployed URLs)

* **Frontend (Vercel):** `https://vercel.com/modaksanikas-projects/school-payment-portal/A9NkZpvDHWVwQZTQKnBuYpxhHFhG`


> Replace the placeholders above after deploying.

---

## 🏗 Architecture

**Frontend (Vercel)** ⇄ **Backend API (Railway/Render)** ⇄ **MongoDB Atlas**

* Frontend: React + Vite + Tailwind (SPA)
* Backend: NestJS + Mongoose + JWT

---

## ✨ Features

* 🔐 JWT authentication (protects API routes)
* 💳 Create payments — proxy to payment provider and return redirect URL to hosted checkout
* 🧾 Webhook endpoint that accepts provider callbacks and updates transaction status
* 📊 Transactions table with search, filter, sort, pagination and persistent URL filters
* 🔎 Status lookup by `custom_order_id`
* 🌓 Global dark/light theme with animated UI components
* 🛡 Webhook logging for audit and debugging

---

## 📦 Repo layout

```
school-payment-app/
├─ backend/    # NestJS API (MongoDB, JWT, Webhooks)
└─ frontend/   # React + Vite + Tailwind dashboard (SPA)
```

---

## 🛠 Tech Stack

* **Backend:** NestJS, MongoDB Atlas (Mongoose), JWT, Swagger
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Tooling:** Axios, React Router, Postman, ESLint, Prettier

---

## ✅ Quick Start (Local)

**Prerequisites**

* Node.js v18+
* MongoDB Atlas connection string
* Payment gateway credentials (store in backend `.env`)

### 1) Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env   # fill values
npm run start:dev       # http://localhost:3001 (or PORT from .env)
```

**Backend `.env` (example)**

```env
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
```

> Make sure to never commit `.env` or any secrets to source control.

### 2) Frontend (Vite + Tailwind)

```bash
cd frontend
npm install
cp .env.example .env  # fill values
npm run dev            # http://localhost:5173
```

**Frontend `.env` (example)**

```env
VITE_APP_BASE_URL=http://localhost:5173
VITE_APP_NAME=School Payment Dashboard
```

---

## 🔌 API Overview (Key endpoints)

**Auth**

* `POST /auth/login` → returns JWT

**Payments**

* `POST /create-payment` → create a payment with provider, returns `redirect_url` to hosted checkout

**Webhook**

* `POST /webhook` → provider calls this; backend validates and updates transaction status

**Utilities**

* `GET /transactions` → list transactions (with search, filter, sort, pagination)
* `GET /transactions/:id` → transaction details
* `GET /status?custom_order_id=<id>` → quick status lookup

> See Swagger UI at `/api` for full API contract and models.

---

## 🧵 Database notes

* Use MongoDB Atlas with collections for `transactions`, `schools`, `webhookLogs`, `users`.
* Indexes recommended: `school_id`, `custom_order_id`, `collect_id`, `payment_time`.
* WebhookLog stores raw payload and timestamp for audit.

---

## 🧪 Testing

* Import `./docs/postman_collection.json` into Postman to test endpoints.
* Environments: `local` (localhost), `dev` (Railway), `prod` (Vercel/Production host)
* Unit tests (backend optional):

```bash
cd backend
npm run test
```

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)

1. Connect your GitHub repo and point service to the `backend/` folder.
2. Set Environment Variables in the host dashboard (copy from `.env`).
3. Build Command: `npm install && npm run build` (if building)
4. Start Command: `npm run start:prod` or `npm run start`
5. Ensure CORS allows your frontend domain.
6. Visit `https://<your-backend>/api` for Swagger.

### Frontend (Vercel)

1. Connect GitHub repo and select `frontend/` as Root Directory.
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set environment variables in Vercel dashboard.
6. Optional: use `vercel.json` to rewrite `/api/*` to your backend to avoid CORS.

---

## 🔒 Production checklist

* Disable wildcard CORS; allow only the frontend domain.
* Use a long, strong `JWT_SECRET` and appropriate expiry.
* Ensure webhook route is publicly reachable and logs every event to `webhookLogs`.
* Create MongoDB indexes for query performance.
* Add pagination defaults (`limit=25`, `page=1`) and max limit cap.
* Validate & sanitize all inputs (especially webhook and payment inputs).
* Use HTTPS and rotate API keys regularly.

---

## 🐞 Troubleshooting (common issues)

* **Frontend 404s on refresh:** Ensure SPA rewrite configured in `vercel.json`.
* **Images not loading:** Place images in `frontend/public/` and reference with `/images/…`.
* **CORS errors:** Allow the Vercel domain in backend CORS or use Vercel proxy to backend (`/api`).
* **Missing script: build:** Ensure `package.json` in `frontend/` contains `"build": "vite build"`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with clear messages and tests (if applicable)
4. Open a Pull Request with description, screenshots, and migration notes

---

## 📸 Screenshots
### Login Page
## 📸 Screenshots

### Login
![Login](./frontend/public/images/Screenshots/Screenshot%20(479).png)

### Create Paymen
![Create Payment](./frontend/public/images/Screenshots/Screenshot%20(480).png)

### Analytics
![Analytics](./frontend/public/images/Screenshots/Screenshot%20(491).png)

### School Management
![School Management](./frontend/public/images/Screenshots/Screenshot%20(492).png)

### Settings
![Settings](./frontend/public/images/Screenshots/Screenshot%20(493).png)

### Help and Support
![Help and Support](./frontend/public/images/Screenshots/Screenshot%20(494).png)

### Transaction Status Check
![Transaction Status Check](./frontend/public/images/Screenshots/Screenshot%20(495).png)

### All Transactions
![All Transactions](./frontend/public/images/Screenshots/Screenshot%20(496).png)

### Extra
![Extra](./frontend/public/images/Screenshots/Screenshot%202025-09-17%20134951.png)








