# School Payment & Dashboard — Backend API

NestJS-based backend for managing school payments, transactions, authentication, and webhooks.

---

## 📂 Folder Structure

```
backend/
├─ dist/               # Compiled output (after build)
├─ node_modules/       # Dependencies
├─ src/                # Source code
│  ├─ auth/            # Authentication (login, register, JWT)
│  ├─ common/          # Shared utilities, interceptors, guards
│  ├─ config/          # Configuration and environment loading
│  ├─ orders/          # Order handling logic
│  ├─ payments/        # Payment initiation, provider integration
│  ├─ webhooks/        # Webhook endpoint and event processing
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  └─ main.ts          # Entry point
├─ .env                # Environment variables (not committed)
├─ .eslintrc.js        # ESLint config
├─ .gitignore          # Git ignore rules
├─ .prettierrc         # Prettier formatting rules
├─ nest-cli.json       # Nest CLI config
├─ package.json        # Scripts + dependencies
├─ package-lock.json
├─ README.md           # Project readme (this file)
├─ tsconfig.json       # TypeScript config
└─ tsconfig.build.json # Build-specific TS config
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run start:dev
```

---

## 📋 Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-payment-db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long



# JWT Configuration
JWT_SECRET=sch00l_p4ym3nt_sup3r_s3cr3t_k3y_2024_v3ry_l0ng_4nd_s3cur3_r4nd0m_str1ng
JWT_EXPIRATION=24h

# Edviron Payment Gateway Configuration

EDVIRON_API_BASE_URL=https://dev-vanilla.edviron.com/erp
EDVIRON_API_KEY=
PG_KEY=
PG_SECRET_KEY= was not given in the pdf

# School Configuration
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔌 API Endpoints

### Authentication

* `POST /auth/login` → User login
* `POST /auth/register` → User registration

### Payments

* `POST /payments/create` → Create a payment request
* `POST /webhook` → Handle payment webhooks

### Transactions

* `GET /transactions` → Get all transactions
* `GET /transactions/school/:schoolId` → Get transactions for a specific school
* `GET /transactions/status/:orderId` → Check transaction status

---

## 📖 API Documentation

Visit `http://localhost:3000/api` after running the backend for Swagger UI.

---

## 🚀 Deployment (Railway / Render)

1. Connect GitHub repository
2. Set **Root Directory** to `backend/` (if monorepo)
3. Add environment variables from `.env`
4. Deploy automatically

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=[https://your-frontend-domain.vercel.app](https://school-payment-portal-8q4bh4xns-modaksanikas-projects.vercel.app/)
NODE_ENV=production
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test


```

---
The PG secret key was not provided, so the payment could not be processed.
