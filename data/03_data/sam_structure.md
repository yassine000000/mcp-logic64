# Data Domain: Structured Architecture Memory (SAM)
**Version:** 3.0 (Strict Schema)
**Context:** `apps/kernel/data/logic64-state.json`
**Type:** Data Definition & Validation Schema

> **Abstract:** The Structured Architecture Memory (SAM) is the immutable "Single Source of Truth" for the project. It defines the constraints, technology choices, and data models that the Cortex Engine enforces. It is stored as a JSONB column in the central database but cached by the Kernel for performance.

---

## 1. The Schema Definition (TypeScript Interface)

The `logic64-state.json` file MUST adhere to the following strict TypeScript interface. Any deviation causes a governance lock-down.

```typescript
type ArchitectureState = {
  // Meta Information
  meta: {
    project_id: string; // UUID
    name: string;
    version: string; // e.g., "1.0.0"
    last_updated: string; // ISO Timestamp
  };

  // The "Golden Stack" Constraints
  stack: {
    frontend: "nextjs-app-router"; // Strict Enum
    backend: "hono-edge"; // Strict Enum
    database: "supabase-postgres"; // Strict Enum
    styling: "tailwind-shadcn"; // Strict Enum
    state_management: "server-actions" | "zustand"; 
  };

  // Feature Flags & Modules
  modules: {
    auth: {
      enabled: boolean;
      provider: "supabase-auth";
      strategies: ("email" | "oauth_google" | "oauth_github")[];
    };
    payments: {
      enabled: boolean;
      provider: "stripe" | "none";
    };
    storage: {
      enabled: boolean;
      provider: "supabase-storage";
    };
  };

  // Database Schema Snapshot (The "map")
  schema: {
    tables: Array<{
      name: string;
      columns: Array<{ name: string; type: string; required: boolean }>;
      rls_policy: "public-read" | "owner-write" | "admin-only" | "strict"; // CRITICAL
      relationships: Array<{ target_table: string; type: "one-to-many" | "one-to-one" }>;
    }>;
  };

  // File System Mapping
  directories: {
    components: string; // e.g., "components/ui"
    lib: string; // e.g., "lib/utils"
    actions: string; // e.g., "app/actions"
  };
};
```

## 2. The JSON Artifact (Example)
Below is a valid example of a logic64-state.json for a "Construction Management SaaS".

```json
{
  "meta": {
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "BinaaTrack SaaS",
    "version": "0.5.0",
    "last_updated": "2026-02-12T10:00:00Z"
  },
  "stack": {
    "frontend": "nextjs-app-router",
    "backend": "hono-edge",
    "database": "supabase-postgres",
    "styling": "tailwind-shadcn",
    "state_management": "server-actions"
  },
  "modules": {
    "auth": {
      "enabled": true,
      "provider": "supabase-auth",
      "strategies": ["email"]
    },
    "payments": {
      "enabled": false,
      "provider": "none"
    },
    "storage": {
      "enabled": true,
      "provider": "supabase-storage"
    }
  },
  "schema": {
    "tables": [
      {
        "name": "projects",
        "columns": [
          { "name": "id", "type": "uuid", "required": true },
          { "name": "name", "type": "text", "required": true },
          { "name": "budget", "type": "numeric", "required": false }
        ],
        "rls_policy": "owner-write",
        "relationships": []
      },
      {
        "name": "materials",
        "columns": [
          { "name": "id", "type": "uuid", "required": true },
          { "name": "stock_level", "type": "integer", "required": true }
        ],
        "rls_policy": "admin-only",
        "relationships": [
          { "target_table": "projects", "type": "one-to-many" }
        ]
      }
    ]
  },
  "directories": {
    "components": "components/ui",
    "lib": "lib",
    "actions": "app/_actions"
  }
}
```

## 3. Governance Rules for State Mutation

### 3.1 Write Access (Who can change this?)
* **Authorized:** `apps/studio` (The Design Council) via the Human Architect.
* **Restricted:** `apps/kernel` (Cortex Engine) can only perform additive changes (e.g., registering a new table after creation).
* **Forbidden:** The AI Client (Claude/Cursor) cannot edit this file manually.

### 3.2 Drift Detection (Validation Logic)
When the Cortex Engine starts a task, it performs a "Hash Check":
1.  Read the current `logic64-state.json`.
2.  Scan the actual codebase (via file system).
3.  **Conflict:** If state.json says "No Payments" but `stripe` is installed in `package.json`:
    - **Action:** Alert the user immediately ("Zombie Dependency Detected").

### 3.3 Security Enforcement
* **Rule:** Every table defined in `schema.tables` MUST have a non-empty `rls_policy`.
* **Effect:** If `rls_policy` is missing or "none", the Kernel refuses to generate any code interacting with that table.

---

## 4. Consumption by Cortex
When `ask_cortex("Create a login form")` is called:

1.  Cortex reads `modules.auth`.
2.  **If `modules.auth.enabled === false`**:
    - **Return:** Blueprint **REJECT** ("Auth module is disabled in SAM. Enable it in Studio first.").
3.  **If `modules.auth.enabled === true`**:
    - **Return:** Blueprint **CREATE** ("Use `supabase.auth.signInWithPassword`").
