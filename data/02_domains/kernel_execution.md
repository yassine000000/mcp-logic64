# Domain: Kernel Execution Logic (Runtime)
**Version:** 3.0
**Context:** `apps/kernel`
**Type:** Execution Protocol & Blueprint Enforcement

> **Abstract:** This domain defines the rules for the **"Intent-to-Blueprint"** loop. It governs how the Kernel intercepts raw user intents from the IDE and converts them into safe, compliant, and architectural-aware execution plans (Blueprints), rejecting any request that violates the `logic64-state.json`.

---

## 1. The Execution Lifecycle (The Runtime Loop)

The Kernel operates as a **Stateless Decision Engine**. It does not "remember" the chat history; it only assesses the *current* intent against the *permanent* architecture.

### Phase 1: Ingestion (Reception)
* **Trigger:** The AI Client calls `ask_cortex(intent, current_file)`.
* **Action:** The Kernel parses the intent semantically.
    * *Raw:* "Add a button here."
    * *Parsed:* `Action: UI_Component_Insertion`, `Context: current_file`.

### Phase 2: Hydration (Context Loading)
* **Action:** The Kernel fetches the **Structured Architecture Memory (SAM)** from the database.
* **Filter:** It loads only the relevant slice of the architecture.
    * *If Intent is UI:* Load `stack.frontend` (Tailwind/Shadcn).
    * *If Intent is DB:* Load `stack.database` (Supabase/RLS).

### Phase 3: Synthesis (Blueprint Generation)
* **Logic:** The Hybrid Cortex Engine (Deterministic + Inference) constructs the plan.
* **Validation:**
    * *Check 1:* Is the requested library in SAM? (e.g., "User wants Axios, SAM says Fetch"). -> **Reject**.
    * *Check 2:* Does the new table have RLS? -> **Enforce**.

### Phase 4: Delivery (Instruction)
* **Output:** The Kernel returns a **JSON Blueprint**.
* **Constraint:** The AI Client MUST execute this Blueprint exactly, without "improvising" new patterns.

---

## 2. The Blueprint Specification (Output Standard)

The Kernel communicates exclusively via **Blueprints**. A Blueprint is a JSON object that serves as a "Micro-Spec" for a single task.

### 2.1 Blueprint Types

| Type | Description |
| :--- | :--- |
| **`SCAFFOLD`** | Creating new files or directory structures. |
| **`MODIFY`** | Editing existing logic (refactoring). |
| **`INTEGRATE`** | Connecting two modules (e.g., API to Frontend). |
| **`REJECT`** | Blocking a request due to governance violation. |

### 2.2 The Blueprint Schema
```typescript
interface ExecutionBlueprint {
  type: "SCAFFOLD" | "MODIFY" | "INTEGRATE" | "REJECT";
  
  // The Target
  target: {
    path: string; // "app/dashboard/page.tsx"
    component_name?: string;
  };

  // The "How-To"
  specs: {
    imports: string[]; // ["createClient from utils/supabase/server"]
    scaffolding: string[]; // Steps to build the component
    validation_rules: string[]; // ["Use Zod for inputs", "Check Session"]
  };

  // Governance
  compliance_check: {
    approved_stack: boolean;
    security_flag: "LOW" | "HIGH"; // HIGH requires RLS check
  };
}
```

---

## 3. Drift Detection & Prevention (The Guardrails)
The Kernel's primary job is to say "NO" to bad architecture.

### Scenario A: The "Stack Drift" Attempt
* **User Intent:** "Install react-query for caching."
* **SAM Check:** `fetching_strategy: "server-components"`.
* **Kernel Response (REJECT):**

```json
{
  "type": "REJECT",
  "reason": "Architectural Violation",
  "message": "React Query is not in the approved stack. Logic64 enforces 'Server Components' for fetching. Please use 'await db.query()' directly in the RSC."
}
```

### Scenario B: The "Security Bypass" Attempt
* **User Intent:** "Create a public API route to list all users."
* **SAM Check:** `auth: "supabase-auth"`.
* **Kernel Response (MODIFY):**
The Kernel accepts the request but forces security into the Blueprint.
* **Added Spec:** "MUST verify `supabase.auth.getUser()` before returning data."

---

## 4. Token Efficiency Strategy (Lazy Execution)
To keep the system fast and cheap:

*   **No "Context Dumping":** The Kernel never sends the full `logic64-state.json` to the AI Client. It only extracts the relevant rule.
*   **Pointer References:** Instead of sending the full documentation for Supabase, the Blueprint sends a pointer: "Refer to `@/lib/supabase` for the client singleton".
*   **Atomic Tasks:** Blueprints are designed to be small. If a user asks for a "Full CRM", the Kernel breaks it down into step 1: "Database Schema", and asks the user to proceed step-by-step.

---

## 5. Error Recovery (Self-Healing)
If the AI Client fails to execute the Blueprint (e.g., syntax error):

1.  **Detection:** The Editor reports a linter error.
2.  **Feedback:** The Kernel analyzes the error against the original Blueprint.
3.  **Correction:** It issues a new, simplified Blueprint focusing ONLY on fixing the error, preventing the AI from spiraling into complex, wrong solutions.
