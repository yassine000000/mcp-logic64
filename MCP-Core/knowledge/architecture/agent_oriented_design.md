# Agent-Oriented Architecture

This document defines the core architectural philosophy of logic64: **Agent-Oriented Architecture**.
It establishes the separation of concerns between the LLM (Intelligence), the MCP Server (Governance/Discovery), and the User (Goal).

## 1. Core Concept: Zero-Knowledge LLM

In this architecture, the LLM is treated as "Zero-Knowledge" regarding the specific tools available to it at the start of a session.
*   **❌ No Hardcoded Tools**: The LLM system prompt does not contain a static list of tools.
*   **❌ No User Assumption**: The User does not tell the LLM which tool to use.
*   **✅ Discovery via MCP**: The LLM connects to the MCP Server and discovers tools dynamically via the `Capability Manifest`.

## 2. Tool Discovery & Governance

The MCP Server provides a metadata manifest that describes:
*   **What**: Available tools.
*   **How**: Parameters and schemas.
*   **When**: "use_when" conditions.
*   **When Not**: "avoid_when" restrictions.

### Example Tool Definition (Abstract)
```json
{
  "tools": [
    {
      "name": "validate_architecture",
      "description": "Checks code against defined architectural constraints",
      "use_when": "User proposes architectural changes",
      "avoid_when": "Request is purely informational",
      "params": {
        "component": "required",
        "layer": "optional"
      }
    }
  ]
}
```

The LLM does not guess; it reads this contract to understand the system.

## 3. Decision Responsibility Matrix

The decision of "When to use a tool" is distributed:

| Entity | Role | Description |
| :--- | :--- | :--- |
| **User** | Goal | "Call MCP and handle this." (Doesn't know tools) |
| **LLM** | Intent | Understands the user's intent from natural language. |
| **MCP** | Policy | Dictates which tool matches that intent via Rules Engine. |

## 4. The Execution Flow

1.  **User -> LLM**: "Check if this new component follows the rules."
2.  **LLM -> MCP**: "Analyze request. Do I need tools?"
3.  **MCP -> LLM**: "Based on 'Intent == validation', you must use tool `validate_architecture`."
4.  **LLM -> Tool**: Executes `validate_architecture`.
5.  **LLM -> User**: Returns the compliance report.

## 5. Policy-Driven Rule Engine

The MCP provides a Rules Engine to guide the LLM deterministically:

```json
{
  "rules": [
    {
      "if": "intent == validation",
      "then": "require_governance"
    },
    {
      "if": "intent == explanation",
      "then": "no_tool"
    }
  ]
}
```

## Summary
*   **Agent-Oriented Architecture**: The system is built around autonomous agents adhering to strict protocols.
*   **Policy-Driven Tooling**: Tools are not just "available"; they are governed.
*   **Server-Side Intelligence**: The logic of *how* to use the system lives in the MCP, not the LLM's temporary context.
