# logic64 Technology Invariants

> [!IMPORTANT]
> **GOVERNANCE RULE: SYSTEM OVER APPLICATION**
> logic64 must be built as a **System First**, not an Application.
> Any framework or tool selected must satisfy the Hard Requirements below.

## 1. Hard Requirements (Non-Negotiable)
logic64 demands a framework capable of:
*   **Workflow Type**: Long-living stateful workflows (Sessions, not Requests).
*   **Orchestration**: High-throughput async orchestration.
*   **Protocol**: MCP-centric design (Contracts, Schemas, Proxies).
*   **Behavior**: Low-latency + Deterministic execution.
*   **Isolation**: Strict per-client isolation for Tools and Bridges.
*   **Streaming**: Native support for LLM streaming.

**Any framework failing a single point above is INSTANTLY REJECTED.**

## 2. Anti-Patterns (What logic64 is NOT)
To avoid architectural drift, we explicitly define what we are *not* building:
*   ❌ **Not a CRUD App**: We are a Control Plane.
*   ❌ **Not an MVC Monolith**: We don't do `Controller -> View`.
*   ❌ **Not Frontend-First**: The UI is just a view into the Governance Engine.
*   ❌ **Not Rapid Scaffolding**: We prefer explicit control over "magic".

## 3. Rejected Frameworks (Elimination)
The following are **forbidden** for the logic64 Core:

### ❌ Laravel / Django / Rails / Spring
*   **Reason**: Built for Request/Response lifecycles and MVC. Hard to separate Domain from Framework.
*   **Status**: Permitted only as a dumb UI layer in the future, NEVER as Core.

### ❌ NestJS
*   **Reason**: Too much abstraction ("Magic"). Decorator-heavy design hides the execution flow. logic64 requires explicit control.
*   **Status**: Rejected for Core.

## 4. The Chosen Stack (Professional Recommendation)
**Architecture Split:**
*   **Core System**: `Node.js` (TypeScript)
*   **Decision/Analysis Engines**: `Python` (Optional/Secondary)

### Core Backend Stack
*   **Runtime**: **Node.js (TypeScript)**
*   **Framework**: **Fastify** or **Hono** (Minimal, Protocol-driven).
*   **Principles**:
    *   Event-driven by nature.
    *   MCP as a first-class protocol.
    *   No ORM (initially) - explicit data access.
    *   Zero MVC.

### Justification
*   **Node.js**: Best-in-class for MCP, Streaming, and Tool Proxying.
*   **Minimal Core**: Fewer execution paths = Lower probability space = Higher determinism.
*   **Governance**: We prioritize *Governance* over *Convenience*.
