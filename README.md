# 📞 Telecom Billing API

*Temporary docs* — telecom billing API (plans, subscriptions, usage, invoices). Backend: Express + Prisma + PostgreSQL. Frontend: React.

## 🚀 Quick start

```bash
# Backend (port 8000)
npm install && npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (port 5173) — in a separate terminal
cd frontend && npm install && npm run dev
```

**Env:** In project root create `.env` with `DATABASE_URL`, `JWT_SECRET`. In `frontend`: `VITE_API_URL=http://localhost:8000/api`.

**Test login:** `jan.kowalski@example.com` / `password123`

## 📡 API (base: `/api`)

- **Auth:** `POST /auth/login`, `GET /auth/me`
- **Users:** `GET /users`, `GET /users/:id`, `GET /users/email/:email`
- **Plans:** `GET /plans`, `GET /plans/:id`
- **Subscriptions:** `GET|POST /subscriptions`, `GET|DELETE /subscriptions/:id`, `GET /subscriptions/:id/usage`, `GET /subscriptions/:id/invoices`
- **Usage:** `GET /usage/:id`, `POST /usage`
- **Invoices:** `GET /invoices`, `GET /invoices/:id`, `PATCH /invoices/:id/pay`

## 🛠️ Stack

**Backend:** Express 5, Prisma 7, PostgreSQL, JWT, Zod.  
**Frontend:** React 19, Vite 7, Tailwind, React Router.
