# logic64 Mandatory Core Services

> [!IMPORTANT]
> **GOVERNANCE RULE: MODULAR MONOLITH**
> These are **Logical Services**, not necessarily Microservices (yet).
> They represent strict implementation boundaries within the Single Master MCP Server.
> **Without these 9 services, the system does not exist.**

## 1. MCP Gateway Service (Entry Point)
*   **Role**: The Shield. The single point of contact for any LLM.
*   **Critical Responsibility**:
    *   **Authenticate**: Verify the LLM/Client identity.
    *   **Inject Contract**: Load the active Use-Case Contract.
    *   **Direct**: Inject the fundamental "LLM Directive".
    *   **Enforce**: Prevent any tool call that violates the active policy.

## 2. Contract Management Service
*   **Role**: The Librarian.
*   **Responsibility**:
    *   **Schema Validation**: Ensure Use-Case Contracts match the Standard.
    *   **Versioning**: Manage `stable`, `experimental`, `deprecated` contracts.
    *   **Binding**: Attach a specific Contract to an active Session.

## 3. Decision System Service (MCP-Decision)
*   **Role**: The Brain (The Judge).
*   **Invariant**: **This service decides. The LLM does not.**
*   **Responsibility**:
    *   **Precondition Check**: Can we even start?
    *   **Conflict Resolution**: If two rules clash, which wins?
    *   **Tool Selection**: Which specific tool (if any) is the *best* fit?
    *   **Audit**: Produce the immutable `DecisionLog`.

## 4. Core Orchestration Service (MCP-Core)
*   **Role**: The Body (The Executor).
*   **Responsibility**:
    *   **Execution**: Take the *Decision* and run it.
    *   **Bridging**: Convert abstract tool calls into MCP implementation calls.
    *   **Resilience**: Handle timeouts, retries, and errors normalization.

## 5. Tool Registry & Bridge Service
*   **Role**: The Hardware abstraction.
*   **Responsibility**:
    *   **Isolation**: Map generic tools (e.g., `git_commit`) to client-specific Bridges.
    *   **Discovery**: What is physically available?
    *   **Declaration**: Expose allowed capabilities to the Gateway.

## 6. Governance & Policy Service
*   **Role**: The Internal Affairs.
*   **Responsibility**:
    *   **Rules**: Store and serve the "Hard Constraints" (e.g., "No deployment on Fridays").
    *   **Limits**: Rate limiting, usage quotas.
    *   **Overrides**: Handle authorized human overrides.

## 7. Session & Context Service
*   **Role**: The Memory.
*   **Responsibility**:
    *   **Isolation**: Ensure Client A never sees Client B's context.
    *   **Lifecycle**: Init -> Active -> Suspended -> Closed.
    *   **Consistency**: Ensure requests 1, 2, and 3 share the same reality.

## 8. Observability & Audit Service
*   **Role**: The Black Box Recorder.
*   **Responsibility**:
    *   **Transparency**: Log not just *what* happened, but *why* (Decision Log).
    *   **Compliance**: verifiable audit trails for enterprise review.

## 9. Tenant Isolation Service (Critical)
*   **Role**: The Vault.
*   **Responsibility**:
    *   **Boundaries**: Cryptographic or logical separation of tenant data.
    *   **Quotas**: Resource management per tenant.
    *   **Bridge Dedication**: Ensure no shared bridges between tenants.
