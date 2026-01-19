# logic64 Service Responsibility & Control Matrix (SRCM)

> [!IMPORTANT]
> **GOVERNANCE RULE ZERO**:
> **Anything NOT explicitly defined in this matrix is FORBIDDEN.**
> There is no "default allow". There is no "implicit permission".

## 1. Core Philosophy
This document converts the abstract "Architecture" into a concrete "Permission Tables".
It answers: **Who Thinks? Who Decides? Who Acts?**

*   **LLM Role**: Operator (Proposes Intent).
*   **MCP-Decision**: Judge (Evaluates & Approves).
*   **MCP-Core**: Executor (Invokes Tools).
*   **Gateway**: Shield (Enforces Restrictions).

## 2. Use-Case Responsibility Map
We start from the **Use-Case**. If a Use-Case is not listed, the system cannot perform it.

| Use-Case ID | Name | Trigger | Governor (Policy) | Decider (Logic) | Executor (Action) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UC-01** | `ProjectInitialization` | Gateway | Governance Svc | MCP-Decision | MCP-Core |
| **UC-02** | `ArchitectureDefinition` | Gateway | Governance Svc | MCP-Decision | MCP-Core |
| **UC-03** | `ToolActivation` | Gateway | Policy Svc | MCP-Decision | Tool Registry |
| **UC-04** | `LLMPromptExecution` | Gateway | Contract Svc | MCP-Decision | MCP-Core |
| **UC-05** | `ToolInvocation` | Gateway | **Governance Svc** | **MCP-Decision** | **Tool Bridge** |
| **UC-06** | `ContractUpdate` | Gateway | Governance Svc | MCP-Decision | Contract Svc |
| **UC-07** | `ExtKnowledgeFetch` | Gateway | Policy Svc | MCP-Decision | Tool Bridge |
| **UC-08** | `DecisionOverride` | Dashboard | Security Svc | MCP-Decision | MCP-Decision |
| **UC-09** | `SessionTermination` | Gateway | Session Svc | Session Svc | Session Svc |

## 3. Decision Authority Layer
Who owns which *type* of decision? This prevents "Decision Leakage".

| Decision Type | Description | **Owner (The Authority)** | Consumer |
| :--- | :--- | :--- | :--- |
| **Architectural** | System structure/patterns | **MCP-Decision** | MCP-Core |
| **Security** | Access Control / Auth | **Governance Svc** | Gateway |
| **Tool Eligibility** | Can this tool be used now? | **MCP-Decision** | Tool Registry |
| **Execution Path** | How to run the logic? | **MCP-Core** | Tool Bridge |
| **Context Validity** | Is the data stale? | **Session Svc** | Gateway |
| **Intent Interpretation** | What does the user want? | **LLM** (Proposal) | MCP-Decision |

> [!WARNING]
> The **LLM** is strictly an "Intent Proposer". It never owns the Final Decision.

## 4. Tool Invocation Matrix (The Firewall)
This table closes the door on chaos.

| Tool Category | Allowed By | Invoked By | **Forbidden For** |
| :--- | :--- | :--- | :--- |
| **Internal Tools** (DB, State) | MCP-Decision | MCP-Core | **LLM** |
| **External Tools** (Search, API) | MCP-Decision | Tool Bridge | **LLM** |
| **Context Tools** (Read Memory) | Session Svc | MCP-Core | **LLM** |
| **System Tools** (Time, Logs) | Governance Svc | MCP-Core | **LLM** |

> **Critical Rule**: The LLM **NEVER** calls a tool directly. It sends a `ToolRequest` signal to the Gateway, which flows through the Governance/Decision layers.

## 5. LLM Constraint Injection
The Gateway injects this Directive based on the active SRCM row:

```yaml
# DYNAMICALLY INJECTED DIRECTIVE
system_enforcement:
  role: "Operator"
  status: "Restricted"
  constraints:
    - "You are NOT allowed to decide architectural patterns."
    - "You MUST ask MCP-Decision before proposing tool usage."
    - "Direct tool execution is DISABLED."
  active_permissions:
    - "Propose Intent"
    - "Request Clarification"
```
