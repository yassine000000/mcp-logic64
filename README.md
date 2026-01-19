# mcp-logic64: The Unified Builder Intelligence

**mcp-logic64** is the authoritative **Model Context Protocol (MCP)** server for the logic64 ecosystem. It serves as the centralized intelligence node that enforces architectural governance and decision policies for AI-assisted development.

Unlike traditional setups, `mcp-logic64` unifies "The Law" (Governance) and "The Policy" (Decisions) into a single, cohesive interface. This ensures that every coding action is validated against the project's invariants and strict architectural rules before execution.

---

## 🏗️ System Architecture

The system implements a **Governed AI Architecture**, logically separated into three distinct domains:

### 1. The Executive Node (`mcp-logic64`)
-   **Role**: The central server/router that connects the AI Client to the project's knowledge base.
-   **Tech Stack**: Node.js (v20+), TypeScript, Fastify, MCP SDK.
-   **Responsibility**:
    -   Loads and validates contexts at startup.
    -   Enforces "Strict Governance" mode (fails if context is missing).
    -   Protects the transport layer (Stdio) from pollution by redirecting all logs to `stderr`.

### 2. The Governance Layer (`MCP-Core`)
-   **Role**: "The Law". Immutable rules that define *how* the system is built.
-   **Contains**:
    -   Backend Architecture Blueprints (Clean Architecture).
    -   Technology Invariants (No unauthorized frameworks).
    -   Service Responsibility Matrices.

### 3. The Policy Layer (`MCP-Decision-System`)
-   **Role**: "The Strategy". Dynamic rules that define *what* distinct choices are made.
-   **Contains**:
    -   Decision Matrices (e.g., authentication flows, database choices).
    -   Business Logic Constraints.

---

## 📂 Project Structure

```text
mcp-logic64/
├── src/
│   └── index.ts               # 🚀 Entry Point (Governed Server)
├── MCP-Core/                  # 🏛️ GOVERNANCE (The Law)
│   ├── docs/                  #    - Architecture & Contracts
│   └── knowledge/             #    - Coding Standards
└── MCP-Decision-System/       # 🧠 POLICY (The Mind)
    ├── knowledge/             #    - Decision Matrices
    └── docs/                  #    - Internal Decision Records
```

---

## 🛡️ Governance Features

`mcp-logic64` operates in **Strict Mode** by default:

-   **Context Verification**: On boot, the server probes `MCP-Core` and `MCP-Decision-System`. If the required `CONTEXT_MAP.md` files are missing, the server refuses to start (or logs a critical warning depending on configuration).
-   **Transport Purity**: The Stdio transport channel is strictly reserved for the MCP protocol. All application logging, debug info, and errors are routed to `stderr` to prevent JSON-RPC corruption.

---

## 🚀 Getting Started

### Prerequisites
-   **Node.js**: Version 20.0.0 or higher.
-   **npm**: Installed with Node.

### Installation

1.  **Clone & Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Build the Project**:
    ```bash
    npm run build
    ```

3.  **Run the Server**:
    ```bash
    npm start
    ```

### Configuration (`.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | HTTP port for health checks (not used for MCP Stdio). |
| `MCP_SERVER_NAME` | `logic64-mcp` | The identity broadcast to the client. |
| `GOVERNANCE_MODE` | `strict` | If `strict`, crashes if Governance contexts are missing. |
| `LOG_LEVEL` | `info` | Logging verbosity (written to stderr). |

---

## 🤝 Client Integration (Claude Desktop)

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "logic64": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-logic64/dist/index.js"
      ]
    }
  }
}
```

---

*Powered by logic64 Builder Edition.*
