# 📞 Telecom Billing API

⚠️ This project is currently a work-in-progress. I am actively adding new features, refining the architecture, and improving the codebase.


<div align="center">
  <img src="https://github.com/user-attachments/assets/27c2fc3d-5c56-4b75-9e7c-394de6abd0ec" width="80%">
  <p><i>Screenshot updated: 12.02.2026</i></p>
</div>

## ✨ What this project includes

- **Domain model**: plans, subscriptions, usage records, invoices and invoice statuses.
- **REST API**: Express routes and controllers for auth, plans, subscriptions and invoices.
- **Validation & errors**: Zod-based request validation and centralized error handling.
- **Authentication**: JWT login, `auth` middleware and user-scoped data (`/auth/me`, protected routes).
- **Frontend dashboard**: React + shadcn UI for login and dashboard components.
- **Admin endpoints (planned)**: backend routes for `Users` and `Usage` exist, planned for admin panel.

## 🚀 Quick start

```bash
# Backend (port 8000)
npm install
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run dev

# Frontend (port 5173) — in a separate terminal
cd frontend
npm install
npm run dev
```

**Env:** In project root create `.env` with `DATABASE_URL`, `JWT_SECRET`. In `frontend`: `VITE_API_URL=http://localhost:8000/api`.

**Test login:** `jan.kowalski@example.com` / `password123`

## 📡 API (base: `/api`)

- **Auth:** `POST /auth/login`, `GET /auth/me`
- **Plans:** `GET /plans`, `GET /plans/:id`
- **Subscriptions:** `GET /subscriptions`, `POST /subscriptions`, `GET /subscriptions/:id`, `GET /subscriptions/:id/usage`, `GET /subscriptions/:id/invoices`
- **Invoices:** `GET /invoices`, `GET /invoices/:id`, `PATCH /invoices/:id/pay`

_Planned (admin-only, currently disabled):_

- **Users:** `GET /users`, `GET /users/:id`, `GET /users/email/:email`
- **Usage:** `GET /usage/:id`, `POST /usage`

## 🧱 Architecture overview

- **Backend**
  - Node.js + Express 5, modular routers (`/auth`, `/plans`, `/subscriptions`, `/invoices`).
  - Additional routers for `users` and `usage` are implemented but currently disabled in the main router (planned for admin panel).
  - Prisma ORM with PostgreSQL and a schema modeled for telecom billing (plans, usage, invoices).
  - Centralized validation (Zod) and error handling helpers.

- **Frontend**
  - React + Vite, dashboard-style UI using shadcn components.
  - Auth context with JWT storage, protected views, and basic routing.
  - Screens for login and an overview of subscriptions/invoices.

- **Billing logic**
  - Monthly invoices per subscription (unique `(subscriptionId, year, month)`).
  - Base plan fee + overage fees (minutes / data / SMS) calculated from usage aggregation.
  - Invoice statuses: `UNPAID`, `PAID`, `OVERDUE`, `CANCELLED` (with `paidAt` on payment).

## 🛠️ Stack

**Backend:** Express 5, Prisma 7, PostgreSQL, JWT, Zod.  
**Frontend:** React 19, Vite 7, Tailwind, React Router.
