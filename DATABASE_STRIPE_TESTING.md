# 🧪 **Complete Testing Guide: Database & Stripe Integration**

## 🗄️ **Database Testing (PostgreSQL + Prisma)**

### **Setup Database Testing Environment**

1. **Environment Variables Configuration**
   ```bash
   # Copy .env.example to .env in backend folder
   cd backend
   cp .env.example .env
   
   # Edit .env file with your database configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/bustickets_db"
   JWT_SECRET="your-super-secret-jwt-key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   ```

2. **PostgreSQL Database Setup**
   ```bash
   # Install PostgreSQL (if not installed)
   # Windows: Download from https://www.postgresql.org/download/windows/
   # macOS: brew install postgresql
   # Ubuntu: sudo apt-get install postgresql postgresql-contrib
   
   # Create database
   createdb bustickets_db
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE bustickets_db;
   \q
   ```

3. **Prisma Database Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Seed database with test data
   npx prisma db seed
   
   # Open Prisma Studio to view database
   npx prisma studio
   ```

### **Database Testing Commands**

#### **1. Test Database Connection**
```bash
# Test if database is accessible
cd backend
npm run dev

# Should see: "✅ Connected to PostgreSQL database"
```

#### **2. Test CRUD Operations**

**Create Test User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@teste.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

**Login Test:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "123456"
  }'
```

**Get Routes:**
```bash
curl -X GET http://localhost:5000/api/routes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Search Routes:**
```bash
curl -X GET "http://localhost:5000/api/routes/search?from=São Paulo&to=Rio de Janeiro&date=2025-07-15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Booking:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tripId": "trip_id_here",
    "seatNumbers": [1, 2]
  }'
```

---

## 💳 **Stripe Payment Testing**

### **Stripe Test Environment Setup**

1. **Get Stripe Test Keys**
   ```bash
   # Visit https://dashboard.stripe.com/test/apikeys
   # Copy your test keys (they start with pk_test_ and sk_test_)
   
   # Add to backend/.env file
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   ```

2. **Frontend Stripe Configuration**
   ```bash
   # Add to frontend/.env
   REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   ```

### **Stripe Testing Scenarios**

#### **Test Credit Cards (Use Stripe Test Cards)**

**✅ Successful Payments:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**❌ Failed Payments:**
```
# Declined Card
Card Number: 4000 0000 0000 0002

# Insufficient Funds
Card Number: 4000 0000 0000 9995

# Expired Card
Card Number: 4000 0000 0000 0069

# Incorrect CVC
Card Number: 4000 0000 0000 0127
```

### **Complete Testing Instructions**

1. **Start the application:**
   ```bash
   # Terminal 1 - Start both backend and frontend
   cd /path/to/onibus
   npm run dev
   
   # You should see:
   # [0] ✅ Connected to PostgreSQL database
   # [0] 🚀 Server running on port 5000
   # [1] Compiled successfully!
   # [1] Local: http://localhost:3001
   ```

2. **Test the complete booking flow:**
   - Go to http://localhost:3001
   - Search: São Paulo → Rio de Janeiro, tomorrow's date
   - Select a trip and seats
   - Fill passenger information (use your name)
   - Use test card: **4242 4242 4242 4242**
   - Complete payment

3. **Verify in database:**
   ```bash
   cd backend
   npx prisma studio
   # Open http://localhost:5555
   # Check bookings table for new entry
   ```

---

## 🎯 **Step-by-Step Testing Guide**

### **Test 1: Database Connection**
```bash
cd backend
npm run dev
```
**Expected Output:**
```
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
```

### **Test 2: User Registration**
1. Go to http://localhost:3001/register
2. Fill form with:
   - Nome: João
   - Sobrenome: Silva
   - Email: joao@teste.com
   - Senha: 123456
3. Click "Cadastrar"
4. Should redirect to dashboard

### **Test 3: Trip Search**
1. Go to http://localhost:3001
2. Search form:
   - Origem: São Paulo
   - Destino: Rio de Janeiro
   - Data: Tomorrow
3. Click "Buscar Ônibus"
4. Should show trip results

### **Test 4: Booking Creation**
1. From search results, click "Selecionar" on any trip
2. Select seats by clicking on available (green) seats
3. Fill passenger information
4. Click "Prosseguir para Pagamento"

### **Test 5: Payment Processing**
1. On payment page, enter card details:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/34
   - CVC: 123
2. Click "Finalizar Pagamento"
3. Should show success page with booking code

### **Test 6: Verify in Database**
```bash
cd backend
npx prisma studio
```
1. Open http://localhost:5555
2. Click on "Booking" table
3. Your booking should be there with status "CONFIRMED"

---

## 📊 **Quick Testing Checklist**

### **Database Tests**
- [ ] ✅ **Connection**: Backend shows "Connected to PostgreSQL"
- [ ] ✅ **User Registration**: Can create new account
- [ ] ✅ **Login**: Authentication works  
- [ ] ✅ **Routes**: Search returns trip results
- [ ] ✅ **Bookings**: Can create booking records

### **Stripe Tests**
- [ ] ✅ **Configuration**: Payment form appears
- [ ] ✅ **Success**: Test card 4242... completes payment
- [ ] ✅ **Failure**: Declined card 4000...0002 shows error
- [ ] ✅ **Integration**: Payment creates booking in database

### **Frontend Tests**  
- [ ] ✅ **Navigation**: All pages load correctly
- [ ] ✅ **Search**: Trip search functions work
- [ ] ✅ **Booking**: Seat selection works
- [ ] ✅ **Payment**: Stripe form processes payments
- [ ] ✅ **Dashboard**: User can view bookings

### **Error Handling**
- [ ] ✅ **Invalid Data**: Forms show validation errors
- [ ] ✅ **Network Errors**: Graceful error messages
- [ ] ✅ **Auth Required**: Protected routes redirect to login
- [ ] ✅ **Payment Fails**: Clear error messages shown

---

## 🛠️ **Troubleshooting Common Issues**

### **Database Issues**

**❌ "Database connection failed"**
```bash
# Check if PostgreSQL is running
# Windows: Services → PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo service postgresql start

# Check connection string in .env
DATABASE_URL="postgresql://username:password@localhost:5432/bustickets_db"
```

**❌ "Migration failed"**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
npx prisma db seed
```

### **Stripe Issues**

**❌ "Invalid API key"**
- Check Stripe Dashboard for correct test keys
- Verify environment variables in .env files
- Make sure using test keys (pk_test_, sk_test_)

**❌ "Payment method not found"**
- Use correct test card numbers from Stripe docs
- Ensure card number is 4242 4242 4242 4242
- Check expiry date is in future

### **Frontend Issues**

**❌ "Cannot connect to backend"**
```bash
# Check backend is running on port 5000
curl http://localhost:5000/health

# Check frontend environment variables
REACT_APP_API_URL=http://localhost:5000
```

**❌ "Search returns no results"**
- Check database has seed data
- Verify date is in future
- Try São Paulo → Rio de Janeiro

---

## 📈 **Advanced Testing**

### **Performance Testing**
```bash
# Test with multiple concurrent users
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:3001
```

### **Security Testing**
```bash
# Test authentication
curl -X GET http://localhost:5000/api/bookings
# Should return 401 Unauthorized

# Test with valid token
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Load Testing**
```bash
# Test booking creation under load
for i in {1..50}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"firstName\":\"User\",\"lastName\":\"$i\",\"email\":\"user$i@test.com\",\"password\":\"123456\",\"confirmPassword\":\"123456\"}" &
done
wait
```

---

## 🎯 **Success Indicators**

### **Database Working Correctly**
- ✅ Backend connects without errors
- ✅ Prisma Studio shows tables with data
- ✅ User registration creates database records
- ✅ Login returns JWT tokens
- ✅ Bookings are saved correctly

### **Stripe Integration Working**
- ✅ Payment form appears on frontend
- ✅ Test card 4242... processes successfully
- ✅ Declined cards show appropriate errors
- ✅ Successful payments create bookings
- ✅ Stripe dashboard shows test payments

### **Application Flow Working**
- ✅ Users can register and login
- ✅ Search returns available trips
- ✅ Seat selection works properly
- ✅ Payment processing completes booking
- ✅ Users can view their bookings

---

## 📞 **Getting Help**

### **Resources**
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Stripe Testing**: https://stripe.com/docs/testing
- **React Docs**: https://reactjs.org/docs/

### **Common Commands**
```bash
# Restart everything
npm run dev

# Reset database
cd backend && npx prisma migrate reset

# View database
cd backend && npx prisma studio

# Check logs
cd backend && npm run dev (watch console)
```

---

**🚀 Remember: Test early, test often, and always use test data!**
