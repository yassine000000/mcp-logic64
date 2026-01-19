# logic64 Development Governance

> [!WARNING]
> **BUILDER CONTEXT**
> These rules apply to **US** (the developers building logic64).
> Any code added to this repository must strictly adhere to these governance principles.

## Rule 1: The Control Plane Invariant
logic64 is a **Control Plane**, not an Execution Engine.
*   **Do not** add business logic that performs the "users' work".
*   **Do** add logic that *governs* how the work is defined.
*   **Violation**: Hardcoding a specific user flow (e.g., "Ecommerce Checkout").
*   **Compliance**: Building a "Flow Definer" that requires the user to specify their checkout steps.

## Rule 2: Strict Subsystem Separation
Code must clearly belong to one of the defined subsystems.
*   **Governance Logic** goes to `MCP-Core`.
*   **Decision Logic** goes to `MCP-Decision-System`.
*   **Orchestration Logic** goes to `logic64 Main`.

## Rule 3: Code is a Consequence
No code shall be written without a preceding architectural decision.
*   Before implementing a feature, there must be an entry in `MCP-Decision-System/docs/internal_decisions.md`.
*   PRs/Commits should reference the Decision ID.

## Rule 4: LLM Interactions
When integrating LLMs (Claude, Cursor):
*   The LLM is an **Executor**, not a Decider.
*   The LLM must query `MCP-Core` to know "What is allowed".
*   The LLM must query `MCP-Decision-System` to know "Which path to take".

## Rule 5: User Interaction Flow
The logic64 product must force the user through this sequence:
1.  **Discussion** (No Code).
2.  **Governance Generation** (Problem/Scope).
3.  **Decision Making** (Architecture/Frameworks).
4.  **Binding** (Connecting the LLM).
5.  **Execution** (Generating Code).
*Any attempt to bypass strict ordering must be rejected by the implementation.*
