# Logic64 System Context Architecture
**Version:** 3.0 (Cortex Integration)
**Model:** C4 Level 1 (System Context)
**Scope:** Global Ecosystem

> **Abstract:** Logic64 is a dual-engine SaaS platform designed to govern AI-assisted software development. It decouples **Strategic Design** (handled by the Studio) from **Tactical Execution** (handled by the Kernel), linked by a shared **Structured Architecture Memory (SAM)**.

---

## 1. High-Level System Diagram

The system operates on a "Hub and Spoke" model where the Database acts as the state hub, and the Kernel acts as the enforcement gateway for the AI.

```text
+-----------------+       +-------------------+       +------------------+
|  Human Architect|       |   Design Studio   |       |   Supabase DB    |
|     (User)      |------>|   (Next.js App)   |------>| (Shared State)   |
+-----------------+       +-------------------+       +------------------+
        |                          |                           ^
        |                          v                           |
        |                 +-------------------+                |
        +---------------->| AI Client (IDE)   |                |
                          | (Cursor/Claude)   |                |
                          +-------------------+                |
                                   |                           |
                          (MCP / SSE Protocol)                 |
                                   v                           |
                          +-------------------+                |
                          |   Cloud Kernel    |----------------+
                          | (Cortex Engine)   |   (Reads SAM)
                          +-------------------+
```

## 2. Core Systems & Responsibilities

### 2.1 The Design Studio (`apps/studio`)
The Strategic Command Center.

- **Primary Actor:** The Human User (assisted by the Multi-Agent Council).
- **Responsibility:**
    - Defines the project vision.
    - Selects the Tech Stack.
    - Resolves architectural trade-offs (e.g., Cost vs. Performance).
- **Write Authority:** It is the only system authorized to fully mutate the `logic64-state.json` (SAM).

### 2.2 The Cloud Kernel (`apps/kernel`)
The Tactical Enforcement Engine.

- **Primary Actor:** The AI Assistant (via MCP).
- **Responsibility:**
    - Intercepts user intents from the IDE.
    - Consults the SAM to understand constraints.
    - Generates execution Blueprints (implementation plans).
- **Read Authority:** It reads the SAM to enforce rules but rarely modifies it directly (except for minor metadata updates).

### 2.3 The Structured Architecture Memory (SAM)
The Constitutional Interface.

- **Location:** Postgres Database (Column: `projects.architecture_state`).
- **Format:** JSON (Strict Schema).
- **Function:** Acts as the "Contract" between Studio and Kernel. If a library is not in SAM, it does not exist in the project universe.

---

## 3. Data Flow Scenarios

### Scenario A: Initialization (The "Big Bang")
1.  **User** visits Studio and describes a "SaaS for Construction".
2.  **AI Council** (Builder/Critic/Moderator) debates and converges on a stack.
3.  **Studio** writes the initial `logic64-state.json` to Supabase.
    - State: `{ "db": "supabase", "auth": "true", "ui": "shadcn" }`

### Scenario B: Execution (The "Build Loop")
1.  **User** in IDE asks: "Create a dashboard for project managers."
2.  **AI Client** calls MCP Tool: `ask_cortex(intent="Create PM Dashboard")`.
3.  **Kernel** (Cortex):
    - Fetches SAM from Supabase.
    - Sees `ui: "shadcn"` and `db: "supabase"`.
    - Generates Blueprint: "Create `app/dashboard/page.tsx`. Use `Card` from `@/components/ui/card`. Fetch data via Server Action."
4.  **AI Client** receives Blueprint and generates code.

### Scenario C: Drift Prevention (The "Guardrail")
1.  **User** in IDE asks: "Install Redux for state management."
2.  **AI Client** calls `ask_cortex`.
3.  **Kernel** (Cortex) checks SAM.
4.  **SAM** says: `"state_management": "server-actions + hooks"`.
5.  **Result:** Cortex returns a **Rejection Blueprint**.
    - Message: "Architecture Violation: Redux is not in the approved stack. Use React Context or Server Actions as defined in the Studio."

---

## 4. System Boundaries & Constraints

### 4.1 The "No-Ghost-Writing" Rule
The Kernel (Cortex) generates Plans (Blueprints), not final code files. The AI Client (IDE) is responsible for the actual syntax generation based on the plan. This ensures the Human remains in the loop to review the code before saving.

### 4.2 The "Lazy Context" Boundary
The Kernel does NOT feed the entire codebase to the AI Client. It only provides:
- The Project Manifest (Index).
- The Specific Blueprint for the current task.
This keeps the context window clean and reduces "hallucination" rates significantly.

### 4.3 Network Isolation
- **Studio:** Has public internet access for Auth/Payments.
- **Kernel:** Operates in a secure environment. It does not browse the live web to fetch documentation; it relies on its internal indexed knowledge base (`02_domains/*.md`) to answer architectural queries.
