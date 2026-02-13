# Logic64 Cortex Kernel (v3.0.0)

> "Design First, Code Later."

**Logic64 Cortex Kernel** is a specialized Model Context Protocol (MCP) server that acts as the **"Governance Engine"** for AI-assisted software development. It intercepts your requests to Claude/Cursor and enforces strict architectural rules *before* any code is written.

---

## 🌟 Capabilities

### 1. The "Governance Shield" (Layer A)
Before the AI even thinks, the Kernel performs a **Deterministic Check**:
*   **Stack Enforcement:** Automatically rejects forbidden technologies (e.g., "Express", "Redux", "Python").
*   **Style Guard:** Prevents inline styles and CSS Modules; mandates Tailwind CSS.
*   **Zero-Cost Rejection:** These checks happen locally in milliseconds, saving you API costs and time.

### 2. The "Cortex Brain" (Layer B)
If your request passes the shield, the Cortex Engine synthesizes it into a **Strict Blueprint**:
*   **Context-Aware:** It knows your `logic64-state.json` (SAM).
*   **Rule-Injected:** It automatically injects only the rules relevant to your request (e.g., Database rules for "Create Table", UI rules for "Add Button").
*   **Structure-First:** It forces the AI to output a JSON plan before writing a single line of code.

### 3. "Surgical" Documentation
Instead of dumping 50 files into the context window, the Kernel provides documentation **On Demand**:
*   The AI asks for "Coding Standards" -> Kernel delivers `coding_standards.md`.
*   The AI asks for "Database Schema" -> Kernel delivers `database_schema.md`.

---

## 🛠️ MCP Tools

The Kernel exposes 3 powerful tools to your IDE:

| Tool Name | Purpose | Trigger |
| :--- | :--- | :--- |
| **`get_initial_context`** | **The Handshake** | Called at session start. Loads the Project Manifest. |
| **`ask_cortex`** | **The Brain** | Called when you want to build/modify something. **This is the main entry point.** |
| **`consult_documentation`** | **The Librarian** | Called when the AI needs to check a specific rule. |

### Example Workflow
1.  **You:** "Create a login form."
2.  **Kernel (Layer A):** Checks for forbidden words. (Pass)
3.  **Kernel (Layer B):** Identifies domain "UI_Design". Injects "Use Shadcn/UI" rules.
4.  **Cortex:** Generates a JSON Blueprint for a Next.js Server Component with Zod validation.
5.  **Claude:** Writes the code following the Blueprint exactly.

---

## 📂 Project Structure

This repository is structured according to **Domain-Driven Design (DDD)**:

```text
apps/kernel/
├── src/
│   ├── index.ts                # 🚀 The Main Server (Hono + MCP)
│   ├── constants/
│   │   └── architecture.ts     # 🛡️ Layer A Rules (The Constitution)
│   └── logic64-rules.ts        #    Legacy Rules (Reference)
├── data/                       # 🧠 The Knowledge Base
│   ├── project_manifest.json   #    The Master Index
│   ├── 00_principles/          #    Governance & Standards
│   ├── 01_architecture/        #    System Context & Cortex Engine
│   ├── 02_domains/             #    Studio & Execution Logic
│   ├── 03_data/                #    SAM & Database Schema
│   └── 04_api/                 #    MCP Tools Spec
└── scripts/
    ├── verify-rules.ts         # ✅ Test Layer A
    └── verify-kernel.ts        # ✅ Test Server Integrity
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v20+
*   pnpm (recommended)

### Installation

```bash
# 1. Clone & Install
git clone https://github.com/yassine000000/mcp-logic64.git
cd mcp-logic64
npm install

# 2. Start the Server
npm run dev
# Server listening on http://localhost:3001/sse
```

### Connect to Cursor / Claude Desktop

1.  Open **Settings** > **Features** > **MCP**.
2.  Add New Server:
    *   **Name:** `logic64-kernel`
    *   **Type:** `SSE` (Server-Sent Events)
    *   **URL:** `http://localhost:3001/sse`

---
**Status:** ✅ v3.0.0 (Stable) | **Protocol:** MCP over SSE | **Engine:** Cortex Hybrid
