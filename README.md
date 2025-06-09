# Book Reviews Platform

Uma plataforma simples para cadastro e listagem de livros, seguindo os princípios de DDD (Domain Driven Design).

## Funcionalidades Implementadas

### ✅ Backend (NestJS + MongoDB)
- **Arquitetura DDD**: Domínio, infraestrutura e aplicação separados
- **CRUD de Livros**: Endpoints para criar, listar, atualizar e deletar livros
- **Top Books**: Endpoint de agregação `/books/top` que retorna livros ordenados por rating
- **Testes**: 333 testes passando (domínio, infraestrutura e backend)
- **Mappers**: Conversão entre DTOs e entidades de domínio

### ✅ Frontend (Next.js + React Query + Tailwind)
- **Listagem de Livros**: Página inicial mostra os livros top-rated
- **Cadastro de Livros**: Formulário para adicionar novos livros
- **React Query**: Cache e sincronização de dados
- **Design Responsivo**: Interface com Tailwind CSS

### ✅ Packages Reutilizáveis
- **@domain/core**: Entidades, value objects, DTOs e mappers
- **@infrastructure/data**: Repositórios e modelos do MongoDB
- **@components/ui**: Componentes UI reutilizáveis (BookCard, BookForm)

## Como Executar

### Pré-requisitos
```bash
# Node.js 18+ e pnpm
npm install -g pnpm

# MongoDB rodando localmente ou Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Instalação
```bash
# Clone e instale dependências
git clone <repo-url>
cd hub-xp
pnpm install
```

### Executar
```bash
# Backend (porta 3001)
pnpm --filter backend dev

# Frontend (porta 3000) 
pnpm --filter frontend dev

# Ou executar ambos
pnpm dev
```

### Testes
```bash
# Executar todos os testes
pnpm test

# Testes por package
pnpm --filter @domain/core test
pnpm --filter @infrastructure/data test
pnpm --filter backend test
```

## Arquitetura

```
hub-xp/
├── apps/
│   ├── backend/         # API NestJS (porta 3001)
│   └── frontend/        # Next.js App (porta 3000)
├── packages/
│   ├── domain/          # Lógica de negócio (DDD)
│   ├── infrastructure/  # MongoDB repositories
│   └── components/      # Componentes UI reutilizáveis
```

### Fluxo DDD no Backend
```
HTTP Request (DTO) → Controller: DTO → Domain Entity → Service: Business Logic → Service: Domain Entity → DTO → Repository: Database
```

## Tecnologias

- **Backend**: NestJS, MongoDB, TypeScript, Jest
- **Frontend**: Next.js 15, React Query, Tailwind CSS
- **Arquitetura**: DDD, Clean Architecture, Monorepo
- **Testes**: Jest, Supertest (333 testes passando)

## Status

✅ **Funcionalidades Básicas Completas**:
- Listagem de livros (página inicial)
- Cadastro de livros (/books/new)
- Backend DDD com agregação
- Testes cobrindo domínio e infraestrutura

🚧 **Não Implementado** (fora do escopo básico):
- Reviews/avaliações no frontend
- Detalhes do livro
- Edição/exclusão de livros
- Autenticação
