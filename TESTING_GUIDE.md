# 🧪 Testing Guide - BusTickets Application

## 📋 Overview

This guide provides comprehensive instructions for testing your BusTickets application, including database setup, Stripe integration, and feature testing.

## 🗄️ Database Testing (Supabase)

### Prerequisites
- Supabase account at [supabase.com](https://supabase.com)
- Project created in Supabase

### Step 1: Setup Supabase Database

1. **Create a New Project**
   ```
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization and project name
   - Select region (choose closest to your users)
   - Create strong password
   ```

2. **Execute Database Schema**
   ```sql
   -- In Supabase SQL Editor, run the schema from:
   -- /docs/supabase-setup.sql
   
   -- This creates:
   -- ✅ All tables (users, routes, buses, trips, bookings, payments, etc.)
   -- ✅ Row Level Security policies
   -- ✅ Indexes for performance
   -- ✅ Custom functions and triggers
   ```

3. **Seed Sample Data**
   ```sql
   -- In Supabase SQL Editor, run the seed data from:
   -- /docs/supabase-seed.sql
   
   -- This creates:
   -- ✅ 5 test users (admin, customers, driver)
   -- ✅ 10 bus routes between major Brazilian cities
   -- ✅ 8 buses with different capacities and amenities
   -- ✅ 20 scheduled trips for testing
   -- ✅ Sample bookings and payments
   ```

### Step 2: Configure Environment Variables

1. **Get Supabase Connection Details**
   ```bash
   # In Supabase Dashboard > Settings > API
   Project URL: https://[project-ref].supabase.co
   Anon Public Key: eyJ... (anon key)
   Service Role Key: eyJ... (service role - keep secret!)
   ```

2. **Update Backend Environment**
   ```bash
   # Copy backend/.env.example to backend/.env
   cp backend/.env.example backend/.env
   
   # Update these values:
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
   ```

3. **Update Frontend Environment**
   ```bash
   # Copy frontend/.env.example to frontend/.env
   cp frontend/.env.example frontend/.env
   
   # Update these values:
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   REACT_APP_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   ```

### Step 3: Test Database Connection

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Test Database Connection**
   ```bash
   # Run a simple test query
   npx prisma db push --skip-generate
   
   # Check if tables exist
   npx prisma studio
   # This opens Prisma Studio in browser to view data
   ```

### Database Testing Checklist

- [ ] ✅ Schema created successfully
- [ ] ✅ Sample data loaded
- [ ] ✅ Row Level Security working
- [ ] ✅ Can view data in Supabase dashboard
- [ ] ✅ Prisma connection working
- [ ] ✅ Environment variables configured

---

## 💳 Stripe Testing

### Prerequisites
- Stripe account at [stripe.com](https://stripe.com)
- Test API keys obtained

### Step 1: Setup Stripe Account

1. **Create Stripe Account**
   ```
   - Go to https://stripe.com
   - Sign up for account
   - Complete verification
   - Get test API keys
   ```

2. **Get Test API Keys**
   ```bash
   # From Stripe Dashboard > Developers > API Keys
   Publishable Key: pk_test_...
   Secret Key: sk_test_...
   ```

3. **Configure Webhooks (Optional)**
   ```bash
   # For production payment confirmations
   Webhook URL: https://yourdomain.com/api/webhooks/stripe
   Events: payment_intent.succeeded, payment_intent.payment_failed
   ```

### Step 2: Configure Stripe Environment

1. **Update Backend Environment**
   ```bash
   # In backend/.env
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

2. **Update Frontend Environment**
   ```bash
   # In frontend/.env
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

### Step 3: Test Stripe Integration

1. **Test Card Numbers (Stripe Test Mode)**
   ```
   ✅ Successful Payment: 4242 4242 4242 4242
   ❌ Declined Payment: 4000 0000 0000 0002
   🔧 Requires Authentication: 4000 0025 0000 3155
   
   CVC: Any 3 digits
   Expiry: Any future date
   ZIP: Any 5 digits
   ```

2. **Payment Flow Testing**
   ```bash
   # Start the application
   cd frontend && npm start
   cd backend && npm run dev
   
   # Test steps:
   1. Search for trips
   2. Select a trip
   3. Choose seats
   4. Fill passenger info
   5. Go to payment
   6. Use test card: 4242 4242 4242 4242
   7. Verify payment success
   ```

### Stripe Testing Checklist

- [ ] ✅ Stripe account created
- [ ] ✅ Test API keys configured
- [ ] ✅ Payment form loads correctly
- [ ] ✅ Test card payments work
- [ ] ✅ Payment success page shows
- [ ] ✅ Payment failures handled gracefully
- [ ] ✅ Webhooks configured (if needed)

---

## 🔧 Feature Testing

### Authentication Testing

1. **User Registration**
   ```bash
   # Test cases:
   ✅ Valid registration with all fields
   ❌ Registration with invalid email
   ❌ Registration with weak password
   ❌ Registration with existing email
   ✅ Phone number formatting
   ✅ Password confirmation matching
   ```

2. **User Login**
   ```bash
   # Test cases:
   ✅ Valid login credentials
   ❌ Invalid email/password
   ✅ Redirect to dashboard after login
   ✅ Remember user session
   ✅ Logout functionality
   ```

### Search & Booking Testing

1. **Trip Search**
   ```bash
   # Test cases:
   ✅ Search with valid origin/destination
   ✅ Search with future date
   ❌ Search with past date
   ✅ Sort by price, time, duration
   ✅ No results found scenario
   ```

2. **Seat Selection**
   ```bash
   # Test cases:
   ✅ Select available seats
   ❌ Try to select occupied seats
   ✅ Multiple seat selection
   ✅ Seat deselection
   ✅ Visual seat map display
   ```

3. **Booking Flow**
   ```bash
   # Test cases:
   ✅ Complete booking with payment
   ✅ Passenger information validation
   ✅ CPF formatting and validation
   ✅ Booking summary accuracy
   ✅ Confirmation code generation
   ```

### Dashboard Testing

1. **User Dashboard**
   ```bash
   # Test cases:
   ✅ View upcoming bookings
   ✅ View past bookings
   ✅ Booking status display
   ✅ Trip details accuracy
   ✅ Total spent calculation
   ```

2. **Admin Dashboard**
   ```bash
   # Test cases:
   ✅ Admin-only access
   ✅ View all bookings
   ✅ User management (future)
   ✅ Route management (future)
   ```

---

## 🚀 End-to-End Testing Script

### Complete User Journey Test

```bash
# 1. Start Application
cd frontend && npm start &
cd backend && npm run dev &

# 2. Open browser to http://localhost:3001

# 3. Test Complete Flow
# Step 1: Register new user
# Step 2: Search for trip (São Paulo → Rio de Janeiro)
# Step 3: Select trip and seats
# Step 4: Fill passenger information
# Step 5: Complete payment with test card
# Step 6: Verify booking in dashboard
# Step 7: Test logout/login

# 4. Verify Database Records
# Check Supabase dashboard for new records in:
# - users table
# - bookings table
# - payments table
```

---

## 🐛 Common Issues & Solutions

### Database Issues

**Issue**: "Connection refused" to Supabase
```bash
# Solution:
1. Check DATABASE_URL format
2. Verify password contains no special characters that need encoding
3. Ensure project is not paused in Supabase
4. Check firewall/network restrictions
```

**Issue**: "Table doesn't exist" errors
```bash
# Solution:
1. Run schema creation in Supabase SQL Editor
2. Verify all tables created successfully
3. Check RLS policies are enabled
4. Regenerate Prisma client: npx prisma generate
```

### Stripe Issues

**Issue**: "Invalid API key" errors
```bash
# Solution:
1. Verify test keys (start with pk_test_ and sk_test_)
2. Check environment variables are loaded
3. Restart application after env changes
4. Ensure no extra spaces in .env file
```

**Issue**: Payment form not loading
```bash
# Solution:
1. Check Stripe publishable key in frontend
2. Verify Stripe Elements are properly imported
3. Check browser console for JavaScript errors
4. Ensure HTTPS in production (Stripe requirement)
```

### Frontend Issues

**Issue**: "CORS" errors when calling API
```bash
# Solution:
1. Update FRONTEND_URL in backend .env
2. Check API_URL in frontend .env
3. Verify backend CORS configuration
4. Restart both frontend and backend
```

---

## 📊 Performance Testing

### Load Testing (Optional)

```bash
# Install Artillery for load testing
npm install -g artillery

# Create load test script
# artillery quick --count 10 --num 5 http://localhost:3001

# Test scenarios:
# - 10 concurrent users searching trips
# - 5 concurrent bookings
# - Database connection limits
```

---

## ✅ Final Testing Checklist

### Database
- [ ] Supabase project created and configured
- [ ] Schema and seed data successfully loaded
- [ ] Environment variables properly set
- [ ] Database connection working in both frontend and backend

### Stripe
- [ ] Stripe account set up with test keys
- [ ] Payment form functional
- [ ] Test transactions processing successfully
- [ ] Error handling working for failed payments

### Application Features
- [ ] User registration and login working
- [ ] Trip search returning results
- [ ] Seat selection functional
- [ ] Booking process complete end-to-end
- [ ] Dashboard showing user data
- [ ] Navigation and UI responsive

### Security
- [ ] Environment variables not committed to git
- [ ] Test data only (no real payment information)
- [ ] HTTPS enabled for production
- [ ] Row Level Security policies working

---

## 🎯 Next Steps

After successful testing:

1. **Production Deployment**
   - Set up production Supabase project
   - Configure production Stripe account
   - Deploy to hosting service (Vercel, Netlify, etc.)

2. **Additional Features**
   - Email notifications
   - SMS confirmations
   - Real-time trip tracking
   - Admin management panel

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure analytics
   - Monitor payment success rates
   - Database performance monitoring

---

## 📞 Support

If you encounter any issues during testing:

1. Check the logs in terminal/console
2. Verify environment variables are correctly set
3. Review Supabase and Stripe dashboards for errors
4. Check this guide for common solutions
5. Review project documentation in `/docs` folder

Happy testing! 🚀
