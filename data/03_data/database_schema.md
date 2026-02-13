# Data Domain: Core Database Schema (SQL)
**Version:** 3.0 (Production Ready)
**Context:** Supabase (PostgreSQL 15+)
**Type:** DDL (Data Definition Language)

> **Abstract:** This document defines the exact SQL schema required to host the Logic64 platform. It includes the `projects` table (which holds the SAM), the `audit_logs` table (for governance tracking), and the strict Row Level Security (RLS) policies that protect them.

---

## 1. Setup & Extensions

First, we enable the necessary Postgres extensions for UUID generation and crypto functions.

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Crypto for potential future signing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 2. Core Tables Definition

### 2.1 The Projects Table (The Brain Container)
This table stores the `logic64-state.json` (SAM) for each project.

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Ownership (Linked to Supabase Auth)
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  name TEXT NOT NULL CHECK (char_length(name) >= 3),
  description TEXT,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  
  -- The Holy Grail: Structured Architecture Memory (SAM)
  -- Default is an empty valid state structure
  architecture_state JSONB NOT NULL DEFAULT '{
    "meta": {"version": "1.0.0"}, 
    "stack": {}, 
    "modules": {}
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster JSON queries (e.g., Find all projects using "stripe")
CREATE INDEX idx_projects_arch_state ON public.projects USING GIN (architecture_state);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_projects_api_key ON public.projects(api_key);
```

### 2.2 The Audit Logs Table (The Black Box)
This table tracks every interaction between the User, Cortex, and the Codebase.

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  
  -- Who performed the action?
  actor_type TEXT NOT NULL CHECK (actor_type IN ('USER', 'CORTEX_ENGINE', 'SYSTEM')),
  
  -- What was the intent?
  intent TEXT NOT NULL,
  
  -- What was the result?
  action_type TEXT NOT NULL CHECK (action_type IN ('SCAFFOLD', 'MODIFY', 'REJECT', 'OVERRIDE')),
  
  -- The generated Blueprint (Snapshot)
  blueprint_snapshot JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for timeline analysis
CREATE INDEX idx_logs_project_date ON public.audit_logs(project_id, created_at DESC);
```

## 3. Row Level Security (RLS) Policies
**CRITICAL:** Logic64 is a multi-tenant system. RLS prevents data leaks between users.

### 3.1 Enable RLS
```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
```

### 3.2 Policies for projects
```sql
-- READ: Users can only see their own projects
CREATE POLICY "Users can view own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = owner_id);

-- WRITE: Users can create projects (owner_id is auto-set via Trigger or Client)
CREATE POLICY "Users can create projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Users can update their own projects (SAM updates)
CREATE POLICY "Users can update own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = owner_id);

-- DELETE: Users can delete their own projects
CREATE POLICY "Users can delete own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = owner_id);
```

### 3.3 Policies for audit_logs
```sql
-- READ: Users can see logs for their OWN projects only
CREATE POLICY "Users view logs for own projects" 
ON public.audit_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = audit_logs.project_id 
    AND owner_id = auth.uid()
  )
);

-- INSERT: Only the System (Service Role) should ideally insert logs, 
-- but for MVP, authenticated users trigger logs via Server Actions.
CREATE POLICY "System inserts logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = audit_logs.project_id 
    AND owner_id = auth.uid()
  )
);
```

## 4. Automation & Triggers

### 4.1 Auto-Update updated_at
Automatically refresh the timestamp whenever the Architecture State changes.

```sql
-- Function to handle timestamp update
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();
```

### 4.2 Auto-Inject owner_id (Optional Safety Net)
Ensures `owner_id` always matches the authenticated user, preventing spoofing.

```sql
CREATE OR REPLACE FUNCTION handle_new_project_owner()
RETURNS TRIGGER AS $$
BEGIN
  NEW.owner_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_owner_on_insert
BEFORE INSERT ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE handle_new_project_owner();
```

## 5. Database Functions (RPCs)
These functions are exposed to the Kernel via the Supabase Client to perform complex logic safely.

### 5.1 get_project_context
Fetches the SAM and Metadata in one secure call using the API Key (for the Kernel).

```sql
CREATE OR REPLACE FUNCTION get_project_context(lookup_api_key TEXT)
RETURNS TABLE (
  project_id UUID,
  name TEXT,
  architecture_state JSONB
) 
SECURITY DEFINER -- Runs with elevated privileges to bypass RLS (careful!)
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, architecture_state
  FROM public.projects
  WHERE api_key = lookup_api_key;
END;
$$ LANGUAGE plpgsql;
```

**Note:** The `SECURITY DEFINER` is used here because the Kernel (Server) connects via the API Key, not necessarily a user session. This acts as a "Service Account" lookup.

---

## 6. Migration & Rollback Strategy
In case of a schema disaster, use this command to reset (Dev Mode Only):

```sql
-- DANGER: DATA LOSS
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.projects;
DROP FUNCTION IF EXISTS get_project_context;
-- Re-run the CREATE commands above.
```
