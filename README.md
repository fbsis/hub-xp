# 📚 Hub-XP Book Reviews Platform

> 🇧🇷 [Leia esta documentação em Português](./README-ptBR.md)
> 🇪🇸 [Lea esta documentación en Español](./README-es.md)

A modern platform for book reviews built with **NestJS**, **Next.js**, **MongoDB**, and **DDD Architecture**.

## 🎯 Features

- ✅ **NestJS Backend** with TypeScript and MongoDB
- ✅ **Next.js Frontend** with React Query and Tailwind CSS
- ✅ **DDD Architecture** (Domain Driven Design)
- ✅ **Monorepo** with PNPM Workspaces
- ✅ **Comprehensive Testing** (Unit + Integration + E2E)
- ✅ **Automatic Swagger Documentation**
- ✅ **Global Environment Configuration**

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone <repo-url>
cd hub-xp

# Set up environment variables
pnpm env:setup

# Install dependencies
pnpm install
```

### 2. MongoDB Setup

```bash
# Using Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest
```

### 3. Run Application

```bash
# Run backend + frontend simultaneously
pnpm dev

# Or run separately:
pnpm dev:backend  # http://localhost:3001
pnpm dev:frontend # http://localhost:3000
```

## ⚙️ Environment Configuration

### Global `.env` File

The project uses a global configuration system at the root. All variables are loaded automatically:

```bash
# ==============================================
# GLOBAL ENVIRONMENT VARIABLES
# Hub-XP Book Reviews Platform
# ==============================================

# Database Configuration
MONGODB_URI=mongodb://admin:password123@localhost:27017/book_reviews?authSource=admin

# Application Configuration
NODE_ENV=development
PORT=3001

# Frontend Configuration (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### How It Works

1. **Initial Setup**: `pnpm env:setup` copies `.env.example` to `.env`
2. **Automatic Loading**: All scripts use `dotenv-cli` to load variables
3. **All Apps**: Backend and Frontend share the same variables
4. **Environments**: Easy setup for dev, staging, and production

## 📖 API Documentation

### Swagger UI
- **URL**: http://localhost:3001/api-docs
- **JSON**: http://localhost:3001/api-docs-json

### Main Endpoints

#### Books
- `GET /books` - Paginated list of books
- `GET /books/top` - Top books by rating
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `POST /books/seed` - Seed database with sample data

#### Reviews
- `GET /reviews` - Paginated list of reviews
- `GET /reviews/book/:bookId` - Reviews for a book
- `POST /reviews` - Create new review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

## 🧪 Testing

### Run All Tests
```bash
pnpm test          # Unit + Integration tests
pnpm test:e2e      # End-to-end tests
pnpm test:coverage # Coverage reports
pnpm test:summary  # Test summary
```

### Current Coverage
- ✅ **Domain**: 239 tests
- ✅ **Infrastructure**: 31 tests  
- ✅ **Backend**: 65 tests
- ✅ **E2E**: 27 tests
- 🎯 **Total**: 362 tests

## 🏗️ Architecture

### Project Structure
```
hub-xp/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js App
├── packages/
│   ├── domain/           # Business Logic (DDD)
│   ├── infrastructure/   # Data Access Layer
│   ├── components/       # Shared UI Components
│   └── test-utils/       # Test Utilities
├── .env.example          # Global environment template
└── package.json          # Root workspace config
```

### Domain Driven Design (DDD)

- **Entities**: Book, Review
- **Value Objects**: Rating, ISBN, BookTitle, etc.
- **Repositories**: BookRepository, ReviewRepository
- **Services**: BooksService, ReviewsService
- **DTOs**: Create/Update/Get DTOs with validation

## 🛠️ Technologies

### Backend
- **NestJS** - Node.js Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM for MongoDB
- **Class Validator** - Data validation
- **Swagger** - Automatic documentation
- **Jest** - Testing framework

### Frontend
- **Next.js 15** - React Framework
- **TanStack Query** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### DevOps & Tooling
- **PNPM Workspaces** - Monorepo management
- **ESLint & Prettier** - Code quality
- **dotenv-cli** - Environment management
- **Concurrently** - Parallel script execution

## 🚀 Deploy

### Production Variables

For production, set these variables in your environment:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/book_reviews
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Build Scripts

```bash
pnpm build        # Build all apps
pnpm build:domain # Build domain layer
```

## 📝 Contributing

1. Fork the project
2. Create a branch: `git checkout -b feature/new-feature`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-feature`
5. Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
