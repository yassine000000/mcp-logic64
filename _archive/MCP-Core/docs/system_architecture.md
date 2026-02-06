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

## 2. System Components
The system consists of 4 integrated layers:

### ❶ The Interaction Layer (Interface)
**"Multi-Port Access"** - The user chooses the entry point, but the governance remains constant.

*   **A. Cursor / IDE (The Dumb Terminal)**
    *   Acts as a passive interface for Execution.
    *   Controlled strictly by the MCP Gateway.
    *   Injected with `constraints.json` during execution.
*   **B. Logic64 Web Platform (The Strategic Planner)**
    *   Advanced GUI for Architect Mode.
    *   Visual diagrams, corporate templates, and high-level reasoning.
    *   Syncs directly to the `.logic64/` vault.

### ❷ The Logic64 Gateway (The Engine)
**"The Keeper of State"** - The central MCP Server acting as the mediator.

*   **State Machine Manager**: Tracks the current mode (`ARCHITECT`, `LOCKING`, `EXECUTION`).
*   **Request Routing**: Directs prompts to the appropriate node (Architect vs. Validator) based on the current state.
*   **Integrity Hashing**:  verifies the `integrity.lock` signature before every single execution step.

### ❸ The Intelligence Nodes (The Brains)
Specialized AI models invoked by the Gateway for specific purposes.

*   **Architect Node (Backend)**:
    *   *Type*: High-Reasoning Model (e.g., Claude 3.5 Sonnet, o1).
    *   *Role*: Analysis, System Design, Option Generation (A/B/C).
    *   *Permissions*: **Read-Only** (Codebase), **Write** (Documentation/Artifacts).
*   **Validator Node (Backend)**:
    *   *Type*: Lightweight/Fast Model (e.g., GPT-4o-mini, Haiku).
    *   *Role*: Compliance Checking.
    *   *Output*: Boolean (`PASS`/`FAIL`) checking Code vs. `constraints.json`.

### ❹ The Artifact Vault (The Constitution)
**"The Single Source of Truth"**

*   **Location**: `.logic64/` directory in the user's project.
*   **Content**:
    *   `blueprint.md`: Structural description.
    *   `constraints.json`: Machine-readable rules.
    *   `integrity.lock`: Cryptographic seal (SHA-256).

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
