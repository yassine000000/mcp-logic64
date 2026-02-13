# Logic64 Schema Design (Layer 03)

**Database**: PostgreSQL (Supabase/Neon)

## 1. Core Rules
-   **Primary Keys**: MUST be `uuid` (v4).
-   **Timestamps**: `created_at` and `updated_at` on all tables.
-   **Security**: RLS (Row Level Security) ENABLED by default.

## 2. Schema Conventions
-   **Snake_case**: table_names and column_names.
-   **Foreign Keys**: Explicit naming (`user_id` references `users.id`).
-   **No Nulls**: Avoid nullable columns unless strictly necessary.

## 3. Migrations
-   Managed via Supabase CLI.
-   Source of truth is SQL/migrations folder.
