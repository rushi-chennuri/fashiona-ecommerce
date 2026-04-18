# 👗 FASHIONA — Premium Fashion E-Commerce Platform

A **full-stack** fashion e-commerce solution with a React web app, Java Spring Boot API, PostgreSQL database, and a React Native mobile app for both iOS & Android.

---

## 🏗️ Project Structure

```
fashion-ecommerce/
├── frontend/          React 18 + Vite + Tailwind CSS  (web)
├── backend/           Java 17 + Spring Boot 3 + JWT   (REST API)
├── database/          PostgreSQL schema + seed data   (Flyway migrations)
└── mobile/            React Native 0.73               (iOS & Android)
```

---

## ✨ Features

### 🌐 Web Frontend
- Animated hero carousel with auto-slide
- 8 product categories: Sarees, Dresses, Shoes, Watches, Caps, Slippers, Kurtas, Accessories
- Advanced product grid — search, filter by category / price / rating, sort, list/grid toggle
- Rich product detail page — image gallery, size & color selector, pincode delivery check
- Persistent cart drawer with free-shipping progress bar & coupon code
- 3-step checkout — address → payment (Card / UPI / COD / Net banking) → review
- Wishlist with move-all-to-cart
- User account — orders, profile, addresses, notifications
- Search modal with recent searches & trending keywords
- Toast notifications, SEO meta tags

### ⚙️ Backend API
- RESTful endpoints for products, orders, users, auth, reviews, coupons
- JWT authentication (access token + refresh)
- Role-based access control (CUSTOMER / ADMIN / SELLER)
- Full-text product search with PostgreSQL `pg_trgm`
- Spring Cache for hot endpoints
- Soft-delete on products
- Loyalty points system
- Razorpay / Stripe payment integration hooks
- Cloudinary image upload hooks
- Swagger UI at `/api/swagger-ui.html`

### 🗄️ Database
- Flyway migrations (V1 schema + V2 seed data)
- 14 tables with proper indexes and foreign keys
- Auto-updated `updated_at` triggers
- Soft delete, UUID primary keys, full-text search index

### 📱 Mobile App (iOS + Android)
- React Navigation bottom tabs
- Home screen with banner carousel, categories, featured products
- Product detail with image gallery, size/color picker, add to cart
- Cart screen with quantity controls & order summary
- Zustand global state (cart, wishlist, auth)
- Axios API client with JWT interceptor
- React Native Reanimated animations

---

## 🚀 Quick Start

### Prerequisites
| Tool | Version |
|------|---------|
| Node.js | 20+ |
| Java | 17+ |
| Maven | 3.9+ |
| PostgreSQL | 15+ |
| React Native CLI | latest |
| Xcode (iOS) | 15+ |
| Android Studio | latest |

---

### 1️⃣ Database Setup

```bash
# Create database and user
psql -U postgres << 'SQL'
  CREATE DATABASE fashiona_db;
  CREATE USER fashiona_user WITH PASSWORD 'fashiona_pass';
  GRANT ALL PRIVILEGES ON DATABASE fashiona_db TO fashiona_user;
SQL

# Flyway migrations run automatically on backend startup
# OR run manually:
cd backend
mvn flyway:migrate
```

---

### 2️⃣ Backend (Spring Boot)

```bash
cd backend

# Copy and edit environment config
cp src/main/resources/application.yml src/main/resources/application-local.yml

# Set your values in application-local.yml:
#   spring.datasource.username / password
#   jwt.secret
#   cloudinary.*  (optional – image uploads)
#   razorpay.*    (optional – payments)

# Run the API server
mvn spring-boot:run -Dspring-boot.run.profiles=local

# API will be available at:  http://localhost:8080/api
# Swagger UI:                http://localhost:8080/api/swagger-ui.html
```

**Key API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, get JWT |
| `GET`  | `/api/v1/products` | List / search / filter products |
| `GET`  | `/api/v1/products/{id}` | Product detail |
| `GET`  | `/api/v1/products/featured` | Featured products |
| `POST` | `/api/v1/orders` | Place order |
| `GET`  | `/api/v1/orders/my` | User order history |

---

### 3️⃣ Frontend (React + Tailwind)

```bash
cd frontend

# Install dependencies
npm install

# Start development server (proxies /api → localhost:8080)
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

---

### 4️⃣ Mobile App (React Native)

```bash
cd mobile

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on Android emulator
npx react-native run-android

# Run on iOS simulator
npx react-native run-ios

# Run on physical device (Android)
# 1. Enable USB debugging on your device
# 2. Connect via USB
npx react-native run-android

# Run on physical device (iOS)
# Open ios/FashionaApp.xcworkspace in Xcode
# Select your device and hit Run
```

> **Note:** For Android emulator the API URL is `http://10.0.2.2:8080`.  
> For physical devices, replace with your machine's local IP, e.g. `http://192.168.1.x:8080`.

---

## 🔑 Default Credentials (seed data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fashiona.com | Admin@123 |
| Customer | rushi@fashiona.com | Test@1234 |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | React 18, Vite, Tailwind CSS 3 |
| Mobile | React Native 0.73, React Navigation 6 |
| State (Web) | React Context + useReducer |
| State (Mobile) | Zustand |
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| ORM | Spring Data JPA, Hibernate |
| Database | PostgreSQL 15 |
| Migrations | Flyway |
| Auth | JWT (jjwt 0.11) |
| API Docs | SpringDoc OpenAPI 3 (Swagger UI) |
| Payments | Razorpay + Stripe (hooks ready) |
| Images | Cloudinary (hooks ready) |
| Build Tool | Maven |
| Bundler | Vite |

---

## 📁 Key Files Reference

```
frontend/src/
  App.jsx                   # Root app + routing
  context/AppContext.jsx     # Cart, wishlist, toast state
  data/products.js           # Product catalogue (mock data)
  pages/HomePage.jsx         # Hero, categories, featured, testimonials
  pages/ProductsPage.jsx     # Search, filter, sort, grid/list
  pages/ProductDetailPage.jsx# Gallery, size/color, cart, checkout
  pages/CheckoutPage.jsx     # 3-step checkout flow
  pages/WishlistPage.jsx     # Saved products
  pages/AccountPage.jsx      # Login/register, orders, profile
  components/Navbar.jsx      # Responsive navbar + mega menu
  components/CartDrawer.jsx  # Slide-out cart
  components/SearchModal.jsx # Full-screen search overlay
  components/Footer.jsx      # Full footer

backend/src/main/java/com/fashion/
  model/           # JPA Entities (User, Product, Order, …)
  repository/      # Spring Data JPA repositories
  service/         # Business logic
  controller/      # REST controllers
  config/          # Security, JWT, CORS

database/
  V1__init_schema.sql        # Full DB schema
  V2__seed_data.sql          # Categories, products, users, coupons

mobile/src/
  screens/HomeScreen.js       # Home with banner & products
  screens/ProductDetailScreen.js
  screens/CartScreen.js
  navigation/AppNavigator.js  # Tab + Stack navigation
  store/useStore.js           # Zustand store
  api/api.js                  # Axios API client
  utils/theme.js              # Colors, fonts, helpers
```

---

## 🌐 Environment Variables

Create a `.env` file in `backend/` (or set as system env vars):

```env
DB_USERNAME=fashiona_user
DB_PASSWORD=fashiona_pass
JWT_SECRET=your-super-secret-key-minimum-32-chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_smtp_password
```

---

## 📦 Product Categories & Inventory

| Category | Products | Description |
|----------|---------|-------------|
| 🥻 Sarees | 248+ | Silk, cotton, chiffon, georgette |
| 👗 Dresses | 315+ | Maxi, bodycon, midi, anarkali |
| 👠 Shoes | 192+ | Heels, sandals, sneakers, juttis |
| ⌚ Watches | 87+ | Luxury, smart, vintage |
| 🧢 Caps & Hats | 143+ | Baseball, beanies, sun hats |
| 🩴 Slippers | 168+ | Slides, flip-flops, foam |
| 👘 Kurtas | 201+ | Men's & women's ethnic wear |
| 💍 Accessories | 312+ | Jewellery, bags, sunglasses |

---

*Built with ❤️ for Fashiona — Premium Fashion Store*
