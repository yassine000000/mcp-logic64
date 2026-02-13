# API Domain: MCP Tools Specification
**Version:** 3.0 (Cortex Enabled)
**Protocol:** Model Context Protocol (MCP) over SSE
**Server:** `apps/kernel`

> **Abstract:** This document defines the specific tools exposed by the Logic64 Kernel to the AI Client (IDE). These tools serve as the *only* bridge between the LLM and the Project's Architecture State.

---

## 1. Tooling Philosophy

The Kernel exposes a **Minimal Surface Area**. We do not give the AI hundreds of tools; we give it three powerful, high-level tools to prevent confusion and ensure strict governance.

| Tool Name | Purpose | Trigger Scenario |
| :--- | :--- | :--- |
| **`get_initial_context`** | The Handshake | Session start or context refresh. |
| **`ask_cortex`** | The Brain | User wants to generate/modify code. |
| **`consult_documentation`** | The Library | AI needs to read a specific rule/doc. |

---

## 2. Tool Specifications

### 2.1 `get_initial_context` (The Handshake)
**Description:**
Loads the `project_manifest.json` (The Master Index) into the AI's context. This is the "Map" that allows the AI to navigate the system.

* **Input Schema (Zod):**
    ```typescript
    z.object({
      project_api_key: z.string().describe("The unique project key from .env.local"),
    })
    ```

* **Output Schema:**
    ```typescript
    {
      system_status: "ONLINE",
      manifest: ProjectManifest, // See project_manifest.json
      active_stack: {
        frontend: "Next.js 14",
        database: "Supabase"
      }
    }
    ```

* **Edge Cases:**
    * *Invalid Key:* Returns `401 Unauthorized`.
    * *Server Offline:* Returns a static "Safe Mode" manifest.

---

### 2.2 `ask_cortex` (The Core Engine)
**Description:**
The primary execution tool. It sends a natural language intent to the Hybrid Cortex Engine and receives a structured **Blueprint**. The AI *MUST* call this before writing any code.

* **Input Schema (Zod):**
    ```typescript
    z.object({
      intent: z.string().describe("What the user wants to build (e.g., 'Create login form')"),
      current_file: z.string().optional().describe("The file currently open in the editor"),
      project_api_key: z.string(),
    })
    ```

* **Output Schema (The Blueprint):**
    ```typescript
    {
      blueprint_id: string; // UUID
      type: "SCAFFOLD" | "MODIFY" | "REJECT";
      target_file: string; // "app/auth/page.tsx"
      
      // The Plan
      specs: {
        imports: string[];
        logic_steps: string[];
        security_constraints: string[];
      };
      
      // The Governance Check
      compliance: {
        allowed: boolean;
        reason?: string; // Populated if rejected
      };
    }
    ```

* **Scenario: Rejection**
    If the user asks for "Redux", the tool returns:
    ```json
    {
      "type": "REJECT",
      "compliance": {
        "allowed": false,
        "reason": "Stack Violation: Redux is not in logic64-state.json. Use Server Actions."
      }
    }
    ```

---

### 2.3 `consult_documentation` (The Librarian)
**Description:**
Allows the AI to "Lazy Load" specific documentation nodes referenced in the Manifest. This prevents context flooding.

* **Input Schema (Zod):**
    ```typescript
    z.object({
      node_id: z.enum([
        "governance", 
        "standards", 
        "system_context", 
        "cortex_logic", 
        "db_schema"
      ]).describe("The ID of the document node from the Project Manifest"),
    })
    ```

* **Output Schema:**
    ```typescript
    {
      content: string; // The full Markdown content of the file
      last_updated: string;
    }
    ```

---

## 3. Usage Patterns (Best Practices for AI)

### Pattern A: The "Cold Start"
1.  **System:** User opens IDE.
2.  **AI:** Calls `get_initial_context()`.
3.  **Result:** AI understands it is working on a "Logic64 Project" and sees the `project_manifest.json`.

### Pattern B: The "Feature Build"
1.  **User:** "Add a comments section to the blog post."
2.  **AI:** Checks Manifest -> Knows it needs DB + UI.
3.  **AI:** Calls `ask_cortex("Add comments section to blog", "app/blog/[slug]/page.tsx")`.
4.  **Result:** Cortex returns a Blueprint with:
    * *Table:* `comments` (RLS required).
    * *UI:* `Textarea` from `shadcn`.
    * *Action:* `createComment` server action.
5.  **AI:** Generates code following the Blueprint.

### Pattern C: The "Deep Dive"
1.  **User:** "Why can't I use `useEffect`?"
2.  **AI:** Calls `consult_documentation("standards")`.
3.  **Result:** Reads `coding_standards.md` -> Explains Rule 2.2 (Server Components).

---

## 4. Error Handling Protocol

All tools follow a standard error envelope to help the AI recover self-correctly.

```json
{
  "error": {
    "code": "ARCH_VIOLATION" | "SYSTEM_ERROR" | "AUTH_ERROR",
    "message": "Human-readable description of the error",
    "suggestion": "What the AI should do next (e.g., 'Ask user for API Key')"
  }
}
```

## 5. Security Constraints
* **Read-Only Tools:** None of these tools can modify the `logic64-state.json` directly. Architecture changes must happen in the Studio.
* **Context Isolation:** The tools do not have access to the user's local file system outside of the `current_file` context passed in the input.
* **Rate Limiting:** The Kernel limits `ask_cortex` calls to prevent abuse (e.g., 60 calls/minute).
