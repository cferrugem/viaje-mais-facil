# Bus Ticket Sales Application

A modern, robust bus ticket booking system built with React, TypeScript, Node.js, PostgreSQL, and Stripe payments.

## 🚀 Features

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Node.js/Express with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe integration
- **Authentication**: JWT-based authentication
- **Real-time**: Socket.io for real-time updates

## 📁 Project Structure

```
bus-ticket-app/
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js TypeScript backend
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## 🛠️ Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account
- Git

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Fill in your database and Stripe credentials

3. **Set up database**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📚 Documentation

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Frontend build will be in frontend/dist
# Backend build will be in backend/dist
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
