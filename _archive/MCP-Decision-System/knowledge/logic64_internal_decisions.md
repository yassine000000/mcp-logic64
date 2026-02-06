# logic64 Internal Decision Matrix

*   **Artifact Type**: Authoritative Decision Definition
*   **Governance Level**: Constitutional Enforcement
*   **Audience**: MCP-Decision-System (ONLY)

## 1. Purpose
This document defines the **allowed decision space** within `logic64`.

> **IMPORTANT INVARIANT**:
> `logic64` does not "think" about decisions.
> `logic64` only matches the request against this matrix.
> Any decision not defined here is **non-existent** and **automatically rejected**.

---

## 2. Decision Engineering Principles

1.  **No Generic Decisions**: Every decision has a fixed ID, Type, and Deterministic Criteria.
2.  **No Implicit Decisions**: Nothing happens "automatically" or "silently".
3.  **No Composite Decisions**: Decisions are atomic.
4.  **The LLM Role**:
    *   Does NOT choose the Decision.
    *   Does NOT interpret Criteria.
    *   **Can ONLY request a Decision-ID.**

---

## 3. Decision Types (Closed Set)

| Decision Type | Description |
| :--- | :--- |
| **Governance** | Validity of the governing framework. |
| **Session** | Session lifecycle management. |
| **Tool Eligibility** | Permission to use a specific tool. |
| **Execution** | Permission to execute an action. |
| **Override** | Exceptional override (Human-only). |
| **Termination** | Ending the session. |

> ⚠️ New types require a **Constitutional Amendment**.

---

## 4. Decision Matrix (The Core)

### 🔹 D-01: Initialize Governance Context
*   **Type**: Governance
*   **Trigger**: Session Start
*   **Criteria**:
    1.  `MCP-Core` CONTEXT_MAP exists.
    2.  `MCP-Decision-System` knowledge loaded.
*   **Outcome**:
    *   `ALLOW` → System enters Active Mode.
    *   `DENY` → Hard Stop (No Session).

### 🔹 D-02: Accept Operator Intent
*   **Type**: Session
*   **Trigger**: Incoming Intent from LLM
*   **Criteria**:
    1.  Governance Context = Initialized.
    2.  Intent is explicit (non-implicit).
*   **Outcome**:
    *   `ALLOW` → Intent classified.
    *   `DENY` → Explicit rejection (Reason Required).

### 🔹 D-03: Classify Intent
*   **Type**: Governance
*   **Trigger**: Accepted Intent
*   **Criteria**:
    1.  Intent maps to known Use-Case.
*   **Outcome**:
    *   `ALLOW` → Decision Request created.
    *   `DENY` → "Unknown Intent Class".
    *   *NOTE*: Classification ≠ Approval.

### 🔹 D-04: Authorize Tool Request
*   **Type**: Tool Eligibility
*   **Trigger**: Tool Request
*   **Criteria**:
    1.  Tool is registered.
    2.  Tool is active.
    3.  Tool allowed for current Use-Case.
*   **Outcome**:
    *   `ALLOW` → Execution Decision required.
    *   `DENY` → Tool Not Authorized.

### 🔹 D-05: Authorize Execution
*   **Type**: Execution
*   **Trigger**: Approved Tool Request
*   **Criteria**:
    1.  Tool Authorization = TRUE.
    2.  Execution Context is isolated.
*   **Outcome**:
    *   `ALLOW` → Tool Bridge Execution.
    *   `DENY` → Execution Blocked.

### 🔹 D-06: Allow Governance Update
*   **Type**: Governance
*   **Trigger**: Governance Change Request
*   **Criteria**:
    1.  Request Source ≠ LLM.
    2.  Change is explicit & versioned.
*   **Outcome**:
    *   `ALLOW` → Context Reload.
    *   `DENY` → Immutable Context Violation.

### 🔹 D-07: Allow Decision Override
*   **Type**: Override
*   **Trigger**: Explicit Override Request
*   **Criteria**:
    1.  Override Policy exists.
    2.  Request Source authorized.
*   **Outcome**:
    *   `ALLOW` → Logged Escalation.
    *   `DENY` → Override Forbidden.
    *   *NOTE*: LLM can NEVER trigger this decision.

### 🔹 D-08: Terminate Session
*   **Type**: Termination
*   **Trigger**: Session End
*   **Criteria**:
    1.  Explicit termination signal.
*   **Outcome**:
    *   `ALLOW` → Context destroyed.
    *   `DENY` → N/A (Always allowed).

---

## 5. Forbidden Decisions (Explicitly Non-Existent)

The following decisions **DO NOT EXIST** in `logic64`:

*   ❌ "Choose Architecture"
*   ❌ "Select Framework"
*   ❌ "Decide Business Logic"
*   ❌ "Optimize Prompt"
*   ❌ "Invent Tool"
*   ❌ "Auto-Approve Tool"

> 📌 Any Intent attempting to access these is **Invalid by Definition**.

---

## 6. Decision Execution Rule (Critical)

`logic64` **MUST**:
1.  Match Intent → Decision ID.
2.  Evaluate Criteria.
3.  Return Outcome + Reason.

`logic64` **MUST NOT**:
1.  Infer intent.
2.  Combine decisions.
3.  Skip criteria.
4.  Modify decision logic at runtime.

---

**Status**: Version 1.0 | **Mutability**: Controlled | **AI Write Access**: ❌ Forbidden
