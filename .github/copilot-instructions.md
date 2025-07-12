<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Bus Ticket Sales Application - Copilot Instructions

This is a full-stack bus ticket booking system built with modern technologies.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe integration
- **Real-time**: Socket.io for live updates
- **Authentication**: JWT-based auth

## Project Structure
- `/frontend` - React TypeScript application
- `/backend` - Express TypeScript API server
- `/shared` - Shared types and utilities
- `/docs` - Documentation

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Use async/await for promises

### Backend Patterns
- Use Prisma for database operations
- Implement proper middleware for auth and validation
- Follow REST API conventions
- Use proper HTTP status codes
- Implement proper error responses

### Frontend Patterns
- Use React Context for global state management
- Implement proper loading and error states
- Use React Router for navigation
- Follow accessibility best practices
- Implement responsive design

### Security
- Validate all user inputs
- Use proper authentication middleware
- Sanitize data before database operations
- Implement rate limiting where appropriate
- Use HTTPS in production

### Database
- Use Prisma migrations for schema changes
- Implement proper relationships and constraints
- Use database transactions for complex operations
- Implement proper indexing for performance

When generating code:
1. Always include proper TypeScript types
2. Implement error handling
3. Add loading states for async operations
4. Follow established patterns in the codebase
5. Include proper validation
6. Add meaningful comments for complex logic
