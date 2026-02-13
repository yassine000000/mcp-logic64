# The Cortex Engine: Hybrid Governance Architecture
**Version:** 3.0 (Deep Logic)
**Type:** Technical Specification
**Component:** `apps/kernel/src/cortex`

> **Abstract:** The Cortex Engine is the central intelligence unit of the Logic64 Kernel. Unlike standard RAG systems that simply retrieve text, Cortex operates as a **Semantic Compiler**. It translates high-level user intents into strict, executable JSON Blueprints using a hybrid "Deterministic + Inference" pipeline.

---

## 1. The Core Philosophy: "No Code Without a Blueprint"

The Engine enforces a strict separation of concerns:
1.  **The User** provides the **Intent** (The "What").
2.  **The Cortex** provides the **Blueprint** (The "How").
3.  **The Client AI** (Claude/Cursor) performs the **Coding** (The "Implementation").

This prevents "Architectural Drift" where the AI invents new patterns or libraries on the fly.

---

## 2. The Hybrid Architecture (2-Layer System)

To balance speed, cost, and accuracy, Cortex uses a dual-layer processing model:

### Layer A: The Deterministic Resolver (The "Hard" Logic)
* **Technology:** TypeScript / Node.js Logic (Zero Latency).
* **Function:** Direct lookup against `logic64-state.json` (SAM).
* **Responsibility:**
    * **Stack Validation:** Checks if requested libraries exist in the approved stack.
    * **Security Constraints:** Checks if RLS is enabled for DB operations.
    * **Path Resolution:** Determines the correct file structure based on `coding_standards.md`.
* **Example:** User asks for "Redux". Resolver checks SAM. SAM says `state: "zustand"`. Resolver flags a **Hard Rejection**.

### Layer B: The Inference Synthesizer (The "Soft" Logic)
* **Technology:** Lightweight LLM (via Vercel AI SDK Core).
* **Function:** Contextual reasoning and code planning.
* **Responsibility:**
    * **Intent Understanding:** Parsing natural language (e.g., "Make it pop" -> "Use Framer Motion").
    * **Logic Chaining:** Connecting the database schema to the UI components.
    * **Blueprint Generation:** Constructing the JSON plan.

---

## 3. The Execution Pipeline (The 4-Step Flow)

When `ask_cortex(intent)` is called, the following pipeline executes:

### Step 1: Context Hydration 💧
The Engine loads the **Structured Architecture Memory (SAM)** from the database. It does *not* read the whole codebase. It only cares about the *rules*.
-   *Input:* `intent: "Create a user profile page"`
-   *Loaded Context:* `auth: true`, `db: supabase`, `ui: shadcn`.

### Step 2: Constraint Analysis 🛡️
Layer A (Deterministic) scans the intent for forbidden keywords.
-   *Check:* Does "profile page" require Auth? -> Yes.
-   *Check:* Is "profile" table defined in SAM? -> Yes.
-   *Result:* Proceed.

### Step 3: Blueprint Synthesis 🧬
Layer B (Inference) receives a "Sanitized Prompt":
> "User wants a profile page. Stack is Next.js/Supabase. Table is 'profiles'. Generate a JSON Blueprint. DO NOT generate code."

### Step 4: Output Validation ✅
The output JSON is validated against a Zod Schema to ensure it has no syntax errors before being sent back to the Client AI.

---

## 4. The Blueprint Protocol (JSON Output Standard)

The Cortex Engine does not return chat text. It returns a **Structured Blueprint**.

### Schema Definition
```typescript
type Blueprint = {
  type: "CREATE" | "MODIFY" | "REJECT";
  target_file: string;
  imports: string[];
  logic_steps: string[];
  security_checks: string[];
  code_snippet_hint?: string; // Optional, for complex logic
};
```

### Example Output (What Claude Receives)
```json
{
  "type": "CREATE",
  "target_file": "app/profile/page.tsx",
  "imports": [
    "createServerComponentClient from @supabase/auth-helpers-nextjs",
    "redirect from next/navigation",
    "Card from @/components/ui/card"
  ],
  "logic_steps": [
    "1. Initialize Supabase Server Client.",
    "2. Check active session. If null, redirect to /login.",
    "3. Select * from 'profiles' where id = session.user.id.",
    "4. Render data inside a Card component."
  ],
  "security_checks": [
    "Ensure RLS policy 'Users can view own profile' exists."
  ]
}
```

---

## 5. Error Handling & Rejection Protocols

### Protocol A: The "Architectural Veto"
If the user asks for something that violates Layer A (Rules), Cortex returns a Rejection Blueprint:

```json
{
  "type": "REJECT",
  "reason": "Stack Violation",
  "message": "You requested 'Axios', but the Architecture State mandates 'Server Actions' or 'Fetch API'. Please use the approved method."
}
```

### Protocol B: The "Ambiguity Fallback"
If the intent is too vague (e.g., "Fix the bug"), Cortex returns a Clarification Request:

```json
{
  "type": "CLARIFY",
  "message": "I cannot generate a Blueprint without context. Which file or feature are you referring to?"
}
```

## 6. Self-Correction Mechanism
The Engine includes a feedback loop. If the Client AI attempts to generate code that fails the Blueprint's constraints (e.g., forgets an import), the Kernel can intercept the save operation (future V4 feature) or provide a linting error via MCP.
