# Logic64: The Cloud-Native Governance Platform
Version: 1.0 (Master Release)
Type: SaaS Platform (B2C/B2B).
Core Philosophy: "Global Context, Local Precision".
Architecture: Hybrid Cloud-Native MCP System (SSE).

## 1. Executive Summary
Logic64 is a SaaS platform designed for AI-Assisted Development governance. The goal is to transform "Vibecoders" from writing random code to building robust engineering systems.

**Key Architectural Features:**
-   **Zero Local Setup**: No complex local installation required.
-   **Token-Efficient Protocol**: Uses "Contract & Index" protocol to minimize token usage and cost.
-   **Real-Time Enforcement**: Enforces rules in real-time via direct connection between Logic64's "Brain" and the code editor (Cursor/Claude).

## 2. The Core Protocol: "Contract & Index"
This is the operational law governing how the LLM interacts with the system to ensure efficiency and intelligence.
**Problem**: Reading full rule files consumes thousands of tokens and distracts the model.
**Solution**: Fracture knowledge and recall it only on demand.

### A. The Contract 📜
A static system prompt read by the LLM only at the start of the session, enforcing:
-   No guessing or improvisation on architecture.
-   No reading detailed files unless the need is identified from the Index.
-   Strict adherence to the Global Stack.

### B. The Index 🗂️
A very lightweight list containing rule titles and brief descriptions (e.g., "Database Rules: Schema & RLS", "UI Rules: Tailwind & Shadcn").

### C. The Specs 📄
Deep technical files that are only loaded upon explicit and specific demand.

## 3. Module 1: The Design Studio (apps/studio)
**Responsibility**: Strategic planning and rule generation.
**Tech Stack**: Next.js 14 (App Router), Shadcn/UI, Vercel AI SDK.

### 🧠 The Multi-Agent Council
Project architecture is generated via a "debate" between 3 specialized agents:
1.  **👷 The Builder (Claude 3.5 Sonnet)**: Focuses on productivity, proposing latest tech and fast solutions.
2.  **🛡️ The Skeptic (GPT-4o)**: Critiques suggestions, finds security loopholes, ensures scalability.
3.  **⚖️ The Moderator (Claude 3 Haiku)**: Manages the dialogue, resolves conflicts, and extracts the final "Rules File" in JSON format.

**Output**: The `logic64.json` file is saved to the database, and a User API Key is generated.

## 4. Module 2: The Cloud Kernel (apps/kernel)
**Responsibility**: Execution and Governance (Runtime Enforcement).
**Tech Stack**: Node.js (Hono Framework), MCP over SSE.

### ⚙️ Technical Specs
-   **Stateless**: The server does not hold session state. API Key is verified with every request.
-   **Latency**: Designed to run on the Edge for ultra-fast response.

### 🛠️ Exposed Tools
The server exposes 3 intelligent tools serving the protocol:

#### 1. `get_protocol_manifest()`
-   **Function**: Loads the Contract + Global Architecture + Index.
-   **Usage**: Once at the start of the session.

#### 2. `consult_architect(doc_id: string)`
-   **Function**: Reads specific rules (from the Index) based on user intent.
-   **Usage**: Directly before writing code.

#### 3. `verify_compliance(code: string)`
-   **Function**: Reviews generated code before displaying it to the user.
-   **Response**: `Approved` ✅ or `Rejected` ❌ with reason.

## 5. The Data Layer
**Tech**: PostgreSQL (via Neon).

### Database Schema
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL, -- Link to Cursor
  architecture_rules JSONB NOT NULL DEFAULT '{}'::jsonb, -- Council Output
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Rules File Structure (`architecture_rules` JSONB)
```json
{
  "stack": ["Next.js", "Neon", "Tailwind"],
  "index": [
    { "id": "db", "desc": "Rules for Neon & SQL" },
    { "id": "ui", "desc": "Rules for Components & Styling" }
  ],
  "specs": {
    "db": "MUST use Drizzle ORM. MUST use Neon Serverless Driver...",
    "ui": "MUST use Tailwind utility classes..."
  }
}
```

## 6. The Master Workflow
**Start**: User types `@logic64 I want a user API`.

1.  **Handshake**:
    -   Claude calls `get_protocol_manifest`.
    -   Receives Contract ("Obey rules") and Index ("API section available").

2.  **Selection**:
    -   Claude decides: "I only need API rules".

3.  **Consultation**:
    -   Claude calls `consult_architect("api_rules")`.
    -   Logic64 returns specific rules (saving tokens).

4.  **Execution**:
    -   Claude writes code.
    -   Calls `verify_compliance`.
    -   Logic64 approves.

## 7. The Unified Stack
-   **Repository Structure**: TurboRepo (Monorepo).
-   **Frontend (Studio)**: Next.js 14, ReactFlow (Visualization).
-   **Backend (Kernel)**: Hono (Node.js Adapter).
-   **Database**: Neon (Serverless Postgres).
-   **Authentication**: Supabase Auth.
-   **Connectivity**: Server-Sent Events (SSE).
