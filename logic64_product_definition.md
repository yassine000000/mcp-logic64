# logic64 — Platform Concept & Service Flow

> **Core Philosophy**: "logic64 is built using the same methodology it enforces on others. No exceptions."

## 0. What logic64 Is
**logic64 is NOT:**
-   An AI code generator.
-   A Prompt engineering tool.
-   Another collection of MCP servers.

**logic64 IS:**
-   A **Control, Governance & Decision-Orchestration Platform**.
-   It sits between human intent and AI execution.
-   It enforces **architectural determinism** in probabilistic systems.

*logic64 does not "help" the LLM; it restricts, guides, and prevents it from deviating.*

---

## The Execution Flow

### 1. Entry Point — User Enters logic64
*Logic Moment: Login / Session Start*
-   **Action**: User logs in.
-   **System**: Creates an `Isolated Session` and loads `Tenant-specific Governance Context`.
-   **Constraint**: **No AI interaction before governance context exists.**

### 2. Guided Architectural Reasoning (Human ↔ logic64)
*Logic Moment: Defining the "Why"*
The system leads the user through a structured reasoning flow before any code is discussed.

#### 2.1 Problem Definition Layer
-   **Inputs**: "What problem are you solving?", "What must NEVER happen?", "Breakage conditions".
-   **Output**: `Problem Statement Document` (stored in `MCP-Core`).

#### 2.2 Goal & Success Criteria
-   **Separation**: Business Goal vs. Technical Goal vs. Architectural Goal.
-   **Output**: Explicit success boundaries (prevents over-engineering).

#### 2.3 Users & Actors
-   **Defined**: Human Users, System Actors, External Systems, Future AI Agents.
-   **Impact**: Security rules, Tool eligibility, Access control.

### 3. Domain & Use-Case Construction
*Logic Moment: The "What" (No Code, No Frameworks)*

#### 3.1 Domain Modeling (Textual Only)
-   **Action**: User defines Entities, Invariants, Rules, Forbidden States.
-   **Output**: `Domain Contract` (Readable by MCP-Core).

#### 3.2 Use-Case Mapping
-   **Format**: Verbs (Create X, Approve Y, Reject Z).
-   **Output**: `Use-Case Graph` with Decision Nodes.

### 4. Decision Space Engineering (The Core)
*Logic Moment: The "How"*

#### 4.1 Decision Classification
Every decision is classified into:
1.  **Architectural Decision**
2.  **Security Decision**
3.  **Tool Eligibility Decision**
4.  **Execution Path Decision**
*Note: The LLM does not own ANY of these decision types.*

#### 4.2 The Dual-Engine Structure
-   **MCP-Core (Governance - The Law)**:
    -   Defines what is allowed structurally.
    -   Immutable.
    -   Fails hard on violations.
-   **MCP-Decision-System (Policy - The Strategy)**:
    -   Chooses between allowed paths.
    -   Dynamic, Context-aware.

### 5. Tool Layer Definition
*Logic Moment: Capability Gating*

#### 5.1 Tool Registry
-   Lists available tools (Perplexity, Context7, APIs, DBs).
-   Defines: Purpose, Data boundaries, Risk profile.

#### 5.2 Tool Activation (Explicit & Audited)
-   User enables a tool -> logic64 creates a **Private Tool Bridge**.
-   **Implication**: No shared tools between tenants. Prevents data leakage.

### 6. Contract Injection
*Logic Moment: First Contact with LLM*
Before the LLM receives the prompt, logic64 injects the **Governance Contract** via MCP.

**The Contract States:**
1.  Who you are (Operator, not Decider).
2.  What you are NOT allowed to do.
3.  Which tools are inactive/active.
4.  When to refresh `MCP-Core` or `MCP-Decision-System`.

### 7. LLM Interaction (Governed Execution)
-   User requests a task.
-   **LLM Behavior**:
    -   Does NOT decide.
    -   Does NOT assume.
    -   Does NOT call tools directly (conceptually).
-   **LLM Action**: Sends a `Request Intent` to logic64.

### 8. Tool Invocation Flow (Indirect, Controlled)
1.  LLM asks for `Tool X`.
2.  Request intercepts by `logic64`.
3.  `logic64` checks `SRCM Matrix` (Responsibility).
4.  `logic64` consults `MCP-Decision-System`.
5.  **IF ALLOWED**: logic64 invokes the tool.
6.  Result returns to logic64 -> then to LLM.

### 9. Continuous Governance
-   Any Code Change -> Re-evaluates decisions.
-   New Tool -> Updates Contract.
-   New Agent -> Subject to same Matrix.

### 10. Final Value
**logic64 makes the Probability Space smaller.**
It does not make the LLM smarter; it makes the outcomes **Deterministic**.

---
*This document defines the architectural invariants for the logic64 self-construction.*
