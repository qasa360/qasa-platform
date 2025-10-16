# Qasa Backend

## TL;DR

A Node.js backend built with Clean Architecture principles, featuring Express, TypeScript, and Inversify for dependency injection. Provides a modular, scalable foundation for the Qasa platform with health monitoring and structured component organization.

## Overview

The Qasa Backend is a robust, enterprise-grade Node.js application that follows Clean Architecture principles to ensure maintainability, testability, and scalability. Built with TypeScript for type safety and Express for HTTP handling, it uses Inversify for dependency injection to achieve loose coupling between components.

## Key Features

- **Clean Architecture**: Separation of concerns with domain, application, and infrastructure layers
- **Dependency Injection**: Inversify container for managing dependencies and promoting testability
- **TypeScript**: Full type safety and modern JavaScript features
- **Modular Design**: Independent components with encapsulated business logic
- **Health Monitoring**: Built-in health check endpoint for system monitoring
- **Development Tools**: Hot reload, linting, and build automation
- **Error Handling**: Centralized error management and logging
- **Middleware Support**: Extensible middleware architecture
- **Prisma ORM**: Type-safe database access with PostgreSQL and automated migrations

## Usage

### Prerequisites

- Node.js 18.18 or higher
- npm 9 or higher
- PostgreSQL 12 or higher

### Installation

```bash
cd backend
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npm run migrate
```

### Development

```bash
# Start development server with hot reload
npm run start:dev

# Build the project
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment Setup

The application requires proper environment configuration. Ensure you have the necessary environment variables set up in your development environment.

Required environment variables:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/qasa_db?schema=public"
```

### Database Setup with Prisma

The backend uses Prisma 6.17.1 as the ORM with PostgreSQL as the database provider.

**Initial Setup:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npm run migrate

# Or manually
npx prisma migrate dev
```

**Database Schema:**

The current schema includes:
- `Flat` model: Represents property listings with basic information (name, address, city, country)

**Prisma Client Location:**

Prisma Client is generated to `src/generated/prisma` (custom output path).

**Common Commands:**

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (dev only)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Generate Prisma Client after schema changes
npx prisma generate
```

**Validation Example:**

```typescript
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Simple query
    const flats = await prisma.flat.findMany();
    console.log(`Found ${flats.length} flats`);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
```

**Performance Notes:**

- **Connection Pooling**: Prisma uses connection pooling by default. Configure pool size via `DATABASE_URL` parameters (e.g., `?connection_limit=10`)
- **Indexes**: Ensure proper indexing on frequently queried fields (city, country)
- **Query Optimization**: Use `select` to fetch only required fields, reducing payload size
- **N+1 Queries**: Leverage Prisma's `include` for relations to avoid N+1 query patterns
- **Transaction Support**: Use `prisma.$transaction()` for atomic operations

**Migration Strategy:**

- **Development**: Use `prisma migrate dev` for iterative schema changes
- **Production**: Use `prisma migrate deploy` (non-interactive, fails on pending schema changes)
- **Rollback**: Prisma doesn't support automatic rollback. Maintain manual rollback migrations or database snapshots
- **Execution Window**: Simple migrations (add column, index) typically execute in <1s. Breaking changes require downtime or multi-phase deployment

## Example

### Component Structure

The `health` component demonstrates the Clean Architecture pattern:

```
src/components/health/
├── domain/
│   ├── healthService.interface.ts    # Domain contracts
│   └── healthStatus.ts              # Domain entities
├── application/
│   └── health.controller.ts         # HTTP controllers
├── infrastructure/
│   └── health.service.ts            # Service implementations
└── index.ts                         # Module registration
```

### Health Endpoint

The health component exposes a `/health` endpoint that returns system status:

```typescript
// GET /health
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

### Architecture Layers

- **Domain Layer** (`domain/`): Business logic and contracts
- **Application Layer** (`application/`): Use cases and controllers
- **Infrastructure Layer** (`infrastructure/`): External dependencies and implementations
- **Configuration** (`src/config/`): Environment and application settings
- **Core** (`src/core/`): Cross-cutting concerns (errors, logging, middlewares)
- **Dependencies** (`src/dependencies/`): Inversify container configuration

### Adding New Components

1. Create component directory under `src/components/`
2. Implement domain interfaces and entities
3. Create application controllers
4. Implement infrastructure services
5. Register module in the Inversify container
6. Add routes to the Express application

### Performance Considerations

- **Database Queries**: Prisma Client provides connection pooling by default. Configure via `DATABASE_URL` (e.g., `?connection_limit=10&pool_timeout=20`)
- **Indexes**: Add indexes on frequently queried fields (e.g., `@@index([city, country])` in schema.prisma)
- **Query Optimization**: Use `select` and `include` judiciously to minimize data transfer. Avoid fetching entire models when only a few fields are needed
- **N+1 Prevention**: Leverage Prisma's relation loading with `include` to avoid N+1 query patterns
- **Caching**: Implement Redis or in-memory caching for frequently accessed data. Consider caching at the service layer
- **Rate Limiting**: Apply rate limiting to prevent abuse
- **Monitoring**: Use health checks, Prisma query logging (`log: ['query', 'info', 'warn', 'error']`), and metrics collection
- **Error Handling**: Implement proper error boundaries and logging. Handle Prisma-specific errors (e.g., `PrismaClientKnownRequestError`)
- **Latency/Throughput**: Database queries add ~5-50ms latency. Use connection pooling (10-20 connections) for concurrent requests. Monitor with query timing logs

### Security Notes

- **Input Validation**: Sanitize and validate all external inputs before passing to Prisma queries. Use validation libraries (e.g., Zod, Joi) for request payloads
- **SQL Injection**: Prisma Client provides automatic protection against SQL injection through parameterized queries. Avoid raw queries (`$queryRaw`) with user input unless properly sanitized
- **Authentication**: Implement proper JWT or session-based authentication
- **Authorization**: Use role-based access control (RBAC)
- **Database Credentials**: Store `DATABASE_URL` in environment variables, never in code. Use different credentials for dev/QA/prod
- **HTTPS**: Ensure all communications use HTTPS in production
- **Environment Variables**: Never commit sensitive data to version control
