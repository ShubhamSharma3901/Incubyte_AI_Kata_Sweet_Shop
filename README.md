# AI Kata Sweet Shop - Incubyte Assessment

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge&logo=vercel)](https://incubyte-ai-kata-sweet-shop.vercel.app/login)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

**Deployed Application:** https://incubyte-ai-kata-sweet-shop.vercel.app/login

A modern, full-stack sweet shop management system built with **React**, **TypeScript**, **Node.js**, and **Prisma**. Developed following **Test-Driven Development (TDD)** principles with transparent **AI-assisted coding practices**.

## Table of Contents

- [Project Overview](#project-overview)
  - [Technology Stack](#technology-stack)
  - [Key Features](#key-features)
  - [Test-Driven Development (TDD) Methodology](#test-driven-development-tdd-methodology)
- [UI Screenshots](#ui-screenshots)
- [Test Coverage](#test-coverage)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Verification & Testing](#verification--testing)
  - [Troubleshooting](#troubleshooting)
- [My AI Usage](#my-ai-usage)

---

## Project Overview

The Sweet Shop application is a comprehensive inventory management system designed for sweet shop owners and customers. It provides role-based access control, real-time inventory management, and a responsive user interface optimized for both desktop and mobile devices.

### Technology Stack

**Frontend:**
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Zustand** - Lightweight state management solution
- **React Router** - Client-side routing and navigation
- **React Hook Form** - Performant forms with easy validation
- **Radix UI** - Accessible, unstyled UI components
- **Framer Motion** - Smooth animations and transitions

**Backend:**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server-side development
- **Prisma ORM** - Type-safe database client and schema management
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication and authorization
- **bcryptjs** - Password hashing and security
- **Zod** - Runtime type validation and parsing
- **Vitest** - Fast unit testing framework

**Development & Deployment:**
- **GitHub Actions** - Continuous integration
- **Vercel** - Frontend hosting and deployment
- **Render** - Backend API hosting
- **ESLint & Prettier** - Code quality and formatting

### Key Features

**Authentication & Authorization**
- Secure user registration and login system
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes and API endpoints

**User Dashboard**
- Browse available sweets with real-time inventory
- Advanced search and filtering capabilities
- Purchase functionality with quantity selection
- Responsive design for all device sizes

**Admin Panel**
- Complete inventory management (CRUD operations)
- Add new sweets with detailed information
- Edit existing sweet details and pricing
- Delete sweets with confirmation dialogs
- Real-time inventory updates

**User Experience**
- Fully responsive design (mobile-first approach)
- Intuitive navigation and user interface
- Loading states and error handling
- Toast notifications for user feedback

**Quality Assurance**
- Comprehensive test coverage with Vitest
- Type safety throughout the application
- Input validation and sanitization
- Error boundaries and graceful error handling

### Test-Driven Development (TDD) Methodology

This project was built following the **Red-Green-Refactor** TDD cycle:

1. **Red Phase:** Write failing tests that define the desired functionality
2. **Green Phase:** Write minimal code to make the tests pass
3. **Refactor Phase:** Improve code quality while maintaining test coverage

**TDD Benefits Realized:**
- **Higher Code Quality:** Every feature is backed by comprehensive tests
- **Better Design:** TDD encourages modular, testable code architecture
- **Confidence in Changes:** Refactoring is safe with comprehensive test coverage
- **Documentation:** Tests serve as living documentation of system behavior
- **Faster Debugging:** Issues are caught early in the development cycle

**Testing Strategy:**
- **Unit Tests:** Individual functions and components

---

## UI Screenshots

### 1. Login Interface
- **URL:** /login
- **Description:** Shows the user authentication interface
- **Key Elements:**
  - Email and password input fields
  - Sign In button
  - Registration link
  - Sweet Shop branding
  - Responsive design

![Login Interface](assets/login-interface.png)

### 2. User Dashboard
- **URL:** /dashboard (logged in as user)
- **Description:** Main user interface for browsing and purchasing sweets
- **Key Elements:**
  - Navigation header with user info
  - Grid of available sweets
  - Sweet cards with images, names, prices
  - Purchase buttons
  - Search/filter functionality

![User Dashboard](assets/user-dashboard.png)

### 3. Admin Panel
- **URL:** /admin (logged in as admin)
- **Description:** Administrative interface for managing inventory
- **Key Elements:**
  - Admin navigation
  - Sweet inventory table
  - Edit/Delete actions
  - Add New Sweet button
  - Admin-specific UI

![Admin Panel](assets/admin-panel.png)
### 4. Sweet Management
- **URL:** /admin/sweets/add
- **Description:** Form for adding/editing sweet details
- **Key Elements:**
  - Sweet form fields (name, description, price, quantity)
  - Image upload functionality
  - Form validation
  - Save/Cancel buttons

![Sweet Management Interface](assets/sweet-management.png)

---

## Test Coverage

The project maintains comprehensive test coverage across all critical components. The test suite includes unit tests for services, controllers, and middleware, ensuring code reliability and maintainability.

**Coverage Results:** 90%+ coverage across all lines of code

![Test Coverage Report](assets/test_coverage/test_coverage.png)

## Getting Started

### Prerequisites

Before running this project locally, ensure you have the following software installed:

#### Required Software

| Software | Minimum Version | Installation Link |
|----------|----------------|-------------------|
| **Node.js** | 18.0.0+ | [Download Node.js](https://nodejs.org/en/download/) |
| **npm** | 9.0.0+ | Included with Node.js |
| **Docker** | 20.0.0+ | [Download Docker](https://www.docker.com/get-started) |
| **Git** | 2.30.0+ | [Download Git](https://git-scm.com/downloads) |


#### Version Verification

After installation, verify your setup by running these commands:

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 9.0.0 or higher

# Check Git version
git --version
# Should output: git version 2.30.0 or higher

# Check Docker version
docker --version
# Should output: Docker version 20.0.0 or higher
```

### Backend Setup

#### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd sweet-shop

# Navigate to backend directory
cd backend
```

#### 2. Install Dependencies

```bash
# Install all backend dependencies
npm install

# Or using Yarn
yarn install
```

#### 3. Database Setup

**Start PostgreSQL with Docker:**

```bash
# Pull and run PostgreSQL Docker container
docker run --name sweet-shop-postgres \
  -e POSTGRES_DB=sweet_shop_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

**Stop/Start the container later:**

```bash
# Stop the container
docker stop sweet-shop-postgres

# Start the container
docker start sweet-shop-postgres

# Remove the container (if needed)
docker rm sweet-shop-postgres
```

#### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` file with your configuration:**

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/sweet_shop_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# CORS Configuration (for production)
FRONTEND_URL="http://localhost:5173"
```

**Environment Variables Explained:**

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/sweet_shop_db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

#### 5. Database Migration and Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Run database migrations (alternative to db:push)
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Or run all setup commands at once
npm run db:setup
```

#### 6. Start the Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build and start
npm run build
npm start
```

**Expected Output:**
```
Server running on port 3001
Database connected successfully
```

The backend API will be available at: `http://localhost:3001`

### Frontend Setup

#### 1. Navigate to Frontend Directory

```bash
# From the project root directory
cd frontend
```

#### 2. Install Dependencies

```bash
# Install all frontend dependencies
npm install

# Or using Yarn
yarn install
```

#### 3. Environment Configuration

```bash
# Create environment file
touch .env.local
```

**Add the following to `.env.local`:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

**Environment Variables Explained:**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3001` |

> **Note:** Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

#### 4. Start the Development Server

```bash
# Start development server
npm run dev

# Or using Yarn
yarn dev
```

**Expected Output:**
```
  VITE v7.1.12  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

The frontend application will be available at: `http://localhost:5173`

#### 5. Build for Production (Optional)

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Verification & Testing

#### 1. Verify Backend Setup

**Check API Health:**
```bash
# Test backend API endpoint
curl http://localhost:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

**Run Backend Tests:**
```bash
# Navigate to backend directory
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Expected output: All tests should pass
```

#### 2. Verify Frontend Setup

**Check Frontend Loading:**
1. Open browser and navigate to `http://localhost:5173`
2. You should see the Sweet Shop login page
3. The page should load without console errors

**Test Frontend Build:**
```bash
# Navigate to frontend directory
cd frontend

# Type check
npm run type-check

# Build project
npm run build

# Expected output: Build should complete without errors
```

#### 3. End-to-End Verification

**Test Complete Flow:**
1. **Backend Running:** `http://localhost:3001` should be accessible
2. **Frontend Running:** `http://localhost:5173` should show login page
3. **Database Connected:** Backend logs should show "Database connected successfully"
4. **API Communication:** Frontend should be able to communicate with backend

**Test User Registration:**
1. Navigate to `http://localhost:5173/register`
2. Fill out registration form
3. Should successfully create account and redirect to login

**Test Login:**
1. Use registered credentials to login
2. Should redirect to dashboard upon successful authentication

### Troubleshooting

#### Common Issues and Solutions

**Backend Issues:**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Database Connection Failed** | `Error: connect ECONNREFUSED` | • Ensure PostgreSQL is running<br>• Check DATABASE_URL in .env<br>• Verify database exists |
| **Port Already in Use** | `Error: listen EADDRINUSE :::3001` | • Kill process using port: `lsof -ti:3001 \| xargs kill -9`<br>• Change PORT in .env file |
| **Prisma Client Error** | `PrismaClientInitializationError` | • Run `npm run db:generate`<br>• Run `npm run db:push` |
| **JWT Secret Missing** | `JWT_SECRET is required` | • Add JWT_SECRET to .env file<br>• Use a strong, random string |

**Frontend Issues:**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **API Connection Failed** | Network errors in browser console | • Ensure backend is running on port 3001<br>• Check VITE_API_BASE_URL in .env.local |
| **Build Errors** | TypeScript compilation errors | • Run `npm run type-check`<br>• Fix any TypeScript errors<br>• Ensure all dependencies are installed |
| **Port Already in Use** | `Port 5173 is already in use` | • Kill process: `lsof -ti:5173 \| xargs kill -9`<br>• Vite will automatically use next available port |
| **Environment Variables Not Loading** | API calls fail with wrong URL | • Ensure .env.local exists in frontend directory<br>• Restart development server after env changes |

**Database Issues:**

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **PostgreSQL Container Not Running** | `Connection refused` errors | • Start Docker container: `docker start sweet-shop-postgres`<br>• Check container status: `docker ps` |
| **Database Connection Failed** | `database "sweet_shop_db" does not exist` | • Recreate container with correct environment variables<br>• Ensure POSTGRES_DB is set to sweet_shop_db |
| **Permission Denied** | `permission denied for database` | • Check DATABASE_URL credentials match container setup<br>• Verify POSTGRES_USER and POSTGRES_PASSWORD |
| **Migration Errors** | Prisma migration failures | • Reset database: `npx prisma migrate reset`<br>• Run fresh migration: `npm run db:migrate` |

#### Getting Help

**Debug Commands:**
```bash
# Check running processes
ps aux | grep node

# Check port usage
lsof -i :3001  # Backend port
lsof -i :5173  # Frontend port

# Check Docker container status
docker ps | grep sweet-shop-postgres

# View backend logs
cd backend && npm run dev

# View database schema
cd backend && npx prisma studio
```

**Log Locations:**
- Backend logs: Console output when running `npm run dev`
- Frontend logs: Browser Developer Tools → Console
- Database logs: PostgreSQL logs (location varies by OS)

If you encounter issues not covered here, please check the project's issue tracker or create a new issue with:
1. Error message (full stack trace)
2. Operating system and versions
3. Steps to reproduce the issue
4. Expected vs actual behavior

---

## My AI Usage

### 1. What AI Did vs What I Did

#### 1.1 Backend (60% AI, 40% Me)

**My Contributions**
- Designed backend architecture, database schema, and API specifications  
- Defined authentication logic and role-based access control  
- Configured environment variables, database connections, and error handling  
- Implemented validation, middleware, and test case design  
- Reviewed and refactored all AI-generated code for quality and structure  

**AI Contributions**
- Generated initial Express routes, controllers, and Prisma models  
- Implemented boilerplate CRUD operations and DTOs  
- Wrote test scaffolds following my test plans  
- Suggested type refinements and improved code reuse  
- Assisted in Prisma–PostgreSQL integration during setup  
- Created seed data and local development setup  

---

#### 1.2 Frontend (75% AI, 25% Me)

**My Contributions**
- Designed UI architecture, routing, and authentication flow
- Helped connect frontend with backend APIs 
- Defined UX patterns, validation logic, and responsive layout behavior  
- Ensured accessibility and design consistency  
- Reviewed AI-generated code for readability and performance  

**AI Contributions**
- Generated base React components and Tailwind CSS layouts  
- Implemented Zustand-based state management and API integration  
- Created reusable forms, modals, and buttons  
- Implemented initial validation logic based on my specifications  
- Assisted in writing responsive design CSS and utility hooks
- Built key components (Login, Dashboard, Admin Panel)  

---

#### 1.3 Core Responsibilities (My Work)

- **Architecture Design:** Defined backend–frontend structure, build pipeline, and deployment setup  
- **Database Modeling:** Designed entity relationships and Prisma schema  
- **API Design:** Specified REST endpoints, validation, and response types  
- **Authentication:** Built secure login, JWT management, and RBAC logic  
- **Frontend Logic:** Implemented routing, state management, and conditional rendering  
- **Testing:** Defined TDD scenarios and validated all key functionalities  
- **Code Quality:** Enforced linting, refactoring, and commit discipline  
- **CI/CD:** Configured GitHub workflows for testing and build verification  

---

### 2. How I Used AI Effectively

**Development Approach**
1. **Plan & Design:** I first outlined architecture, schema, and test cases manually.  
2. **AI Collaboration:** Used AI to generate repetitive boilerplate, relevant code files for each development phase and test structures.  
3. **Integration & Review:** Reviewed every AI-generated file, refined logic, and ensured standards.  
4. **Testing & Validation:** Followed the TDD cycle (Red → Green → Refactor) to ensure correctness.  
5. **Documentation:** Maintained detailed commit messages with AI co-authorship disclosures.  

**My Role**
- Directed all architectural and design decisions  
- Used AI as an implementation accelerator  
- Owned all business logic, testing, and validation work  
- Ensured all commits were transparent and reviewable  

---

### 3. What I Learned

**AI Collaboration**
- AI speeds up implementation but requires clear direction and validation.  
- Strong architectural planning ensures high-quality AI output.  
- TDD and AI complement each other: failing tests reveal gaps in generated code.  

**Technical Skills Strengthened**
- **Backend:** API design, JWT auth, Prisma ORM  
- **Frontend:** State management, form validation, routing  
- **Full-Stack Integration:** Seamless React–Express interaction  
- **Testing & CI:** Writing and automating tests via GitHub Actions  

**Professional Insights**
- AI improves productivity but cannot replace human judgment.  
- Consistent refactoring maintains project clarity.  
- Transparent commit history builds trust and accountability.  
- Structured TDD fosters reliable and maintainable codebases.  

---