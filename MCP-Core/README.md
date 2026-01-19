# Logic64 MCP Server (Governance Core)

> **The Central Nervous System for logic64 AI Agents**

This repository hosts the **Model Context Protocol (MCP)** server for logic64. Unlike traditional APIs that perform CRUD operations, this server acts as a strictly governed, read-only **Knowledge & Decision** authority. It provides Large Language Models (LLMs) like Claude with the context, rules, and architectural standards required to generate safe and compliant code.

---

## 🏗️ Architectural Decisions

We deliberately chose a **Stateless, Static-First Architecture** for this MCP server.

### Why this approach?
1.  **Deterministic Context**: The generic AI output is unpredictable. This server forces the AI to ground its reasoning in static, versioned text files (`.md`), ensuring every decision is traceable to a specific rule or architectural document.
2.  **Zero Logic Leaks**: By keeping the server "dumb" (it simply loads and serves text), we ensure no business logic is hidden in Python code. All logic exists as explicit rules in the `knowledge/` directory, visible to both humans and LLMs.
3.  **Cache-Friendly & Fast**: The entire knowledge base is loaded from the filesystem. It is lightweight, instant, and requires no database maintenance.

---

## 📂 Project Structure & Anatomy

Understanding the layout is crucial for extending the knowledge base. Here is the operational structure of the server:

```text
logic64-mcp/
├── app/
│   ├── main.py              # 🚀 The Brain: FastAPI entry point and route definitions.
│   ├── manifest.py          # 📋 Capability Declarator: Loads manifest.json.
│   ├── loaders/             # 🔌 Connectors: Logic to read backend storage (Markdown files).
│   │   ├── architecture.py  #     -> Reads knowledge/architecture
│   │   ├── rules.py         #     -> Reads knowledge/rules
│   │   └── standards.py     #     -> Reads knowledge/coding-standards
│   └── models/              # 🏛️ Data Contracts: Pydantic models defining response shapes.
│
├── knowledge/               # 🧠 The Knowledge Base (The "Database" of this server)
│   ├── architecture/        #     -> High-level system design documents.
│   ├── coding-standards/    #     -> Idioms, style guides, and forbidden patterns.
│   ├── rules/               #     -> Critical constraints (Governance, Kill-switches).
│   └── workflows/           #     -> Standard operating procedures.
│
├── versions/                # ⏱️ Time Machine: Semantic versioning of the knowledge base.
│   └── v1.json
│
├── manifest.json            # 🆔 Server Identity: Defines what this MCP can do for the LLM.
└── requirements.txt         # 📦 Dependencies.
```

### Key Components Explained

1.  **`knowledge/` Directory**: This is the heart of the server. It is organized by domain.
    *   *How to use*: Simply add a new Markdown (`.md`) file here (e.g., `knowledge/rules/no-direct-db-access.md`). The server automatically detects it and serves it. No code changes required.

2.  **`app/loaders/`**: These Python scripts act as the bridge. They scan the `knowledge/` directories and convert raw text into structured JSON objects that the MCP protocol enables LLMs to consume.

3.  **`manifest.json`**: This configuration file acts as a contract. It tells the connecting LLM client (e.g., Claude Desktop, Cursor): *"I am Logic64-Core. I provide read-only access to Architecture and Rules. I do not execute code."*

---

## 🔄 Data Flow: How it Works

When an LLM (User) queries the MCP server:

1.  **Request**: LLM asks, *"What are the backend architecture rules?"*
2.  **Route**: Request hits `GET /architecture`.
3.  **Loader**: `app.loaders.architecture.load_architecture()` scans `knowledge/architecture/*.md`.
4.  **Response**: The server returns a JSON list of `KnowledgeItem`s.
5.  **Context**: The LLM injects this text into its context window effectively saying: *"I must follow these rules before writing any code."*

---

## 🚀 Deployment & Usage

### Local Development
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the server
uvicorn app.main:app --reload --port 3333
```

### Production (VPS)
1.  **Upload** the `logic64-mcp` folder to your VPS.
2.  **Install dependencies**: `pip install -r requirements.txt`
3.  **Run with Uvicorn**:
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 3333
    ```
4.  **Connect Client**: Configure your `.claude/config.json` to point to `http://<VPS_IP>:3333`.

### Extending functionality
To add a new category of knowledge (e.g., `security`):
1.  Create `knowledge/security/`.
2.  Create `app/loaders/security.py`.
3.  Add `@app.get("/security")` to `app/main.py`.
