# Logic64 Decision Engine Logic (v2.1)

> [!IMPORTANT]
> **Engine Type**: Dual-Mode Governance Engine
> **Protocol**: State-Gated Evaluation

## 1. Decision Types (The Two Brains)
The engine produces two distinct types of decisions based on the current System Mode.

### Type A: Architectural Decision (Mode: ARCHITECT)
*   **Producer**: Architect Node (High-Reasoning Model).
*   **Nature**: Exploratory, Optimization-focused, Trade-off Analysis.
*   **Output**: `Option A` vs `Option B` with Rationale.
*   **Artifact**: Writes to `blueprint.md`.

### Type B: Validator Decision (Mode: EXECUTION)
*   **Producer**: Validator Node (High-Speed Compliance Model).
*   **Nature**: Binary, Rigid, Deterministic.
*   **Output**: `Pass` (Allow Tool Use) or `Fail` (Block Tool Use).
*   **Artifact**: None (Stateless verification).

## 2. The Evaluation Flow (Execution Mode)
When in **EXECUTION** mode, the pipeline is strict and cryptographic.

1.  **Integrity Pre-Check (The Shield)**:
    *   **Input**: Current `.logic64/integrity.lock`.
    *   **Action**: Re-calculate Hash of current disk state.
    *   **Logic**: `If (CurrentHash != LockHash) -> HALT & ALERT("Tampering Detected").`

2.  **Context Loading**:
    *   Load `constraints.json` (The Law).
    *   Load `blueprint.md` (The Context).

3.  **Validator Screening (The Gate)**:
    *   **Input**: Proposed Code / Tool Call.
    *   **Logic**: Does `Input` violate any rule in `constraints.json`?
    *   *Example*: "User trying to import `pymongo` but `constraints.json` forbids `mongodb`."
    *   **Verdict**: `BLOCK`.

4.  **Execution Authorization**:
    *   If Integrity = OK AND Validator = PASS:
    *   **Grant Access**.

## 3. Decision Schema (v2.1)
```typescript
interface Decision {
  id: string;
  timestamp: number;
  mode: 'ARCHITECT' | 'EXECUTION';
  integrity_hash: string; // The hash this decision was made against
  intent: {
    target: string;
    action: string;
  };
  verdict: {
    result: 'ALLOWED' | 'BLOCKED';
    reason: string;
    violates_rule_id?: string;
  };
  signature: string;
}
```
