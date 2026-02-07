# Logic64 Global Architecture (v1.0)

## 1. Core Stack
- **Runtime**: Node.js v20+ (ES Modules).
- **Monorepo Manager**: Turborepo (implied).
- **Package Manager**: npm.

## 2. The Applications
- **apps/studio**: Next.js 14 (App Router) - The Web Platform.
- **apps/kernel**: Hono (Node.js Adapter) - The MCP Server (You are here).

## 3. High-Level Principles
- **Statelessness**: The Kernel has no DB; The Studio uses Supabase.
- **Type Safety**: TypeScript Strict Mode everywhere.
- **Clean Architecture**: Separation of concerns (UI vs Logic vs Data).
