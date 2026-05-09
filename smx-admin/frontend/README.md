# SourceMedX Admin Frontend

A modern, responsive admin dashboard built with **React 18** and **TypeScript**, featuring comprehensive user management, payment processing, real-time analytics, and enterprise-grade security controls.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with automatic token refresh
- **Multi-device Session Management** with real-time tracking
- **Role-based Access Control (RBAC)** with granular permissions
- **Protected Routes** with permission-based navigation
- **Automatic Session Recovery** on page refresh
- **Secure Token Storage** with refresh token rotation

### 👥 User Management
- **Admin User Management** with role assignment and permissions
- **Client User Management** with company information tracking
- **User Status Control** (Active, Blocked, Suspended)
- **Real-time User Activity** monitoring and analytics
- **Bulk Operations** for user management tasks
- **Advanced Search & Filtering** capabilities

### 🔑 Search Key & Payment Management
- **Search Key Lifecycle Management** (Available → Used → Expired → Cancelled)
- **Stripe Payment Integration** for key purchases
- **Purchase History & Analytics** with detailed transaction records
- **Payment Status Tracking** with real-time updates
- **Key Usage Statistics** and performance analytics
- **Revenue Dashboard** with payment insights

### 📊 Activity Monitoring & Analytics
- **Comprehensive Activity Logs** with detailed audit trails
- **Real-time Dashboard** with key performance indicators
- **Advanced Filtering & Search** across all data
- **Export Functionality** (CSV, JSON) for reports
- **Interactive Charts** and data visualizations
- **Performance Metrics** and usage analytics

### 🎨 Modern User Experience
- **Material-UI (MUI) Design System** with consistent theming
- **Responsive Layout** optimized for all devices
- **Dark/Light Theme Support** with user preference persistence
- **Advanced Data Tables** with sorting, filtering, and pagination
- **Real-time Notifications** with toast messages
- **Loading States** and skeleton screens
- **Error Boundaries** with graceful error handling

### 🛡️ Enterprise-Grade Features
- **Type Safety** with comprehensive TypeScript coverage
- **State Management** with Redux Toolkit
- **Form Validation** with Formik and Yup schemas
- **API Error Handling** with automatic retry logic
- **Performance Optimization** with React.memo and lazy loading
- **Accessibility (a11y)** compliance with WCAG guidelines

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript 4.9
- **State Management**: Redux Toolkit with RTK Query
- **UI Framework**: Material-UI (MUI) v7
- **Routing**: React Router v6
- **Form Management**: Formik with Yup validation
- **HTTP Client**: Axios with interceptors
- **Payment Processing**: Stripe.js
- **Notifications**: Notistack
- **Date Handling**: date-fns
- **Build Tool**: Create React App
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

- **Node.js** (v18.x or higher)
- **Yarn** package manager (v1.22+)
- **Modern Browser** (Chrome 90+, Firefox 88+, Safari 14+)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/SourceMedX/smx-admin.git
cd smx-admin/frontend
yarn install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api

```

### 3. Start Development Server
```bash
yarn start

# for production build
yarn build && serve -s build
```

### 4. Access Application
- **Development Server**: http://localhost:3001
- **Production Build**: Served via nginx or static hosting

## 📁 Project Structure

```
src/
├── app/                    # Application configuration
│   ├── constants.ts       # Application constants
│   ├── hooks.ts          # Redux hooks
│   ├── providers.tsx     # App providers wrapper
│   ├── store.ts          # Redux store configuration
│   ├── theme.ts          # MUI theme configuration
│   └── types.ts          # Global types
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── AuthInitializer.tsx    # Auth state initializer
│   ├── ConfirmationDialog.tsx # Confirmation dialogs
│   ├── DataTable.tsx         # Advanced data table
│   ├── ErrorBoundary.tsx     # Error boundary wrapper
│   ├── FormField.tsx         # Form field components
│   ├── LoadingScreen.tsx     # Loading states
│   ├── ProtectedRoute.tsx    # Route protection
│   ├── SearchKeyList.tsx     # Search key management
│   └── TableSkeleton.tsx     # Table loading skeleton
├── features/              # Feature-specific modules
│   ├── activity/         # Activity logging
│   ├── admin/           # Admin management
│   ├── auth/            # Authentication
│   └── clients/         # Client management
├── pages/                # Page components
│   ├── ActivityLogsPage.tsx   # Activity monitoring
│   ├── AdminUsersPage.tsx     # Admin user management
│   ├── ClientUsersPage.tsx    # Client user management
│   ├── DashboardPage.tsx      # Main dashboard
│   ├── LoginPage.tsx          # Authentication page
│   ├── PurchasePage.tsx       # Purchase management
│   ├── SearchKeysPage.tsx     # Search key overview
│   └── SessionsPage.tsx       # Session management
├── services/             # API service layer
│   ├── activity-logs.service.ts  # Activity logs API
│   ├── admin-users.service.ts    # Admin users API
│   ├── api.ts                    # Axios configuration
│   ├── auth.service.ts           # Authentication API
│   ├── client-users.service.ts   # Client users API
│   └── searchKey.service.ts      # Search keys API
├── types/                # TypeScript definitions
│   ├── auth.ts          # Authentication types
│   └── searchKey.ts     # Search key types
├── App.tsx              # Main app component
├── index.tsx            # Application entry point
├── style.css            # Global styles
└── theme.ts             # Theme configuration
```

## 📜 Available Scripts

### Development
- `yarn start` - Start development server with hot reload
- `yarn build` - Create production build
- `yarn test` - Run test suite
- `yarn test:watch` - Run tests in watch mode

### Code Quality
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier
- `yarn type-check` - Run TypeScript type checking

### Analysis
- `yarn analyze` - Analyze bundle size
- `yarn eject` - Eject from Create React App (⚠️ irreversible)

## 🎯 Key Features

### 🔐 Authentication System
- **Secure Login** with JWT tokens
- **Session Management** across multiple devices
- **Automatic Token Refresh** to maintain sessions
- **Permission-based Access** to different sections
- **Session Expiry Handling** with graceful redirects

### 📊 Dashboard Analytics
- **Real-time Statistics** for key metrics
- **Interactive Charts** with drill-down capabilities
- **Performance Indicators** for system health
- **User Activity Insights** and behavior analytics
- **Revenue Tracking** and payment analytics

### 🔑 Search Key Management
- **Key Generation** with configurable parameters
- **Status Tracking** throughout key lifecycle
- **Purchase Integration** with Stripe payments
- **Usage Analytics** and reporting
- **Bulk Operations** for key management

### 👥 User Administration
- **Role Management** with granular permissions
- **User Status Control** (activate, deactivate, block)
- **Activity Monitoring** with detailed audit trails
- **Company Information** tracking and management
- **Advanced Search** and filtering capabilities

### 📈 Activity Monitoring
- **Comprehensive Audit Logs** for all user actions
- **Real-time Activity Tracking** with timestamps
- **Advanced Filtering** by user, action, date range
- **Export Capabilities** for compliance reporting
- **Search Functionality** across all log data

## 🎨 UI/UX Features

### Design System
- **Material-UI Components** with custom theming
- **Consistent Color Palette** and typography
- **Responsive Grid System** for all screen sizes
- **Accessible Components** meeting WCAG standards
- **Loading States** with skeleton animations

### User Experience
- **Intuitive Navigation** with breadcrumbs
- **Smart Notifications** with contextual messages
- **Keyboard Shortcuts** for power users
- **Drag & Drop** functionality where applicable
- **Context Menus** for quick actions

## 🔧 Configuration

### Environment Variables
```env
# Required
REACT_APP_API_URL=http://localhost:3000/api
```

### Build Configuration
- **TypeScript Config**: Strict type checking enabled
- **ESLint Rules**: Extended React and TypeScript rules
- **Prettier Config**: Consistent code formatting
- **Webpack Optimization**: Code splitting and tree shaking

## 🧪 Testing

### Unit Testing
```bash
yarn test                    # Run all tests
yarn test:watch             # Watch mode
yarn test --coverage        # With coverage report
```

## 🚀 Deployment

### Production Build
```bash
yarn build
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, AWS S3
- **Docker**: Containerized deployment
- **CDN**: CloudFront, CloudFlare
- **Traditional Hosting**: Apache, Nginx

### Performance Optimization
- **Code Splitting** with lazy loading
- **Bundle Analysis** with webpack-bundle-analyzer
- **Asset Optimization** with compression
- **Caching Strategies** for optimal performance

## 🔒 Security

### Client-Side Security
- **XSS Protection** with Content Security Policy
- **Secure Token Storage** with proper encryption
- **Input Sanitization** for all user inputs
- **Route Protection** based on user permissions
- **HTTPS Enforcement** in production

### Best Practices
- **No Sensitive Data** in client-side code
- **Secure API Communication** with proper headers
- **Error Handling** without information leakage
- **Regular Dependency Updates** for security patches

## 📈 Performance

### Optimization Techniques
- **React.memo** for component memoization
- **useMemo & useCallback** for expensive operations
- **Lazy Loading** for route-based code splitting
- **Virtual Scrolling** for large datasets
- **Image Optimization** with proper formats

### Performance Monitoring
- **Web Vitals** tracking with reportWebVitals
- **Bundle Size** monitoring and optimization
- **Render Performance** with React DevTools
- **API Response Times** monitoring

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** coding standards and conventions
4. **Write** tests for new functionality
5. **Update** documentation as needed
6. **Submit** pull request with detailed description

### Coding Standards
- **TypeScript** for all new code
- **ESLint** rules compliance
- **Prettier** code formatting
- **Conventional Commits** for commit messages
- **Component Documentation** with JSDoc

### Code Review Process
- **Automated Checks** must pass
- **Test Coverage** requirements met
- **Performance Impact** assessment
- **Accessibility** compliance verification
- **Security** review for sensitive changes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Documentation**: Comprehensive guides available
- **Issues**: [GitHub Issues](https://github.com/SourceMedX/smx-admin/issues)
- **Email**: support@sourcemedx.com
- **Chat**: Development team Slack channel

## 🗺️ Roadmap

### Planned Features
- **Advanced Analytics** with custom dashboards
- **Real-time Notifications** with WebSocket integration
- **Mobile App** for on-the-go management
- **API Documentation** with interactive examples
- **Internationalization** (i18n) support

---

**Built with ❤️ by the SourceMedX Team** 