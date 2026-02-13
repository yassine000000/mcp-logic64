# Domain: The Architecture Council (Studio Logic)
**Version:** 3.0
**Context:** `apps/studio`
**Type:** Business Logic & Workflow Definition

> **Abstract:** The Architecture Council is a deterministic, multi-agent pipeline designed to generate the `logic64-state.json` (SAM). It replaces unstructured chat with a strict **"Draft → Critique → Synthesize"** workflow, ensuring that every project starts with a robust, secure, and token-efficient architecture.

---

## 1. The Sequential Pipeline (The Assembly Line)

Unlike a "Chat Mesh" where agents talk over each other, the Council operates as a linear pipeline to ensure speed and predictability.

### Stage 1: The Builder (Architect Agent) 👷
* **Input:** User's raw idea (e.g., "A real-time auction platform").
* **Role:** Optimistic Creator.
* **Directive:** "Assume the best-case scenario. Propose the most modern, developer-friendly stack (Next.js + Supabase)."
* **Output:** `Draft Architecture (JSON)`.
* **Constraint:** Must strictly adhere to the **Golden Stack** defined in `coding_standards.md`.

### Stage 2: The Critic (Security Agent) 🛡️
* **Input:** `Draft Architecture` from Stage 1.
* **Role:** Pessimistic Auditor.
* **Directive:** "Find holes. Look for scalability bottlenecks, security risks (RLS missing?), and cost explosions (Vector DBs unnecessarily?)."
* **Output:** `Critique Report (JSON)` containing a list of `Risks` and `Violations`.
* **Constraint:** Cannot propose a *new* architecture; only flags issues in the draft.

### Stage 3: The Moderator (Synthesis Agent) ⚖️
* **Input:** `Draft Architecture` + `Critique Report`.
* **Role:** The Decision Maker.
* **Logic:**
    1.  **Auto-Fix:** If critiques are minor (e.g., "Missing RLS flag"), fix them automatically.
    2.  **Consensus:** If the draft is solid, approve it.
    3.  **Conflict:** If there is a strategic trade-off, **STOP** and ask the User.
* **Output:** `Final SAM (JSON)` OR `Decision Request Payload`.

---

## 2. The Human-in-the-Loop Protocol (Decision Cards)

When the Moderator detects a conflict that requires business context, it generates a **Decision Card**.

### Conflict Scenarios
1.  **Cost vs. Performance:**
    * *Builder:* "Use dedicated Redis for caching."
    * *Critic:* "Too expensive for MVP. Use Postgres generic cache."
    * *Moderator:* **"User, do you want speed ($$$) or savings ($)?"**
2.  **Simplicity vs. Scalability:**
    * *Builder:* "Use Supabase Edge Functions."
    * *Critic:* "Hard to debug. Use standard Next.js API Routes for now."
    * *Moderator:* **"User, do you want easier debugging or edge performance?"**

### The Decision Payload Structure
When this happens, the UI receives:
```json
{
  "status": "REQUIRES_USER_DECISION",
  "decision_card": {
    "title": "Real-time Architecture Strategy",
    "question": "How should we handle live bid updates?",
    "options": [
      {
        "id": "opt_A",
        "label": "Polling (Cheaper)",
        "pros": ["Free tier compatible", "Simple setup"],
        "cons": ["Slower updates (3s latency)"]
      },
      {
        "id": "opt_B",
        "label": "Realtime Subscriptions (Faster)",
        "pros": ["Instant updates (100ms)", "Better UX"],
        "cons": ["Costs scale with concurrent users"]
      }
    ]
  }
}
```

---

## 3. Data Schema: The Output (SAM)
The final goal of the Council is to produce the Structured Architecture Memory.

### logic64-state.json Specification
```typescript
interface Logic64State {
  meta: {
    name: string;
    description: string;
    version: "1.0.0";
  };
  stack: {
    frontend: "nextjs-app-router";
    backend: "hono-edge";
    database: "supabase-postgres";
    auth_provider: "supabase-auth" | "clerk" | "none"; // Strict Enums
  };
  database: {
    tables: Array<{
      name: string;
      columns: string[];
      rls_policy: "public-read" | "owner-write" | "admin-only"; // Enforced
    }>;
  };
  features: Array<{
    name: string; // e.g., "Payment Gateway"
    status: "active" | "planned";
    technical_implementation: string; // "Stripe Connect via Server Actions"
  }>;
}
```

---

## 4. Failure Modes & Recovery

### 4.1 The "Loop Prevention" Mechanism
* **Risk:** Agents arguing indefinitely.
* **Solution:** The pipeline is strictly linear (1 pass). There is no "back-and-forth" chat. If the Moderator cannot decide after one pass, it defaults to asking the User.

### 4.2 The "Hallucination Firewall"
* **Risk:** The Builder proposes a non-existent library.
* **Solution:** The Moderator validates the final JSON against the `coding_standards.md` allowlist. If a library is not on the list, it is stripped out or replaced with a standard alternative.
