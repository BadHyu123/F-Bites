# F-Bites — Full-Stack Food Delivery App

Documentação completa de setup, estrutura projeto, e guia chạy ứng dụng.

## 🎯 Tổng quan dự án

F-Bites là một nền tảng bán thức ăn với role hệ thống:
- **Buyer**: Mua đồ ăn, đặt hàng
- **Seller**: Bán đồ ăn, quản lý sản phẩm
- **Admin**: Duyệt shop, thống kê toàn hệ

**Tech Stack:**
- **Frontend**: React 18 + Vite + Tailwind CSS + Leaflet (Map)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: MySQL (Railway cloud)
- **Auth**: JWT (7 days expiry)

---

## 📂 Cấu trúc dự án

```
F-Bites/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # UI components (BottomNav, Header, ProductCard, etc.)
│   │   ├── pages/           # Page components (Auth, Home, Cart, Orders, etc.)
│   │   │   ├── admin/       # Admin Dashboard
│   │   │   ├── buyer/       # Buyer pages (Home, Cart, Checkout, Product Detail, etc.)
│   │   │   └── seller/      # Seller pages (Dashboard, ProductForm, ProductList, Orders, etc.)
│   │   ├── context/         # React Context (AppContext for global state)
│   │   ├── hooks/           # Custom hooks (useApp)
│   │   ├── layouts/         # Layout components
│   │   ├── routes/          # React Router config
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities (mockData, etc.)
│   ├── index.html           # HTML entry point
│   ├── index.tsx            # React DOM render
│   ├── vite.config.ts       # Vite config
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Route handlers (authController, productController, etc.)
│   │   ├── middleware/      # Express middleware (auth, error handling)
│   │   ├── routes/          # API routes (authRoutes, productRoutes, etc.)
│   │   └── index.ts         # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (User, Product, Order, OrderItem)
│   │   └── seed.ts          # Database seeding script
│   ├── .env                 # Environment variables (DATABASE_URL, JWT_SECRET)
│   ├── .env.example         # Example .env template
│   └── package.json         # Backend dependencies
│
├── package.json             # Root workspace package.json
└── README.md                # Main README (này)
```

---

## 🚀 Cài đặt & Chạy

### Prerequisites
- **Node.js 18+** và **npm**
- **MySQL 8** (hoặc dùng cloud database như Railway)
- **Git**

### 1. Clone repo & cài dependencies

```bash
# Clone project
git clone <repo-url>
cd F-Bites

# Cài dependencies cho root, client, backend
npm install
npm --prefix client install
npm --prefix backend install
```

### 2. Cấu hình Environment (.env)

Backend cần `.env` với:

```bash
# backend/.env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/fbites_db"
JWT_SECRET="fbites_secret_2025_!@#"
```

Nếu dùng Railway:
```
DATABASE_URL="mysql://user:pass@switchyard.proxy.rlwy.net:port/fbites_db"
```

### 3. Database Setup

```bash
# Sinh Prisma Client
npm --prefix backend run db:generate

# Chạy migrations để tạo schema
npm --prefix backend run db:migrate

# Seed database với mock data
npm --prefix backend run db:seed
```

Output seed:
```
✅ Seeding completed!
   - Admin: admin@fbites.com / admin123
   - Buyer: buyer@fbites.com / buyer123
   - Sellers: seller1@fbites.com, seller2@fbites.com / seller123
   - Products: 4 products (Bánh mì, Cơm, etc.)
```

### 4. Chạy Development Servers

**Terminal 1 — Frontend**
```bash
npm run client:dev
# Mở http://localhost:5173
```

**Terminal 2 — Backend**
```bash
npm run server:dev
# API tại http://localhost:5000
```

**Terminal 3 — Database GUI (optional)**
```bash
npm --prefix backend run db:studio
# Prisma Studio tại http://localhost:5555
```

---

## 🔑 Accounts Mẫu (Từ Seed)

| Email | Password | Role |
|-------|----------|------|
| admin@fbites.com | admin123 | ADMIN |
| buyer@fbites.com | buyer123 | BUYER |
| seller1@fbites.com | seller123 | SELLER |
| seller2@fbites.com | seller123 | SELLER |

---

## 📡 API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
Body: { name, email, password, role: 'BUYER'|'SELLER' }

# Login
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

### Products
```bash
# List all products
GET /api/products?sellerId=xxx&category=xxx

# Get single product
GET /api/products/:id

# Create product (require SELLER role + token)
POST /api/products
Headers: { Authorization: "Bearer <token>" }
Body: { name, description, originalPrice, discountedPrice, quantity, expiryTime, category, image, lat, lng, address }
```

### Orders
```bash
# List user's orders (require token)
GET /api/orders
Headers: { Authorization: "Bearer <token>" }

# Create order (require token)
POST /api/orders
Headers: { Authorization: "Bearer <token>" }
Body: { items: [{ productId, quantity }], type: 'DELIVERY'|'PICKUP', deliveryAddress? }

# Update order status (require token)
PUT /api/orders/:orderId/status
Body: { status: 'PENDING'|'PREPARING'|'READY'|'COMPLETED'|'CANCELLED' }
```

### Users
```bash
# Get profile (require token)
GET /api/users/profile
Headers: { Authorization: "Bearer <token>" }

# Update profile (require token)
PUT /api/users/profile
Headers: { Authorization: "Bearer <token>" }
Body: { name, phone, shopName, shopAddress }
```

### Admin
```bash
# Get pending shops
GET /api/admin/pending-shops
Headers: { Authorization: "Bearer <admin-token>" }

# Approve shop
PUT /api/admin/approve/:userId
Headers: { Authorization: "Bearer <admin-token>" }

# Reject shop
DELETE /api/admin/reject/:userId
Headers: { Authorization: "Bearer <admin-token>" }

# Get admin stats
GET /api/admin/stats
Headers: { Authorization: "Bearer <admin-token>" }
```

---

## 🧪 Testing API (PowerShell Example)

```powershell
# Login & get token
$loginBody = '{"email":"buyer@fbites.com","password":"buyer123"}'
$auth = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' `
  -Method Post -ContentType 'application/json' -Body $loginBody
$token = $auth.token

# Get products
Invoke-RestMethod -Uri 'http://localhost:5000/api/products' -Method Get

# Get user profile
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri 'http://localhost:5000/api/users/profile' `
  -Method Get -Headers $headers
```

---

## 📝 Scripts Úteis

### Root-level Commands

```bash
# Client
npm run client:dev      # Frontend dev server
npm run client:build    # Build frontend
npm run client:preview  # Preview production build

# Server
npm run server:dev      # Backend dev server
npm run server:build    # Build backend
npm run server:start    # Start production backend

# Database
npm --prefix backend run db:generate    # Prisma client
npm --prefix backend run db:migrate     # Run migrations
npm --prefix backend run db:push        # Sync schema
npm --prefix backend run db:seed        # Add seed data
npm --prefix backend run db:studio      # Prisma GUI
```

---

## 🔐 Architecture Highlights

### Frontend (React)
- **Global State**: `AppContext` (user, products, cart, orders, wishlist, vouchers)
- **Routing**: React Router với protected routes (Auth, Buyer, Seller, Admin)
- **Styling**: Tailwind CSS + responsive mobile-first design
- **Map**: Leaflet integration (show sellers location)

### Backend (Express)
- **ORM**: Prisma — type-safe database queries
- **Auth**: JWT tokens với roles (BUYER, SELLER, ADMIN)
- **Middleware**: `protect` (auth), `sellerOnly`, `adminOnly`
- **Database**: MySQL với schema (User, Product, Order, OrderItem)
- **Timestamps**: `createdAt`, `updatedAt` tự khóa trên tất cả models

### Database Schema
```sql
-- Users
User (id, name, email, password, phone, role, isApproved, shopName, shopAddress)

-- Products
Product (id, sellerId, name, description, originalPrice, discountedPrice, 
         quantity, expiryTime, category, image, lat, lng, address, isDeleted)

-- Orders (grouped by seller từ cart)
Order (id, buyerId, sellerId, total, shippingFee, status, type, 
       deliveryAddress, pickupCode, createdAt)

-- Order Items
OrderItem (id, orderId, productId, quantity, price)
```

---

## 🚢 Deployment Checklist

- [ ] Build frontend: `npm run client:build`
- [ ] Build backend: `npm run server:build`
- [ ] Set production environment variables in hosting
- [ ] Run migrations on production database
- [ ] Run `npm run server:start` để khởi động backend
- [ ] Serve frontend static build từ server

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check .env exists
cat backend/.env

# Check MySQL connection
npm --prefix backend run db:push

# Rebuild Prisma client
npm --prefix backend run db:generate
```

### Frontend issues
```bash
# Clear Vite cache
rm -rf client/.vite

# Reinstall dependencies
rm -rf client/node_modules client/package-lock.json
npm --prefix client install
```

### Database issues
```bash
# View database with Prisma Studio
npm --prefix backend run db:studio

# Reset database (WARNING: deletes all data)
npm --prefix backend run db:seed
```

---

## 📚 Documentation References

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Leaflet Docs](https://leafletjs.com/)
- [React Router Docs](https://reactrouter.com)

---

**Last Updated**: Feb 8, 2026  
**Version**: 0.0.0 (Development)
