# Logic64 MCP Decision System

A specialized MCP server that provides the **Decision Policies** for logic64.
It defines *what* decisions are valid, *when* they can be made, and *what* exposure level they require.

## Role
This server is the "Policy Engine". It does NOT make decisions. It tells the AI Agent **how** to make decisions lawfully.

## Structure
*   **decision-model/**: The meta-rules (LifeCycle, Thresholds).
*   **decision-matrix/**: The domain rules (If X then Y is allowed).
*   **prohibitions/**: The clear "Red Lines".

## Usage
Claude Code should query this server to validate any proposed decision logic before implementation.
