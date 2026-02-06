# logic64 Internal Architectural Decisions

> [!NOTE]
> This log records the *decisions we make* while building logic64.
> It serves as the `MCP-Decision-System` for the build process itself.

## Decision 001: Single Master MCP Server
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need to determine the deployment topology of logic64. Should it be a mesh of micro-MCPs or a single monolithic server?
*   **Decision**: We will build logic64 as a **Single Master MCP Server**.
*   **Consequences**:
    *   `MCP-Core` becomes a module/subsystem, not a separate process.
    *   `MCP-Decision-System` becomes a module/subsystem.
    *   Deployment is simplified (one server to run).
    *   Context sharing is strictly managed in-memory or via a shared internal database, rather than over HTTP/Stdio between servers.
*   **Constraint**: External tools (Prompt, Context7) will still be bridged via adapters, but the "Brain" is monolithic.

## Decision 002: Node.js (TypeScript) as Core Language
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED** (Supercedes Python)
*   **Context**: While Python is strong for AI, logic64 is primarily an **Orchestration & Governance System**. Node.js offers superior handling of async tools, streaming, and proxies.
*   **Decision**: logic64 Core will be implemented in **Node.js (TypeScript)**.
*   **Exception**: `MCP-Decision-System` may use Python *internally* for complex reasoning/ML tasks in the future, but the Core System is Node.
*   **Justification**:
    *   Event-driven nature suits MCP.
    *   Better ecosystem for "Tool Proxying".
    *   Alignment with Claude/Cursor tooling.

## Decision 003: Subsystem Directory Structure
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need a place to store the "Law" and the "Judge" documents.
*   **Decision**:
    *   `MCP-Core/docs/`: Stores Governance Rules.
    *   `MCP-Decision-System/docs/`: Stores Decision Records.
*   **Justification**: Separation of concerns at the file system level ensures clarity for both human developers and the Agent.

## Decision 004: Transparent MCP Proxy Architecture
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need to expose tools to the LLM but maintain strict governance. The LLM cannot be trusted with direct access to tool servers.
*   **Decision**: Implement logic64 as a **Transparent Proxy**.
*   **Mechanics**:
    *   LLM connects ONLY to logic64.
    *   logic64 manages connections to downstream Tool MCPs.
    *   logic64 validates every request against the **Governance Contract** (Active/Inactive status) before forwarding.
*   **Justification**: Ensures "Zero Leakage" between clients and enforced governance without breaking the MCP protocol or the LLM's user experience.

## Decision 005: Minimalist Framework (Fastify/Hono)
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need a web framework to host the MCP server.
*   **Decision**: Use **Fastify** or **Hono**. Reject NestJS/Express.
*   **Invariants**: No MVC, No heavy ORM.
*   **Justification**: "logic64 is a System, not an Application." We need explicit control over the protocol execution flow, which minimal frameworks provide better than opinionated ones.

## Decision 006: Decision-Centric Clean Architecture
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need a code structure that reflects the "System first" nature of logic64, ensuring maintainability and separation of concerns.
*   **Decision**: Adopt a strict **Clean Architecture** layout centered on **Use Cases**.
*   **Structure**: `core/`, `domain/`, `governance/`, `orchestration/`, `infrastructure/`.
*   **Invariants**:
    *   **Domain Purity**: No framework dependencies in Domain.
    *   **Use-Case Driven**: No MVC Controllers; strict Use Case classes.
    *   **Governance Integration**: `MCP-Core` and `MCP-Decision` live in the `governance/` layer, distinct from `infrastructure`.
*   **Justification**: logical separation allows logic64 to evolve its "Brain" (Governance) independently of its "Body" (Infrastructure) or "Flow" (Orchestration).

## Decision 007: Use-Case as Contract Standard
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need a standardized way to define the behavior, limits, and governance of every action in the system.
*   **Decision**: Adopt the **Canonical Use-Case Contract Template** (12-point schema).
*   **Location**: `MCP-Core/docs/use_case_contract_standard.md`.
*   **Implication**: Every Use-Case implementation must map to this contract structure. It is not just code; it is a governance document.
*   **Justification**: Ensures that every action is "Explainable by Design", prevents tool abuse via strict policies, and allows `MCP-Decision-System` to reason about the system's capabilities.

## Decision 008: Mandatory Core Services (Modular Monolith)
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need to define the internal logical modules that make up the Single Master MCP Server to avoid "Big Ball of Mud" architectures.
*   **Decision**: Implement 9 Mandatory Services as distinct modules:
    1.  **Gateway** (Entry)
    2.  **Contract Management**
    3.  **Decision System** (The Brain)
    4.  **Core Orchestration** (The Body)
    5.  **Tool Registry/Bridge** (Hardware)
    6.  **Governance/Policy** (Rules)
    7.  **Session/Context** (Memory)
    8.  **Observability** (Audit)
    9.  **Tenant Isolation** (Vault)
*   **Constraint**: These are Logical Services within the Node.js Monolith, NOT microservices (initially).
*   **Justification**: Enforces Separation of Concerns (SoC) and prepares the system for future scaling/splitting without refactoring the logical flow.

## Decision 009: Adoption of SRCM & Rule Zero
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: To prevent "Decision Leakage" and "Tool Hallucination", we need a strict permission model.
*   **Decision**: Adopt the **Service Responsibility & Control Matrix (SRCM)** as the definitive governance map.
*   **Core Principle**: **Rule Zero** — "Anything not explicitly defined in the SRCM is FORBIDDEN."
*   **Constraint**: The LLM is reclassified as an **Operator/Proposer**, stripping it of all Decision Authority and Direct Tool Access.
*   **Justification**: Guarantees deterministic behavior in a system containing probabilistic components (LLMs).

## Decision 010: Decision Engine Primitives
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: "How does the system decide?" was previously undefined. We need a concrete mechanism.
*   **Decision**: Implement the **Decision Primitive** (Immutable Object) and the **Strict Conflict Resolution Matrix**.
*   **Mechanics**:
    *   **Priority**: Security > Governance > Capability > Convenience.
    *   **Output**: Every judgment produces a signed `Decision` object, not just a boolean.
*   **Justification**: Replaces "Black Box" logic with a transparent, auditable, and deterministic evaluation pipeline.

## Decision 011: Service Interaction Model
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: We need to define exactly how the components talk to each other to prevent "Spaghetti Architecture".
*   **Decision**: Adopt the **7-Sequence Interaction Model**.
*   **Core Invariant**: **No Direct Path** between LLM and Tools/Decisions.
*   **Mechanism**: All flows must pass through the `Gateway` -> `Decision` -> `Core` pipeline.
*   **Justification**: Prevents hallucination, enforces the SRCM, and creates a "Chain of Custody" for every action in the system.

## Decision 012: Explicit Context Mapping
*   **Date**: 2026-01-17
*   **Status**: **ACCEPTED**
*   **Context**: AI Assistants need a clear "Entry Point" to digest the complex governance verification.
*   **Decision**: Implement `CONTEXT_MAP.md` in both `MCP-Core` and `MCP-Decision-System`.
*   **Role**:
    *   **Core Map**: The "Architect's Handbook" (Structure & Law).
    *   **Decision Map**: The "Judge's Manual" (Logic & Memory).
*   **Justification**: Ensures zero ambiguity for any Agent working on the logic64 codebase.




