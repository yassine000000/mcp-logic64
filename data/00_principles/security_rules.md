# Logic64 Security Rules (Layer 00)

**Principle**: "Trust Nothing, Verify Everything."

## 1. Authentication & Authorization
-   **Auth Provider**: Supabase Auth (JWT).
-   **Enforcement**: Row Level Security (RLS) on ALL database tables.
-   **Service Keys**: NEVER expose `service_role` key to client-side.

## 2. API Security
-   **Validation**: Zod schemas for all inputs.
-   **Sanitization**: All HTML outputs must be sanitized.
-   **Rate Limiting**: Enforced at the Edge (Middleware).

## 3. Data Protection
-   **Secrets**: Use `.env` files, never hardcode secrets.
-   **Encryption**: Sensitive columns (like API keys) must be encrypted at rest.
