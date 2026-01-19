# logic64 Jurisdiction & Authority Model (SRCM)

*   **Artifact Type**: Governance Control Document
*   **Layer**: MCP-Core (The Law)
*   **Audience**: MCP-Core • MCP-Decision-System • Gateway • Tool Bridge • Any Future Agent

## 1. Purpose
The **SRCM** answers the following questions with zero ambiguity:
*   Who thinks?
*   Who decides?
*   Who executes?
*   Who owns the right?
*   Who is forbidden?

> **INVARIANT**: Any behavior not listed here is **ILLEGAL** within `logic64`.

---

## 2. Rule Zero (Constitutional)

> **No Component May Perform an Action Outside Its Jurisdiction.**

*   No "inference".
*   No "implicit permissions".
*   No "temporal exceptions".
*   No "operational flexibility".

---

## 3. Authorized Services (The Players)

| Service | Role (Non-negotiable) |
| :--- | :--- |
| **MCP-Gateway** | Transport & Session Entry |
| **MCP-Core** | Governance Enforcement |
| **MCP-Decision-System** | Decision Evaluation |
| **Tool Registry** | Tool Metadata Authority |
| **Tool Bridge** | Controlled Execution |
| **Session Service** | Session State Authority |
| **Audit Log** | Trace & Accountability |
| **LLM (Operator)** | Intent Emitter ONLY |

---

## 4. Service Responsibility Matrix (SRCM)

### 🧱 Core Responsibility Table

| Action | Gateway | Core | Decision | Registry | Bridge | Session | LLM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Receive Intent** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Classify Intent** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Validate Governance** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Evaluate Decision** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Activate Tool** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Invoke Tool** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Manage Session State**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Log Audit Event** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Emit Intent** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

> **CRITICAL NOTES**:
> *   `MCP-Core` does not decide.
> *   `MCP-Decision` does not execute.
> *   `Tool Bridge` does not analyze.
> *   `LLM` never touches any Tool.

---

## 5. Decision vs Execution Split (Non-Crossable)

| Capability | Allowed Owner |
| :--- | :--- |
| **"Is this allowed?"** | `MCP-Decision-System` |
| **"How to do it?"** | `MCP-Core` |
| **"Do it"** | `Tool Bridge` |
| **"Why it exists"** | `Governance Docs` |
| **"Request it"** | `LLM` |

> 📌 **Any attempt to combine Decision + Execution = VIOLATION.**

---

## 6. Forbidden Crossings (Explicitly Illegal)

| Illegal Pattern | Reason |
| :--- | :--- |
| **LLM → Tool** | Tool Hallucination Risk |
| **MCP-Decision → Tool** | Decision Leakage |
| **MCP-Core → Tool** | Authority Mixing |
| **Tool → Session** | State Corruption |
| **Tool → Governance** | Law Mutation |

---

## 7. Tool Invocation Authority Model

| Tool Category | Allowed Requestor | Allowed Invoker |
| :--- | :--- | :--- |
| **Internal Tool** | `MCP-Decision` | `Tool Bridge` |
| **External API** | `MCP-Decision` | `Tool Bridge` |
| **Knowledge MCP** | `MCP-Decision` | `Tool Bridge` |
| **File System** | ❌ | ❌ |

> 📌 **LLM** = Request Only (via Intent).

---

## 8. Audit & Trace Enforcement
Every Action MUST produce:
1.  Actor ID
2.  Service ID
3.  Decision ID (if any)
4.  Outcome
5.  Timestamp

> **No Action Without Trace.**

---

## 9. Mutability Rules

| Element | Mutable? | Who |
| :--- | :--- | :--- |
| **SRCM** | ❌ | Governance Authority |
| **Decisions** | ⚠️ Controlled | Governance Update |
| **Tool Activation** | ✅ | Admin / User |
| **Session State** | ✅ | Session Service |
| **LLM Instructions** | Dynamic | `MCP-Core` |

---
**Status**: Active v1.0 | **Edited By**: Governance Authority ONLY | **AI Write Access**: ❌ Forbidden
