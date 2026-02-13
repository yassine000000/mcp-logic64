# Logic64 Deployment Architecture (Layer 01)

**Strategy**: Vercel (Frontend/Edge) + Supabase (Data).

## 1. Infrastructure
-   **Frontend**: Vercel (Global CDN, Edge Functions).
-   **Backend**: Vercel Serverless Functions / Hono on Edge.
-   **Database**: Supabase (PostgreSQL) hosted in AWS (Frankfurt/London).

## 2. CI/CD Pipeline
-   **Provider**: GitHub Actions.
-   **Triggers**: Push to `main` (Production), PR (Preview).
-   **Steps**:
    1.  Lint (ESLint).
    2.  Type Check (TypeScript).
    3.  Build (Next.js Build).
    4.  Test (End-to-End).

## 3. Environment Variables
-   Managed via Vercel Project Settings / Supabase Dashboard.
-   Sync for local dev: `vercel env pull`.
