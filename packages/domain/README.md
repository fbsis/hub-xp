# @domain/core

Shared domain layer for the Book Reviews Platform monorepo.

## 📋 Overview

This package contains shared entities, value objects, DTOs, and interfaces that are used across both frontend and backend applications.

## 🏗 Structure

```
src/
├── entities/          # Domain entities
│   ├── Book.ts       # Book entity and document interfaces
│   └── Review.ts     # Review entity and document interfaces
├── value-objects/     # Domain value objects
│   ├── Rating.ts     # Rating validation (1-5)
│   └── ISBN.ts       # ISBN validation and formatting
├── dtos/             # Data Transfer Objects
│   ├── CreateBookDto.ts
│   ├── UpdateBookDto.ts
│   ├── CreateReviewDto.ts
│   └── UpdateReviewDto.ts
└── interfaces/       # API response interfaces
    └── ApiResponse.ts
```

## 🚀 Usage

### In Backend (NestJS)
```typescript
import { Book, CreateBookDto, Rating } from '@domain/core';

// Use in controllers
@Post()
async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
  // Implementation
}

// Use value objects
const rating = new Rating(5);
console.log(rating.getValue()); // 5
```

### In Frontend (Next.js)
```typescript
import { Book, TopBooksResponse, Rating } from '@domain/core';

// Use in API calls
const response: TopBooksResponse = await fetch('/api/books/top');

// Use value objects for validation
if (Rating.isValid(userInput)) {
  const rating = new Rating(userInput);
}
```

## 🔧 Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Clean build artifacts
pnpm clean
```

## ✅ Features

- **Type Safety**: Shared TypeScript interfaces
- **Validation**: Class-validator decorators on DTOs
- **Value Objects**: Domain-driven design patterns
- **API Contracts**: Consistent request/response types
- **Monorepo Ready**: Workspace package for easy sharing 