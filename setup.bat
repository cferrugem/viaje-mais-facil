@echo off
setlocal EnableDelayedExpansion

REM 🚀 BusTickets Quick Setup Script for Windows
REM This script helps you set up the development environment quickly

echo 🚌 BusTickets - Quick Setup Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo 🌐 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm detected: 
npm --version

echo.
echo 📦 Installing Dependencies...
echo ============================

REM Install backend dependencies
echo.
echo ℹ️  Installing backend dependencies...
cd backend
if exist package.json (
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Backend package.json not found
    pause
    exit /b 1
)

REM Install frontend dependencies
echo.
echo ℹ️  Installing frontend dependencies...
cd ..\frontend
if exist package.json (
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend package.json not found
    pause
    exit /b 1
)

cd ..

echo.
echo ⚙️  Environment Configuration
echo ============================

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Copying from .env.example...
    copy "backend\.env.example" "backend\.env" >nul
    echo ℹ️  Backend .env created. Please update with your Supabase and Stripe credentials.
)

REM Check if frontend .env exists
if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Copying from .env.example...
    copy "frontend\.env.example" "frontend\.env" >nul
    echo ℹ️  Frontend .env created. Please update with your API and Stripe credentials.
)

echo.
echo 🗄️  Database Setup
echo =================

echo ℹ️  Generating Prisma client...
cd backend
npx prisma generate
if errorlevel 1 (
    echo ⚠️  Prisma client generation failed. Please check your DATABASE_URL
) else (
    echo ✅ Prisma client generated
)

cd ..

echo.
echo 🎯 Next Steps
echo =============

echo.
echo ℹ️  1. Configure your environment variables:
echo    📝 Edit backend\.env with your Supabase credentials
echo    📝 Edit frontend\.env with your API and Stripe keys
echo.

echo ℹ️  2. Set up your Supabase database:
echo    🌐 Go to https://supabase.com and create a project
echo    📋 Run the SQL from docs\supabase-setup.sql in SQL Editor
echo    🌱 Run the SQL from docs\supabase-seed.sql for sample data
echo.

echo ℹ️  3. Set up Stripe (for payments):
echo    💳 Go to https://stripe.com and get test API keys
echo    🔑 Add your keys to both .env files
echo.

echo ℹ️  4. Start the development servers:
echo    🖥️  Backend: cd backend ^&^& npm run dev
echo    🌐 Frontend: cd frontend ^&^& npm start
echo.

echo ℹ️  5. Test the application:
echo    📖 Read TESTING_GUIDE.md for detailed testing instructions
echo    🧪 Use test card: 4242 4242 4242 4242 for Stripe testing
echo.

echo 📚 Documentation:
echo    📄 TESTING_GUIDE.md - Complete testing instructions
echo    📄 README-PT.md - Portuguese documentation
echo    📄 docs\ - Technical documentation
echo.

echo ✅ Setup completed! Your BusTickets application is ready for development.
echo ⚠️  Don't forget to configure your environment variables before starting the servers!

echo.
echo 🚀 Quick Start Commands:
echo =======================
echo # Start backend (in one terminal):
echo cd backend ^&^& npm run dev
echo.
echo # Start frontend (in another terminal):
echo cd frontend ^&^& npm start
echo.
echo # Open application:
echo http://localhost:3001
echo.

echo ✅ Happy coding! 🚌💨

echo.
echo Press any key to continue...
pause >nul
