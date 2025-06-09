# Testes Unitários - Frontend

## Resumo da Cobertura

- **Total de Testes**: 59 testes
- **Cobertura Geral**: 100% statements, 95.83% branches, 100% functions, 100% lines
- **Status**: ✅ Todos os testes passando

## Arquivos Testados

### 1. Componentes (`src/components/`)

#### BookCard.spec.tsx (14 testes)
- ✅ Renderização com dados completos e mínimos
- ✅ Exibição correta de estrelas baseada na avaliação
- ✅ Formatação de reviews (singular/plural)
- ✅ Links corretos para páginas de detalhes
- ✅ Classes CSS e estilização
- ✅ Casos extremos (avaliação 0, avaliação perfeita)
- ✅ Truncamento de títulos e descrições longas
- ✅ Tratamento de valores decimais

### 2. Serviços (`src/services/`)

#### api.spec.ts (15 testes)
- ✅ **booksApi.getTopBooks**: Busca livros top-rated com limite padrão e customizado
- ✅ **booksApi.getBook**: Busca livro individual por ID
- ✅ **booksApi.getBookReviews**: Busca reviews com paginação
- ✅ **reviewsApi.createReview**: Criação de reviews
- ✅ **reviewsApi.getReviews**: Busca todas as reviews
- ✅ Tratamento de erros HTTP (404, 500)
- ✅ Tratamento de erros de rede
- ✅ Fallback para URL da API
- ✅ Preservação de headers customizados
- ✅ Tratamento de erros de parsing JSON

### 3. Hooks Customizados (`src/hooks/`)

#### use-books.spec.ts (22 testes)
- ✅ **useTopBooks**: Busca livros top-rated com diferentes limites
- ✅ **useBook**: Busca livro individual com validação de ID
- ✅ **useBookReviews**: Busca reviews com paginação
- ✅ Tratamento de estados de loading, success, error
- ✅ Configuração de stale time
- ✅ Desabilitação de queries com IDs inválidos
- ✅ Query keys corretas para cache

#### use-reviews.spec.ts (8 testes)
- ✅ **useCreateReview**: Criação de reviews com mutation
- ✅ Invalidação de queries relacionadas após sucesso
- ✅ Tratamento de erros na criação
- ✅ Reset de estado entre mutations
- ✅ Múltiplas submissões
- ✅ Criação com dados mínimos
- ✅ Estados corretos da mutation (pending, success, error)

### 4. Providers (`src/providers/`)

#### QueryProvider.spec.tsx (8 testes)
- ✅ Renderização de children corretamente
- ✅ Inclusão do ReactQueryDevtools
- ✅ Suporte a múltiplos children
- ✅ Tratamento de children vazios
- ✅ Children aninhados complexos
- ✅ Contexto do QueryClientProvider
- ✅ Preservação da hierarquia de componentes
- ✅ Diferentes tipos de children React

## Configuração de Testes

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: { jsx: 'react-jsx' }
    }]
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**/*',
  ],
};
```

### Dependências de Teste
- `jest` - Framework de testes
- `@testing-library/react` - Utilitários para testar componentes React
- `@testing-library/jest-dom` - Matchers customizados para DOM
- `@testing-library/user-event` - Simulação de eventos de usuário
- `ts-jest` - Suporte a TypeScript no Jest
- `jest-environment-jsdom` - Ambiente DOM para testes

## Mocks Utilizados

### Next.js Link
```typescript
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});
```

### React Query DevTools
```typescript
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: ({ initialIsOpen }: { initialIsOpen: boolean }) => (
    <div data-testid="react-query-devtools" data-initial-open={initialIsOpen}>
      DevTools
    </div>
  ),
}));
```

### API Services
```typescript
jest.mock('@/services/api');
const mockBooksApi = booksApi as jest.Mocked<typeof booksApi>;
```

## Scripts de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Padrões de Teste

### Estrutura de Testes
- **Arrange**: Configuração de mocks e dados de teste
- **Act**: Execução da funcionalidade testada
- **Assert**: Verificação dos resultados esperados

### Nomenclatura
- Arquivos de teste: `*.spec.ts` ou `*.spec.tsx`
- Describe blocks: Nome do componente/função + "Component"/"hook"
- Test cases: Descrição clara do comportamento testado

### Cobertura de Casos
- ✅ Casos de sucesso (happy path)
- ✅ Casos de erro e edge cases
- ✅ Estados de loading e empty
- ✅ Validação de props e parâmetros
- ✅ Interações do usuário
- ✅ Integração com APIs e hooks

## Resultados

**Cobertura Final:**
- **Statements**: 100%
- **Branches**: 95.83%
- **Functions**: 100%
- **Lines**: 100%

**Total**: 59 testes passando ✅

Os testes garantem a qualidade e confiabilidade do código frontend, cobrindo todos os componentes, serviços, hooks e providers da aplicação. 