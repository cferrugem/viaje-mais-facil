# Supabase Setup Guide

This guide will help you set up your bus ticket application database on Supabase.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Have the database schema files ready (located in `/backend/database/`)

## Step 1: Create a New Supabase Project

1. Go to your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `bus-ticket-system`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be fully provisioned (2-3 minutes)

## Step 2: Execute Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy the entire content from `/backend/database/supabase-setup.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema creation

This will create:
- All database tables with proper relationships
- Custom enums for status fields
- Row Level Security (RLS) policies
- Performance indexes
- Database functions and triggers

## Step 3: Seed Sample Data (Optional)

1. In the SQL Editor, create another new query
2. Copy the content from `/backend/database/supabase-seed.sql`
3. Paste and run it to populate with sample data

This includes:
- Sample users (customers and admins)
- Bus routes between major cities
- Bus fleet information
- Sample trips and bookings
- Test payment records

## Step 4: Configure Environment Variables

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:

### Backend Configuration

Update your `/backend/.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# JWT
JWT_SECRET="[YOUR-JWT-SECRET]"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
PORT=3001
NODE_ENV=development
```

### Frontend Configuration

Update your `/frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
REACT_APP_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Step 5: Update Prisma Configuration

1. Install the Prisma CLI if not already installed:
   ```bash
   npm install -g prisma
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

4. Push the schema to verify connection (optional):
   ```bash
   npx prisma db push
   ```

## Step 6: Verify Setup

### Test Database Connection

Run this in your backend directory:

```bash
npx prisma studio
```

This should open Prisma Studio where you can view your database tables and data.

### Test API Connection

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3001/api/health
   ```

## Row Level Security (RLS)

The database comes pre-configured with RLS policies:

### Users Table
- Users can only read/update their own records
- Only admins can create new users via API
- Public registration is handled by the application layer

### Bookings Table
- Users can only see their own bookings
- Admins can see all bookings

### Payments Table
- Users can only see their own payments
- Admins can see all payments

### Public Tables
- Routes, buses, trips are publicly readable
- Only admins can modify these tables

## Database Indexes

Optimized indexes are created for:
- User email lookups
- Trip searches by route and date
- Booking searches by user and status
- Payment processing queries

## Backup and Recovery

Supabase automatically backs up your database:
- Point-in-time recovery available
- Daily backups for 7 days (free tier)
- Backups can be downloaded from the dashboard

## Monitoring

Access real-time monitoring in Supabase dashboard:
- Database performance metrics
- Query execution times
- Connection pool status
- Error logs

## Production Deployment

For production:

1. **Enable SSL**: Always use SSL connections
2. **Environment Variables**: Use secure environment variable management
3. **API Keys**: Rotate keys regularly
4. **RLS Policies**: Review and test all policies
5. **Database Limits**: Monitor usage against plan limits
6. **Backups**: Set up additional backup strategies if needed

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check if your IP is allowlisted (Supabase settings)
   - Verify DATABASE_URL format

2. **Permission Denied**
   - Check RLS policies
   - Verify API key permissions

3. **Schema Mismatch**
   - Run `npx prisma db pull` to sync schema
   - Check for any manual database changes

4. **Migration Errors**
   - Use Supabase migrations for schema changes
   - Avoid direct SQL modifications in production

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Project GitHub Issues](your-repo-url)

## Next Steps

1. Set up authentication integration
2. Configure Stripe webhooks
3. Deploy backend to your preferred platform
4. Set up frontend deployment
5. Configure domain and SSL certificates

Your bus ticket booking system is now ready to handle real-world traffic with Supabase's scalable infrastructure!
