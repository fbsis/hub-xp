# 📚 Hub-XP Book Reviews Platform

Uma plataforma moderna para avaliação de livros construída com **NestJS**, **Next.js**, **MongoDB** e **DDD Architecture**.

## 🎯 Características

- ✅ **Backend NestJS** com TypeScript e MongoDB
- ✅ **Frontend Next.js** com React Query e Tailwind CSS
- ✅ **Arquitetura DDD** (Domain Driven Design)
- ✅ **Monorepo** com PNPM Workspaces
- ✅ **Testes Completos** (Unit + Integration + E2E)
- ✅ **Documentação Swagger** automática
- ✅ **Configuração Global** de variáveis de ambiente

## 🚀 Quick Start

### 1. Configuração de Ambiente

```bash
# Clone o repositório
git clone <repo-url>
cd hub-xp

# Configure as variáveis de ambiente
pnpm env:setup

# Instale as dependências
pnpm install
```

### 2. Configuração do MongoDB

```bash
# Usando Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest
```

### 3. Executar Aplicação

```bash
# Executa backend + frontend simultaneamente
pnpm dev

# Ou executar separadamente:
pnpm dev:backend  # http://localhost:3001
pnpm dev:frontend # http://localhost:3000
```

## ⚙️ Configuração de Ambiente

### Arquivo Global `.env`

O projeto usa um sistema de configuração global na raiz. Todas as variáveis são carregadas automaticamente:

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

### Como Funciona

1. **Setup Inicial**: `pnpm env:setup` copia `.env.example` para `.env`
2. **Carregamento Automático**: Todos os scripts usam `dotenv-cli` para carregar variáveis
3. **Todas as Apps**: Backend e Frontend compartilham as mesmas variáveis
4. **Ambientes**: Fácil configuração para dev, staging e produção

## 📖 API Documentação

### Swagger UI
- **URL**: http://localhost:3001/api-docs
- **JSON**: http://localhost:3001/api-docs-json

### Principais Endpoints

#### Books
- `GET /books` - Lista paginada de livros
- `GET /books/top` - Top livros por avaliação
- `GET /books/:id` - Buscar livro por ID
- `POST /books` - Criar novo livro
- `PATCH /books/:id` - Atualizar livro
- `DELETE /books/:id` - Deletar livro
- `POST /books/seed` - Popular banco com dados de exemplo

#### Reviews
- `GET /reviews` - Lista paginada de avaliações
- `GET /reviews/book/:bookId` - Avaliações de um livro
- `POST /reviews` - Criar nova avaliação
- `PATCH /reviews/:id` - Atualizar avaliação
- `DELETE /reviews/:id` - Deletar avaliação

## 🧪 Testes

### Executar Todos os Testes
```bash
pnpm test          # Unit + Integration tests
pnpm test:e2e      # End-to-end tests
pnpm test:coverage # Coverage reports
pnpm test:summary  # Resumo dos testes
```

### Cobertura Atual
- ✅ **Domain**: 239 testes
- ✅ **Infrastructure**: 31 testes  
- ✅ **Backend**: 65 testes
- ✅ **E2E**: 27 testes
- 🎯 **Total**: 362 testes

## 🏗️ Arquitetura

### Estrutura do Projeto
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
- **DTOs**: Create/Update/Get DTOs com validação

## 🛠️ Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Class Validator** - Validação de dados
- **Swagger** - Documentação automática
- **Jest** - Framework de testes

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

### Variáveis de Produção

Para produção, configure essas variáveis no seu ambiente:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/book_reviews
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_URL=https://api.seudominio.com
```

### Scripts de Build

```bash
pnpm build        # Build all apps
pnpm build:domain # Build domain layer
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.
