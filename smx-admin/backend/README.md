# SourceMedX Admin Backend

A comprehensive admin dashboard backend built with **NestJS**, featuring advanced role-based access control, real-time activity monitoring, payment processing, and enterprise-grade security measures.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with refresh token support
- **Multi-device Session Management** with device tracking
- **Role-based Access Control (RBAC)** with granular permissions
- **Security Middleware** with Helmet, CORS
- **Comprehensive Input Validation** with class-validator
- **Password Security** with bcrypt hashing
- **Session Lifecycle Management** with automatic cleanup

### 👥 User & Admin Management
- **Advanced User Management** with status tracking
- **Admin Dashboard** with comprehensive controls
- **Company Information Tracking** and management
- **User Activity Monitoring** and analytics
- **Role Assignment & Management** with dynamic permissions
- **User Blocking/Unblocking** functionality

### 🔑 Search Key Management
- **Dynamic Search Key Generation** with configurable parameters
- **Key Lifecycle Management** (Available → Used → Expired → Cancelled)
- **Payment Integration** with Stripe for key purchases
- **Key Usage Analytics** and reporting
- **Discount & Pricing Management** system

### 💳 Payment Processing
- **Stripe Integration** for secure payment processing
- **Webhook Handling** for payment status updates
- **Payment Analytics** and transaction tracking
- **Purchase History** with detailed records

### 📊 Activity Logging & Monitoring
- **Comprehensive Audit Trails** for all user actions
- **Real-time Activity Tracking** with IP and device logging
- **Advanced Filtering** and search capabilities
- **Export Functionality** for compliance and reporting
- **Performance Monitoring** and analytics

### 🛡️ Advanced Security Features
- **Request/Response Interceptors** for data sanitization
- **Custom Exception Filters** for error handling
- **Database Exception Handling** with proper error messages
- **Validation Exception Filtering** with detailed feedback
- **Security Headers** with Helmet middleware
- **CORS Configuration** with environment-specific settings

### 📚 API Documentation & Tools
- **Interactive Swagger Documentation** with OpenAPI 3.0
- **Automated API Documentation Generation**
- **Type-safe DTOs** with comprehensive validation
- **Request/Response Examples** in documentation
- **Postman Collection** support

## 🛠️ Technology Stack

- **Framework**: NestJS (v10.x)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Payment Processing**: Stripe
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston with daily rotation
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, bcrypt, CORS
- **Task Scheduling**: @nestjs/schedule
- **Configuration**: Environment-based config

## 📋 Prerequisites

- **Node.js** (v18.x or higher)
- **PostgreSQL** (v14 or higher)
- **Yarn** package manager (v1.22+)
- **Stripe Account** (for payment processing)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/SourceMedX/smx-admin.git
cd smx-admin/backend
yarn install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=smx

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Application Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Database Setup
```bash
# Run migrations
yarn migration:run

# Seed initial data
yarn seed

# Or reset and seed database
yarn db:reset
```

### 4. Start Development Server
```bash
yarn start:dev

# for production launch
yarn build && yarn start:prod
```

### 5. Access Application
- **API Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 📁 Project Structure

```
src/
├── admin/              # Admin management & dashboard
│   ├── dto/           # Data transfer objects
│   ├── entities/      # Database entities
│   ├── validators/    # Custom validators
│   └── *.ts          # Controllers & services
├── auth/              # Authentication & authorization
│   ├── dto/          # Auth DTOs
│   ├── entities/     # Auth entities (sessions, tokens)
│   ├── guards/       # Auth guards
│   └── *.ts         # Auth logic
├── users/             # User management
│   ├── dto/          # User DTOs
│   ├── entities/     # User entities
│   └── *.ts         # User controllers & services
├── search-keys/       # Search key & payment management
│   ├── dto/          # Search key DTOs
│   ├── entities/     # Search key entities
│   └── *.ts         # Key management logic
├── activity-logs/     # Activity logging & monitoring
│   ├── dto/          # Log DTOs
│   ├── entities/     # Log entities
│   └── *.ts         # Logging services
├── common/           # Shared utilities & middleware
│   ├── decorators/   # Custom decorators
│   ├── filters/      # Exception filters
│   ├── guards/       # Authorization guards
│   ├── interceptors/ # Request/response interceptors
│   └── logger/       # Winston logger configuration
├── shared/           # Shared business logic
│   ├── decorators/   # Shared decorators
│   └── interceptors/ # Shared interceptors
├── config/           # Configuration files
├── database/         # Database utilities & seeding
├── migrations/       # TypeORM migrations
└── main.ts          # Application bootstrap
```

## 📜 Available Scripts

### Development
- `yarn start:dev` - Start development server with hot reload
- `yarn start:debug` - Start with debugging enabled
- `yarn build` - Build production bundle
- `yarn start:prod` - Start production server

### Code Quality
- `yarn lint` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier
- `yarn test` - Run unit tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:cov` - Run tests with coverage
- `yarn test:e2e` - Run end-to-end tests

### Database Management
- `yarn migration:create` - Create new migration
- `yarn migration:generate` - Generate migration from entities
- `yarn migration:run` - Execute pending migrations
- `yarn migration:revert` - Revert last migration
- `yarn seed` - Seed database with initial data
- `yarn db:reset` - Reset database and reseed

### Documentation
- `yarn openapi:generate` - Generate OpenAPI JSON documentation

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login with credentials |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout and revoke tokens |
| `GET` | `/api/auth/sessions` | Get active user sessions |
| `DELETE` | `/api/auth/sessions/:tokenId` | Revoke specific session |

### Search Keys Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search-keys/all` | Get all search keys with filters |
| `GET` | `/api/search-keys/stats` | Get comprehensive statistics |
| `GET` | `/api/search-keys/purchases` | Get purchase history |
| `POST` | `/api/search-keys/create` | Generate new search keys |
| `POST` | `/api/search-keys/cancel/:id` | Cancel specific search key |
| `GET` | `/api/search-keys/payment-details/:stripePaymentId` | Get payment details |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users with pagination |
| `POST` | `/api/users` | Create new user account |
| `PUT` | `/api/users/:id` | Update user information |
| `DELETE` | `/api/users/:id` | Delete user account |
| `PUT` | `/api/users/:id/toggle-block` | Block/unblock user |
| `PUT` | `/api/users/:id/toggle-role` | Change user role |

### Activity Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/activity-logs` | Get activity logs with filters |
| `GET` | `/api/activity-logs/export` | Export logs to CSV/JSON |
| `GET` | `/api/activity-logs/stats` | Get activity statistics |

## 🔒 Security Implementation

### Authentication Flow
1. **Login**: Validate credentials and generate JWT tokens
2. **Authorization**: Verify JWT on protected routes
3. **Session Management**: Track and manage active sessions
4. **Token Refresh**: Automatic token renewal
5. **Logout**: Secure token revocation

### Security Measures
- **Input Validation**: All inputs validated using class-validator
- **SQL Injection Prevention**: TypeORM parameterized queries
- **XSS Protection**: Helmet security headers
- **CSRF Protection**: Built-in NestJS guards
- **Data Encryption**: Sensitive data encryption at rest

## 🧪 Testing

### Unit Testing
```bash
yarn test
yarn test:watch    # Watch mode
yarn test:cov      # With coverage
```

### E2E Testing
```bash
yarn test:e2e
```

### Manual Testing
- Use the Swagger UI at `/api/docs` for interactive testing
- Import the generated OpenAPI specification into Postman
- Run the permission test script: `./test-permissions.sh`

## 📈 Performance & Monitoring

### Logging
- **Winston Logger** with daily log rotation
- **Structured Logging** with JSON format
- **Log Levels**: Error, Warn, Info, Debug
- **Request/Response Logging** with correlation IDs

### Performance Features
- **Database Connection Pooling**
- **Query Optimization** with proper indexing
- **Response Caching** for frequently accessed data
- **Lazy Loading** for related entities
- **Pagination** for large datasets

## 🚀 Deployment

### Production Build
```bash
yarn build
yarn start:prod
```

### Environment Configuration
- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secrets
- Configure Stripe production keys
- Set appropriate CORS origins

### Health Checks
The application includes health check endpoints for monitoring:
- Database connectivity
- External service availability
- Memory usage
- Response times

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow commit message conventions
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Documentation**: Available at `/api/docs`
- **Issues**: [GitHub Issues](https://github.com/SourceMedX/smx-admin/issues)
- **Email**: support@sourcemedx.com

---

**Built with ❤️ by the SourceMedX Team** 