# Fashion-E-Commerce UI Setup - Quick Start Guide

## Current Status

✅ **UI Framework**: Tailwind CSS is properly installed and working
- The styling shown in the screenshot (navbar, menu, layout) is all from Tailwind CSS
- Material UI is NOT needed - Tailwind is the design framework being used

✅ **Frontend**: Ready at `localhost:5174` (or port 5173 if available)
- Vite dev server is configured
- React components are set up
- All dependencies installed

✅ **Backend**: Spring Boot API server ready on `localhost:8080`
- Database migrations completed (Flyway V1 + V2)
- PostgreSQL database `fashiona_db` is set up
- Security configuration updated for CORS

## What to Do Now

### 1. Start the Backend (Terminal 1)
```bash
cd /Users/rushichennuri/Desktop/App_creation/fashion-ecommerce/backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

### 2. Start the Frontend (Terminal 2)
```bash
cd /Users/rushichennuri/Desktop/App_creation/fashion-ecommerce/frontend
npm run dev
```

The frontend will start on `http://localhost:5173` or `http://localhost:5174`

### 3. Access the Application
Open your browser and go to: `http://localhost:5173` (or 5174)

## Key Files Modified

1. **Frontend API Configuration**
   - Created: `src/utils/api.js` - API client with all endpoints
   - Created: `src/hooks/useFetch.js` - Custom React hooks for data fetching
   - Created: `.env` - Environment variables for API URL

2. **Backend Security**
   - Updated: `SecurityConfig.java` - CORS enabled for localhost:5173 and 5174
   - Fixed: GET endpoints for products, categories, and reviews are public

3. **Database Seed Data**
   - Fixed: `V2__seed_data.sql` - Corrected NULL values for coupon usage_limit

4. **Lombok Version**
   - Updated: `pom.xml` - Upgraded Lombok to 1.18.38 for Java 21 compatibility

## API Endpoints Available

- `GET /api/v1/products` - Get all products (paginated)
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- And more... (see `src/utils/api.js`)

## Troubleshooting

### If Backend won't start on port 8080:
```bash
# Kill any existing process on 8080
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Then retry mvn spring-boot:run
```

### If Frontend won't connect to Backend:
- Check that backend is running on 8080
- Check browser console (F12) for CORS errors
- Verify `.env` file has correct API URL

### PostgreSQL Issues:
```bash
# Check PostgreSQL status
pg_isready

# If needed, recreate database:
psql -h 127.0.0.1 -d postgres -c "DROP DATABASE IF EXISTS fashiona_db;"
psql -h 127.0.0.1 -d postgres -c "CREATE DATABASE fashiona_db OWNER fashiona_user;"
```

## Next Steps

1. Frontend will automatically fetch products from backend API
2. Components will display real data instead of mock data
3. Cart, wishlist, and checkout features will work with actual backend

Enjoy! 🚀
