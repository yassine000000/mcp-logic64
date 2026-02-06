# logic64 Backend Architecture Blueprint

> [!IMPORTANT]
> **GOVERNANCE RULE: CLEAN ARCHITECTURE & DECISION-CENTRIC DESIGN**
> We separate **What** the system does (Use Cases), **How** decisions are made (Governance), and **How** execution happens (Infrastructure).

## 1. Directory Structure
The codebase must strictly follow this folder hierarchy. No "buckets" of loose scripts.

```text
backend/
├─ core/                     # The Application Layer (Orchestration)
│  ├─ use-cases/             # Pure Business Logic (Stateless, Deterministic)
│  ├─ decision-flows/        # Workflows that chain Use Cases
│  └─ contracts/             # Interfaces for Ports/Adapters
│
├─ domain/                   # The Pure Heart (No Framework Dependencies)
│  ├─ entities/              # Business Objects (ProjectIntent, Decision)
│  ├─ value-objects/         # Immutable props (ToolCapability, Constraint)
│  └─ rules/                 # Invariant Logic (Policy checks)
│
├─ governance/               # The "Brain" (Logic specific to logic64)
│  ├─ mcp-core/              # Governance Constraints Module (The Law)
│  ├─ mcp-decision-system/   # Decision Resolution Module (The Judge)
│  └─ policy-engine/         # Rule Evaluator
│
├─ orchestration/            # The "Flow Control"
│  ├─ agent-engine/          # Manages the Dialogue State Machine
│  ├─ tool-router/           # Routes requests to Tool Bridges
│  └─ mcp-proxy/             # The Interface to the LLM (Gateway)
│
├─ infrastructure/           # The "Dirty Details" (Pluggable)
│  ├─ http/                  # Fastify/Hono Routes
│  ├─ mcp/                   # MCP Transport implementation
│  ├─ persistence/           # Database / Vector Store adapters
│  └─ messaging/             # Event Bus / Queues
│
├─ security/                 # The "Shield"
│  ├─ auth/                  # Identity Management
│  ├─ acl/                   # Isolation Enforcement
│  └─ isolation/             # Tool Bridge Sandboxing
│
└─ shared/                   # Common Utilities
   ├─ types/                 # Shared Types
   ├─ errors/                # Standardized Error Handling
   └─ logging/               # Structured Logging
```

## 2. Layer Constraints (Strict Rules)

### Use-Cases First (No Controllers)
*   **Principle**: logic64 is a Decision System. Every action is a **Use Case**.
*   **Rule**: logic64 is NOT a CRUD app. Do not build "UserControllers". Build `InitiateProjectDiscussionUseCase` or `ValidateGovernanceRulesUseCase`.
*   **Characteristics**: Stateless, Deterministic, Testable, Framework-Agnostic.

### Domain Purity
*   **Content**: `ProjectIntent`, `Decision`, `Constraint`, `Policy`, `ToolCapability`.
*   **Forbidden**: `import from 'fastify'`, `import from 'database'`, `import from 'react'`.
*   **Goal**: The Domain layer should technically run in a browser console or a CLI without changes.

### Governance Layer (The Brain)
*   **Role**: Enforces the logic64 "Intelligence".
*   **Input**: Normalized data from Use Cases.
*   **Output**: Verdicts (Allowed/Forbidden/Selected).
*   **Constraint**: Never interacts directly with the LLM. It is consulted *by* the Orchestrator.

### Orchestration Layer (The Flow)
*   **Agent Engine**: Manages the dialogue loop ("Ask -> Wait -> Reply").
*   **MCP Proxy**: The *only* contact point for the LLM. Enforces the Contract.
*   **Tool Router**: Proxies calls to isolated bridges.

### Infrastructure Layer (The Plug)
*   **Role**: Implementation details.
*   **Rule**: Can be swapped (e.g., Postgres -> SQLite, Fastify -> Hono) without touching Core or Domain.

## 3. Scalability Strategy
To ensure enterprise readiness:
*   **Isolation**: Per-tenant Context & MCP Bridges. No shared mutable state.
*   **Tactic**: Stateless Use Cases allow horizontal scaling.
*   **Optimization**: Streaming responses where possible; Read-only decision caching.
