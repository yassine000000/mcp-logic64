# logic64 Use-Case Contract Standard

> [!IMPORTANT]
> **GOVERNANCE RULE: FORMAL DECISION UNITS**
> A `Use-Case` in logic64 is not just a function; it is a **Formal Unit of Governance**.
> It must adhere to this contract to ensuring traceability, explainability, and safety.

## Philosophy
Every Use-Case is a **Decision** that must explain:
1.  **Why** it was executed.
2.  **What** was allowed/forbidden.
3.  **What** changed.

## Canonical Contract Template (YAML/Schema)

### 1. Metadata (Identity)
```yaml
use_case:
  id: UC-DOMAIN-XXX
  name: Canonical Name
  version: 1.0.0
  maturity: stable | experimental | deprecated
  owner: logic64-core
```
*   **Purpose**: Versioning and Compatibility checks.

### 2. Intent (Why)
```yaml
intent:
  statement: >
    Establish a validated, governed system architecture
    aligned with business goals and technical constraints.
```
*   **Usage**: Consumed by the LLM for context and `MCP-Decision-System` for justification.

### 3. Preconditions (Guardrails)
```yaml
preconditions:
  required_context:
    - project_goal
    - target_users
  forbidden_states:
    - undefined_scope
```
*   **Rule**: If not met, execution is **rejected** immediately.

### 4. Inputs Contract (Strict Schema)
```yaml
inputs:
  type: object
  schema:
    project_goal: string
    enabled_tools:
      type: array
      items: ToolReference
```
*   **Rule**: No undefined inputs. No assumptions.

### 5. Decision Flow (The Logic)
```yaml
decision_flow:
  steps:
    - validate_inputs
    - apply_governance_rules
    - resolve_conflicts
    - determine_execution_path
```
*   **Runtime**: Executed by the `governance/mcp-decision-system` module.

### 6. Tool Policy (The Restriction)
```yaml
tool_policy:
  allowed:
    - allowed_tool_name
  conditional:
    - tool: external_tool_x
      condition: tool_enabled == true
  forbidden:
    - direct_code_execution
```
*   **Enforcement**: The **MCP Proxy** enforces this strictly. The LLM cannot call tools outside this list during this specific Use-Case.

### 7. Execution Contract
```yaml
execution:
  mode: orchestrated | autonomous | manual
  timeout_ms: 60000
  retry_policy:
    max_retries: 2
```

### 8. Outputs Contract (Guarantees)
```yaml
outputs:
  success:
    result_document: Schema
    decisions: DecisionLog[]
  failure:
    error_code: string
    reason: string
```
*   **Rule**: No ambiguous return types.

### 9. Postconditions (State Change)
```yaml
postconditions:
  state_changes:
    - architecture_defined
    - governance_locked
```

### 10. Governance Hooks
```yaml
governance:
  review_required: true
  decision_audit: mandatory
  override_allowed: false
```
*   **Enterprise Trait**: Defines if a human must approve the output.

### 11. Observability
```yaml
observability:
  logs:
    - decision_path
    - tool_usage
  metrics:
    - execution_time
```

### 12. LLM Instruction Block (The Prompt)
> This section is injected into the LLM context.
```yaml
llm_directive:
  rules:
    - Do not assume missing data
    - Do not call tools outside tool_policy
    - Ask clarifying questions if preconditions fail
```
*   **Benefit**: Prevents hallucination and tool abuse.
