# Admin SourceMedX

A comprehensive admin dashboard for managing a medical goods shopping solution application. This application provides tools for user management, payment processing, and search key licensing.

## Features

- 🔐 Secure Admin Authentication & Authorization
- 👥 User Management & Role-based Access Control
- 💳 Payment Processing with Stripe Integration
- 🔑 Search Key Licensing System
- 💰 Credit Pack Management
- 📊 Real-time Analytics & Monitoring
- 🔒 Security & Compliance Features

## Tech Stack

### Backend

- NestJS (Node.js framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Stripe (Payment processing)

### Frontend

- React
- Material-UI
- Redux Toolkit (State management)
- React Router (Routing)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker & Docker Compose (for containerized development)
- Stripe Account (for payment processing)

## Development

- Backend runs on: http://localhost:3000
- Frontend runs on: http://localhost:3001
- API Documentation: http://localhost:3000/api/docs

## Project Structure

```
smx-admin/
├── backend/                 # NestJS backend application
├── frontend/               # React frontend application
```

## Security

- All API endpoints are protected with JWT authentication
- Role-based access control (RBAC) implemented
- Secure password hashing with bcrypt
- CORS protection enabled
- Rate limiting implemented
- Input validation and sanitization
- Secure session management

## Documentation

- API Documentation: Available at `/api/docs` when running the backend
- User Guide: Available in the `docs/` directory
- Development Guide: Available in the `docs/` directory

## License

This project is proprietary and confidential.

## Support

For support, please contact the development team.
