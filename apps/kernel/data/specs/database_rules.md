# Database & Auth Rules (Supabase)

## 1. The Stack
- **Database**: PostgreSQL (via Supabase).
- **Auth**: Supabase Auth (GoTrue).
- **Client**: `@supabase/supabase-js`.

## 2. Schema Management
- **Source of Truth**: `apps/database/schema.sql`.
- **Migrations**: Manual SQL execution (for v1.0).
- **Keys**: Primary Keys must be `UUID` (`uuid_generate_v4()`).

## 3. Security (RLS)
- **Mandatory**: RLS (Row Level Security) MUST be enabled on ALL tables.
- **Policy Pattern**: `auth.uid() = user_id`.
- **Forbidden**: Never use `service_role` key in client-side code (`apps/studio`).

## 4. Querying
- Use the JS Client: `await supabase.from('projects').select('*')`.
- **Prohibited**: Raw SQL strings in TypeScript code (SQL Injection risk).
