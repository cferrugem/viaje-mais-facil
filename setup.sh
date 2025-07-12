#!/bin/bash

# 🚀 BusTickets Quick Setup Script
# This script helps you set up the development environment quickly

echo "🚌 BusTickets - Quick Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm $(npm -v) detected"

echo ""
echo "📦 Installing Dependencies..."
echo "============================"

# Install backend dependencies
echo ""
print_info "Installing backend dependencies..."
cd backend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_error "Backend package.json not found"
    exit 1
fi

# Install frontend dependencies
echo ""
print_info "Installing frontend dependencies..."
cd ../frontend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_error "Frontend package.json not found"
    exit 1
fi

cd ..

echo ""
echo "⚙️  Environment Configuration"
echo "============================"

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Copying from .env.example..."
    cp backend/.env.example backend/.env
    print_info "Backend .env created. Please update with your Supabase and Stripe credentials."
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    print_warning "Frontend .env file not found. Copying from .env.example..."
    cp frontend/.env.example frontend/.env
    print_info "Frontend .env created. Please update with your API and Stripe credentials."
fi

echo ""
echo "🗄️  Database Setup"
echo "================="

print_info "Generating Prisma client..."
cd backend
npx prisma generate
if [ $? -eq 0 ]; then
    print_status "Prisma client generated"
else
    print_warning "Prisma client generation failed. Please check your DATABASE_URL"
fi

cd ..

echo ""
echo "🎯 Next Steps"
echo "============="

echo ""
print_info "1. Configure your environment variables:"
echo "   📝 Edit backend/.env with your Supabase credentials"
echo "   📝 Edit frontend/.env with your API and Stripe keys"
echo ""

print_info "2. Set up your Supabase database:"
echo "   🌐 Go to https://supabase.com and create a project"
echo "   📋 Run the SQL from docs/supabase-setup.sql in SQL Editor"
echo "   🌱 Run the SQL from docs/supabase-seed.sql for sample data"
echo ""

print_info "3. Set up Stripe (for payments):"
echo "   💳 Go to https://stripe.com and get test API keys"
echo "   🔑 Add your keys to both .env files"
echo ""

print_info "4. Start the development servers:"
echo "   🖥️  Backend: cd backend && npm run dev"
echo "   🌐 Frontend: cd frontend && npm start"
echo ""

print_info "5. Test the application:"
echo "   📖 Read TESTING_GUIDE.md for detailed testing instructions"
echo "   🧪 Use test card: 4242 4242 4242 4242 for Stripe testing"
echo ""

echo "📚 Documentation:"
echo "   📄 TESTING_GUIDE.md - Complete testing instructions"
echo "   📄 README-PT.md - Portuguese documentation"
echo "   📄 docs/ - Technical documentation"
echo ""

print_status "Setup completed! Your BusTickets application is ready for development."
print_warning "Don't forget to configure your environment variables before starting the servers!"

echo ""
echo "🚀 Quick Start Commands:"
echo "======================="
echo "# Start backend (in one terminal):"
echo "cd backend && npm run dev"
echo ""
echo "# Start frontend (in another terminal):"
echo "cd frontend && npm start"
echo ""
echo "# Open application:"
echo "http://localhost:3001"
echo ""

print_status "Happy coding! 🚌💨"
