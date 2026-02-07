# logic64 Builder Context Map (MCP-Core)

> [!IMPORTANT]
> **AI INSTRUCTION: READ ME FIRST**
> This file is the **Index of Law**.
> Before writing code, you MUST understand the architectural constraints defined in these documents.

## 1. The Product Vision (ROOT)
*   **[logic64_product_definition.md](../../../logic64_product_definition.md)**
    *   **What**: The Single Master MCP Server Definition.
    *   **Why**: Understands the "One Server" invariant.
*   **[domain_definition.md](./domain_definition.md)**
    *   **What**: The Domain Boundaries & Invariants.
    *   **Why**: Defines the "Governed Decision Execution" domain and strict "No-Go" zones.

## 2. The System Architecture (THE BODY)
*   **[system_architecture.md](./system_architecture.md)**
    *   **What**: The 7-Layer Professional Architecture.
    *   **Why**: Defines where components live (Layer 0 to Layer 7).
*   **[core_services.md](./core_services.md)**
    *   **What**: The 9 Mandatory Logical Services.
    *   **Why**: Defines the internal modules (Gateway, Decision, Orchestration...).

## 3. The Governance Rules (THE LAW)
*   **[SRCM.md](./SRCM.md)**
    *   **What**: The Service Responsibility & Control Matrix.
    *   **Why**: **Rule Zero**. Defines strict jurisdiction (Who thinks, who decides, who executes).
*   **[decision_system_logic.md](./decision_system_logic.md)**
    *   **What**: The Decision Engine Logic (Type A vs Type B).
    *   **Why**: Explains how the "Judge" evaluates code.
*   **[internal_decisions.md](./internal_decisions.md)**
    *   **What**: The Architectural Decision Log.
    *   **Why**: The history of "Why we built it this way".
*   **[governance_contract.md](./governance_contract.md)**
    *   **What**: The LLM Operational Contract.
    *   **Why**: Defines your role as "Operator", not "Decider".
*   **[bootstrap_contract.md](./bootstrap_contract.md)**
    *   **What**: The Bootstrap / Token-Efficiency Protocol.
    *   **Why**: **READ THIS FIRST** for current session rules.
*   **[../knowledge/governance_contract_template.md](../knowledge/governance_contract_template.md)**
    *   **What**: The Runtime Execution Law (Injected).
    *   **Why**: The actual text you are bound by during execution.

## 4. The Implementation Blueprint (THE CODE)
*   **[backend_structure.md](./backend_structure.md)**
    *   **What**: Clean Architecture Directory Layout.
    *   **Why**: Where to put files (`core/`, `domain/`, `governance/`).
*   **[technology_invariants.md](./technology_invariants.md)**
    *   **What**: Node.js/TypeScript Stack Rules.
    *   **Why**: No Python Core, No MVC Frameworks.
*   **[use_case_contract_standard.md](./use_case_contract_standard.md)**
    *   **What**: The 12-point Use-Case Schema.
    *   **Why**: Every feature must act as a Formal Decision Unit.
