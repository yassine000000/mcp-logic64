# Database Rules (Neon & Drizzle)

## 1. The Stack
- **Database**: Neon (Serverless PostgreSQL).
- **ORM**: Drizzle ORM.
- **Driver**: `@neondatabase/serverless`.
- **Migrations**: Drizzle Kit.

## 2. Schema Management
- **Source of Truth**: TypeScript Schema (`schema.ts`).
- **Migrations**: Automated via `drizzle-kit push` or `generate`.
- **Keys**: Use UUIDs for all primary keys (`uuid()`).

## 3. Connection & Security
- **Connection String**: stored in `DATABASE_URL` (Env Variable).
- **Pooling**: Use Neon's connection pooling for serverless environments.
- **Edge Compatibility**: Must use the serverless driver for Edge functions (Hono/Next.js).

## 4. Querying Pattern
- **Style**: Functional, type-safe queries.
- **Example**: `await db.select().from(projects).where(eq(projects.id, id))`.
- **Prohibited**: Raw SQL strings (unless absolutely necessary for complex CTEs).
