# mcp-logic64: The Unified Builder Intelligence

**mcp-logic64** is the authoritative **Model Context Protocol (MCP)** server for the logic64 ecosystem. It serves as the centralized intelligence node that enforces architectural governance and decision policies for AI-assisted development.

## 🌟 Key Features
- **Unified Kernel**: Merged `MCP-Core` and `MCP-Decision-System` into a single, stateless server.
- **Token-Efficient Protocol**: Drastically reduces context usage by enforcing "On-Demand" documentation loading.
- **SaaS Governance**: Strictly adheres to the Logic64 Cloud Architecture Specification (v1.0).

## 📂 Project Structure
```text
mcp-logic64/
├── apps/
│   ├── kernel/                # 🚀 The Unified MCP Server (Hono/Node.js)
│   └── database/              # 💾 SaaS Infrastructure (Schema.sql) - *Product Artifact*
├── _archive/
│   └── MCP-Core/              # 🏛️ The Documentation Vault (Rules & Decisions)
└── logic64_product_definition.md # 📄 The Target Product Spec
```

## 🚀 Getting Started

1.  **Install**: `npm install` (Root)
2.  **Build Kernel**:
    ```bash
    cd apps/kernel
    npm install
    npm run build
    ```
3.  **Run Server**:
    ```bash
    npm run dev
    # Server running on http://localhost:3001/sse
    ```
4.  **Connect Cursor**: Add the SSE URL to your MCP settings.

## 📖 Documentation
- **[Project Overview](./Logic64_Overview.md)**: What is this project and why use it?
- **[Product Spec](./logic64_product_definition.md)**: The SaaS Platform we are building.
