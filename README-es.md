# 📚 Plataforma de Reseñas de Libros Hub-XP

> 🇬🇧 [Read this documentation in English](./README.md)
> 🇧🇷 [Leia esta documentação em Português](./README-ptBR.md)

Una plataforma moderna para reseñas de libros construida con **NestJS**, **Next.js**, **MongoDB** y **Arquitectura DDD**.

## 🎯 Características

- ✅ **Backend NestJS** con TypeScript y MongoDB
- ✅ **Frontend Next.js** con React Query y Tailwind CSS
- ✅ **Arquitectura DDD** (Diseño Orientado al Dominio)
- ✅ **Monorepo** con PNPM Workspaces
- ✅ **Pruebas Completas** (Unitarias + Integración + E2E)
- ✅ **Documentación Swagger** automática
- ✅ **Configuración Global** de variables de entorno

## Monorepo
Se implementó una estructura monorepo utilizando pnpm, lo que permite una configuración unificada para facilitar el uso del archivo .env, una estructura de múltiples carpetas y un único directorio node_modules. Esto resulta en una mejora significativa en la velocidad de instalación y ejecución.

La estructura fue diseñada para permitir la creación de varias aplicaciones en la carpeta /app, así como para facilitar el intercambio de componentes como dominios y objetos de valor. Esto promueve una mejor organización y reutilización del código entre las diferentes partes del proyecto, haciendo que el desarrollo sea más ágil y eficiente.

## 🚀 Inicio Rápido

### 1. Configuración del Entorno

```bash
# Clona el repositorio
git clone <repo-url>
cd hub-xp

# Configura las variables de entorno
pnpm env:setup

# Instala las dependencias
pnpm install
```

### 2. Configuración de MongoDB

```bash
# Usando Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest
```

### 3. Ejecutar la Aplicación

```bash
# Ejecuta backend + frontend simultáneamente
pnpm dev

# O ejecuta por separado:
pnpm dev:backend  # http://localhost:3001
pnpm dev:frontend # http://localhost:3000
```

## ⚙️ Configuración de Entorno

### Archivo Global `.env`

El proyecto utiliza un sistema de configuración global en la raíz. Todas las variables se cargan automáticamente:

```bash
# ==============================================
# GLOBAL ENVIRONMENT VARIABLES
# Hub-XP Book Reviews Platform
# ==============================================

# Configuración de la base de datos
MONGODB_URI=mongodb://admin:password123@localhost:27017/book_reviews?authSource=admin

# Configuración de la aplicación
NODE_ENV=development
PORT=3001

# Configuración del frontend (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Cómo Funciona

1. **Configuración Inicial**: `pnpm env:setup` copia `.env.example` a `.env`
2. **Carga Automática**: Todos los scripts usan `dotenv-cli` para cargar variables
3. **Todas las Apps**: Backend y Frontend comparten las mismas variables
4. **Entornos**: Fácil configuración para desarrollo, staging y producción

## 📖 Documentación de la API

### Swagger UI
- **URL**: http://localhost:3001/api-docs
- **JSON**: http://localhost:3001/api-docs-json

### Endpoints Principales

#### Libros
- `GET /books` - Lista paginada de libros
- `GET /books/top` - Libros mejor valorados
- `GET /books/:id` - Buscar libro por ID
- `POST /books` - Crear nuevo libro
- `PATCH /books/:id` - Actualizar libro
- `DELETE /books/:id` - Eliminar libro
- `POST /books/seed` - Poblar la base de datos con datos de ejemplo

#### Reseñas
- `GET /reviews` - Lista paginada de reseñas
- `GET /reviews/book/:bookId` - Reseñas de un libro
- `POST /reviews` - Crear nueva reseña
- `PATCH /reviews/:id` - Actualizar reseña
- `DELETE /reviews/:id` - Eliminar reseña

## 🧪 Pruebas

### Ejecutar Todas las Pruebas
```bash
pnpm test          # Pruebas unitarias + integración
pnpm test:e2e      # Pruebas end-to-end
pnpm test:coverage # Reportes de cobertura
pnpm test:summary  # Resumen de pruebas
```

### Cobertura Actual
- ✅ **Dominio**: 239 pruebas
- ✅ **Infraestructura**: 31 pruebas  
- ✅ **Backend**: 65 pruebas
- ✅ **E2E**: 27 pruebas
- 🎯 **Total**: 362 pruebas

## 🏗️ Arquitectura

### Estructura del Proyecto
```
hub-xp/
├── apps/
│   ├── backend/          # API NestJS
│   └── frontend/         # App Next.js
├── packages/
│   ├── domain/           # Lógica de negocio (DDD)
│   ├── infrastructure/   # Capa de acceso a datos
│   ├── components/       # Componentes UI compartidos
│   └── test-utils/       # Utilidades de prueba
├── .env.example          # Plantilla de variables de entorno
└── package.json          # Configuración raíz del workspace
```

### Domain Driven Design (DDD)

- **Entidades**: Book, Review
- **Objetos de Valor**: Rating, ISBN, BookTitle, etc.
- **Repositorios**: BookRepository, ReviewRepository
- **Servicios**: BooksService, ReviewsService
- **DTOs**: DTOs de creación/actualización/consulta con validación

## 🛠️ Tecnologías

### Backend
- **NestJS** - Framework Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Class Validator** - Validación de datos
- **Swagger** - Documentación automática
- **Jest** - Framework de pruebas

### Frontend
- **Next.js 15** - Framework React
- **TanStack Query** - Gestión de estado
- **Tailwind CSS** - Estilos
- **TypeScript** - Tipado estático

### DevOps & Herramientas
- **PNPM Workspaces** - Gestión de monorepo
- **ESLint & Prettier** - Calidad de código
- **dotenv-cli** - Gestión de variables de entorno
- **Concurrently** - Ejecución de scripts en paralelo

## 🚀 Deploy

### Variables de Producción

Para producción, configura estas variables en tu entorno:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/book_reviews
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Scripts de Build

```bash
pnpm build        # Compila todas las apps
pnpm build:domain # Compila la capa de dominio
```

## 📝 Contribución

1. Haz un fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'Agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles. 