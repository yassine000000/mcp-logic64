# logic64 Service Interaction Sequences

> [!IMPORTANT]
> **GOVERNANCE RULE: NO DIRECT PATHS**
> There is **NO** direct path between the LLM and any Tool or Decision.
> All interactions must traverse the `MCP-Gateway` -> `MCP-Decision` -> `MCP-Core` pipeline.

## Sequence 1: Session Initialization
1.  **User**: Initiates session.
2.  **MCP-Gateway**: Creates `SessionContext` (Tenant/Project/Permissions).
3.  **Governance Layer**: Validates credentials.
4.  **MCP-Gateway**: Generates initial **LLM Contract Document**.
5.  **LLM**: Connects and receives the Contract.
    *   *Result*: LLM is constrained from Token 0.

## Sequence 2: Problem Definition (No Decisions)
1.  **User**: States problem/goal.
2.  **LLM**: Proposes `StructuredIntent` (No decisions).
3.  **MCP-Gateway**: Forwards to `MCP-Decision-System`.
4.  **MCP-Decision-System**:
    *   Determines required clarifying questions.
    *   **REJECTS** any premature execution or architecture proposals.
5.  **MCP-Gateway**: Returns approved questions to LLM.
6.  **LLM**: Asks User.

## Sequence 3: Architecture Definition
1.  **User**: Requests architecture definition.
2.  **LLM**: Sends `ArchitectureRequest` (Intent).
3.  **MCP-Gateway**: Forwards to `MCP-Decision-System`.
4.  **MCP-Decision-System**:
    *   Evaluates inputs against `Constraints`.
    *   **DECIDES** the Architecture Pattern.
5.  **MCP-Core**:
    *   Locks the Architecture State.
    *   Prevents future drift.
6.  **Governance**: Logs the decision.
7.  **LLM**: Explains the *approved* architecture to the User.

## Sequence 4: Tool Activation
1.  **User**: Requests a tool (e.g., "Use Perplexity").
2.  **MCP-Gateway**: Checks Governance Policy.
3.  **MCP-Decision-System**:
    *   Checks `ToolEligibility`.
    *   Defines `UsageScope`.
4.  **Tool Registry**: Maps the tool to the specific Tenant Bridge.
5.  **MCP-Gateway**: Updates and Re-injects the **LLM Contract**.
    *   *Result*: Tool is visible but **not** directly callable.

## Sequence 5: Tool Invocation (Controlled)
1.  **LLM**: Needs external info. Sends `ToolRequestIntent`.
2.  **MCP-Gateway**: Forwards to `MCP-Decision-System`.
3.  **MCP-Decision-System**:
    *   Validates permission.
    *   Sanitizes parameters.
4.  **MCP-Core**: **EXECUTES** the tool via `Tool Bridge`.
5.  **Tool Bridge**: Returns raw result to `MCP-Core`.
6.  **MCP-Core**: Sanitizes result -> Returns to LLM.

## Sequence 6: Contract Update (Dynamic Injection)
1.  **Trigger**: Context change (Decision made, Tool added).
2.  **MCP-Gateway**: Generates new Contract.
3.  **System**: Injects into LLM context immediately.
4.  **LLM**: Adopts new constraints without restart.

## Sequence 7: Session Termination
1.  **User**: Ends session.
2.  **MCP-Core**: Teardown `ExecutionContext`.
3.  **Governance**:
    *   Finalizes Audit Log.
    *   Closes all Tool Bridges.
