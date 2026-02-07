# logic64 System Architecture Specification (v2.1)

> [!IMPORTANT]
> **Architecture Type**: Hybrid Governance & Orchestration Protocol
> **Core Pattern**: Dual-Phase State-Gated Execution
> **Integration Standard**: Model Context Protocol (MCP)

## 1. Architectural Vision
logic64 is a **Governance OS** designed to eliminate the probabilistic nature of AI models during software development. It strictly decouples the **Architectural Thinking** phase from the **Code Execution** phase, using cryptographic hashing to ensure that architectural decisions cannot be bypassed or mutated during implementation.

### Core Philosophy
> **"Absolute freedom in design, strict constraints in execution."**

We do not manage the conversation; we manage the **State** and **Integrity** of the engineering process.

---

## 2. System Components (Bootstrap Phase)
For the self-build phase, the system is simplified into a **Single-User MCP Kernel**.

### ❶ The Kernel (Governance Engine)
**Current Implementation**: `apps/kernel`
-   **Role**: Enforces architectural rules embedded in `logic64-rules.ts`.
-   **Mechanism**: Stateless verification of code against hardcoded constraints.
-   **Interface**: MCP Server connected to Cursor.

### ❷ The Artifact Vault (Documentation)
**Current Implementation**: `_archive/MCP-Core/docs`
-   **Role**: The Source of Truth.
-   **Access**: Exposed as MCP Resources (`logic64://...`) to the LLM.

*(Note: The Gateway, Intelligence Nodes, and Hash Locking described below are part of the target v2.0 architecture and are not active in the Bootstrap Kernel.)*


---

## 3. The Unified Workflow (Phase-Shift Protocol)
The system operates on a strict **Phase-Shift Protocol**.

### Phase 1: Architect Mode
**State**: `Mode = ARCHITECT`
*   **Goal**: Crystallize the design.
*   **Operations**:
    *   **Context Hijack**: Gateway blocks code suggestions.
    *   **Reasoning**: Architect Node analyzes requirements and proposes `Options A/B/C`.
    *   **Output**: Generation of `blueprint.md` and `constraints.json`.

### Phase 2: Integrity Locking
**State**: `Mode = LOCKING` (Instantaneous)
*   **Process**:
    1.  Gateway calculates SHA-256 Hash of `.logic64/` files.
    2.  Generates `integrity.lock`.
    3.  **Prohibits** further changes to architecture files.

### Phase 3: Governed Execution Mode
**State**: `Mode = EXECUTION`
*   **Goal**: Implement the frozen design.
*   **Operations**:
    *   **Constraint Injection**: `constraints.json` rules injected into System Prompt.
    *   **Real-time Validation Loop**:
        1.  **Request**: Cursor attempts to write code.
        2.  **Hash Check**: Gateway verifies `integrity.lock` matches current disk state.
        3.  **Validator Check**: Validator Node checks strictly against `constraints.json`.
        4.  **Action**: Allow write OR Reject with violation report.

---

## 4. Technical USP
1.  **Structural Impossibility of Deviation**: Relying on math (Hashing), not prompts.
2.  **Omni-Channel Synchronization**: Seamless context between Web (Planning) and IDE (Coding).
3.  **Zero-Latency Execution**: Local/Fast API validation ensures Flow State is preserved.
