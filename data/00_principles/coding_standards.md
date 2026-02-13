# Logic64 Engineering Guidelines & Coding Standards
**Version:** 3.0
**Enforcement:** Mandatory
**Context:** Applies to all AI-generated code and human contributions.

---

## 1. The "Golden Stack" (Non-Negotiable)
Any deviation from this stack requires written approval in `logic64-state.json`.

| Category | Technology | Constraint |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | NEVER use `pages/` directory. NEVER use legacy API routes. |
| **Language** | **TypeScript (Strict)** | No `any` type allowed. Use Zod for runtime validation. |
| **Styling** | **Tailwind CSS** | No CSS Modules, no Styled Components. Use `cn()` utility for class merging. |
| **Components** | **Shadcn/UI** | Do not build generic UI components from scratch. Extend Shadcn. |
| **Icons** | **Lucide React** | The only approved icon set. |
| **Backend** | **Hono** | Deployable on Edge. Stateless execution. |
| **Database** | **Supabase (PostgreSQL)** | Direct SQL or Supabase JS Client. NO Prisma (unless specified). |
| **State** | **React Server Actions** | Preferred over REST API for mutations. |

---

## 2. Next.js 14 Architecture Rules

### 2.1 Server Components by Default
- **Rule:** All components are **Server Components (RSC)** unless they absolutely require interactivity.
- **Directives:** Only add `"use client"` at the very top of leaf components that use:
  - `useState`, `useEffect`, `useRef`.
  - Event listeners (`onClick`, `onChange`).
  - Browser APIs (`window`, `document`).

### 2.2 Data Fetching
- **APPROVED:** Fetch data directly in Server Components using `async/await`.
  ```tsx
  // ✅ Correct
  export default async function Page() {
    const data = await db.query(...);
    return <View data={data} />;
  }
  ```

- **FORBIDDEN:** Using `useEffect` to fetch data on mount.

```typescript
// ❌ Forbidden
useEffect(() => { fetch('/api/data')... }, []); 
```

### 2.3 Server Actions vs API Routes
- **Preference:** Use Server Actions (`actions.ts`) for form submissions and mutations.
- **Validation:** All inputs MUST be validated with Zod before processing.

---

## 3. Database & Security (Supabase)

### 3.1 Row Level Security (RLS)
- **CRITICAL:** RLS must be enabled on ALL tables created.
- **Rule:** Never create a table without immediately adding an RLS policy.

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
```

### 3.2 Client-Side Safety
- **Forbidden:** NEVER expose the `service_role` key to the client.
- **Approved:** Use `createClientComponentClient` for client-side and `createServerComponentClient` for server-side operations.

---

## 4. Naming Conventions
Consistency helps the Cortex Engine predict file paths.

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Files & Folders** | kebab-case | `user-profile.tsx`, `apps/studio` |
| **Components** | PascalCase | `UserProfile`, `SubmitButton` |
| **Functions** | camelCase | `handleSubmit`, `fetchUserData` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_THEME` |
| **DB Tables** | snake_case (Plural) | `users`, `project_settings` |
| **DB Columns** | snake_case | `created_at`, `user_id` |

---

## 5. Project Structure (Monorepo)

```text
logic64/
├── apps/
│   ├── studio/          # The Next.js Design Interface
│   └── kernel/          # The Hono MCP Server
├── packages/
│   ├── ui/              # Shared Shadcn components
│   ├── config/          # Shared ESLint/TSConfig
│   └── database/        # Shared Drizzle/Supabase types
└── turbo.json           # Build pipeline definition
```

- **Rule:** If a UI component is used in both studio and kernel (dashboard), move it to `packages/ui`.
- **Rule:** Do not create circular dependencies between packages.

---

## 6. Error Handling
- **UI:** Use `error.tsx` in Next.js App Router for boundary handling.
- **Backend:** Use standard HTTP codes.
  - 400 for Validation Error (Zod).
  - 401 for Auth Missing.
  - 403 for RLS/Permission Violation.
  - 500 for System Errors.
- **Logging:** Do not use `console.log` in production. Use a structured logger or `console.error` for critical failures only.

---

## 7. AI Directives (For Claude/Cursor)
- **Be Lazy:** Do not generate code for an entire file if only one function needs changing.
- **Be Specific:** Always import specific icons/components. Do not use `import *`.
- **No Hallucinations:** If a library (like a specific chart lib) is not in `logic64-state.json`, DO NOT use it. Ask the user or use standard HTML/CSS.
- **Types First:** Define the Zod schema or TypeScript interface before writing the implementation logic.
