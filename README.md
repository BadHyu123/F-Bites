# F-Bites — Full-Stack Food Delivery App

This repository contains the F-Bites full-stack application: a food rescue marketplace with three roles (Buyer, Seller, Admin). The frontend is built with React + Vite and the backend uses Node.js, Express, TypeScript and Prisma (MySQL).

## Quickstart (English)

Prerequisites
- Node.js 18+ and npm
- MySQL 8 (or a cloud MySQL service such as Railway)
- Git

Install and run

```bash
# From repository root, install both Frontend and Backend dependencies
npm --prefix client install
npm --prefix backend install

# Generate Prisma client and push schema to DB
cd backend
npm run db:generate
npm run db:push
npm run db:seed

# In one terminal, start backend
npm run dev

# In another terminal, start frontend
cd ../client
npm run dev
```

Then open **http://localhost:3000** in your browser.

Environment

Create `backend/.env` (or copy `.env.example`) and set at minimum:

```bash
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/fbites_db"
JWT_SECRET="fbites_secret_2025_!@#"
```

Seeded demo accounts (local dev)
- Admin (trial): admin@test.com / 123456
- Buyer (trial): buyer@test.com / 123456
- Seller (trial): seller@test.com / 123456

There are also primary demo accounts created by the seed (admin@fbites.com / admin123, buyer@fbites.com / buyer123, seller1/seller2@fbites.com / seller123).

Run development servers

```powershell
# Backend (API)
cd backend
npm run dev

# Frontend (in another terminal)
cd client
npm run dev

# Prisma Studio (optional GUI)
npm --prefix backend run db:studio
```

Default URLs
- Frontend: http://localhost:3000 (Vite)
- Backend API: http://localhost:5000

API overview

Authentication
```
POST /api/auth/register
Body: { name, email, password, role: 'BUYER'|'SELLER' }

POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

Products
```
GET /api/products?sellerId=xxx&category=xxx
GET /api/products/:id
POST /api/products  (requires SELLER + Authorization header)
```

Orders
```
GET /api/orders  (requires Authorization)
POST /api/orders  (requires Authorization)
PUT /api/orders/:orderId/status  (requires Authorization)
```

Users
```
GET /api/users/profile  (requires Authorization)
PUT /api/users/profile  (requires Authorization)
```

Admin endpoints
```
GET /api/admin/pending-shops  (admin)
PUT /api/admin/approve/:userId  (admin)
DELETE /api/admin/reject/:userId  (admin)
GET /api/admin/stats  (admin)
```

Scripts

```bash
# Frontend
npm run client:dev
npm run client:build

# Backend
npm run server:dev
npm run server:build
npm run server:start

# Database
npm --prefix backend run db:generate
npm --prefix backend run db:migrate
npm --prefix backend run db:seed
npm --prefix backend run db:studio
```

Deployment checklist
- Build frontend: `npm run client:build`
- Build backend: `npm run server:build`
- Set production environment variables on your host
- Run migrations on production database
- Start backend with `npm run server:start`

Troubleshooting

- If the backend fails to start, verify `backend/.env` and DB connectivity and run `npm --prefix backend run db:push` and `npm --prefix backend run db:generate`.
- For frontend issues, clear Vite cache (`rm -rf client/.vite`) and reinstall client dependencies.

References
- Vite: https://vitejs.dev
- React: https://react.dev
- Express: https://expressjs.com
- Prisma: https://www.prisma.io/docs

Last Updated: Feb 8, 2026


