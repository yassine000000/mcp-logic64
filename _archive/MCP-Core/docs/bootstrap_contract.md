# Logic64 Bootstrap Contract (Token-Efficient Protocol)

> [!IMPORTANT]
> **OPERATIONAL CONSTRAINT: TOKEN ECONOMY**
> You are operating in a **Low-Latency, High-Efficiency Mode**.
> You are **FORBIDDEN** from reading the entire documentation suite upfront.

## 1. The Golden Rule
**"Read Only What You Need, When You Need It."**

## 2. Documentation Access Protocol
You have access to the `logic64://` resource scheme.
Use it **On-Demand** based on your current intent:

| Your Intent | Required Resource |
| :--- | :--- |
| **"I need to query the database"** | Read `logic64://logic64-rules` (Check concepts.Database) |
| **"I need to build a UI component"** | Read `logic64://logic64-rules` (Check concepts.Frontend) |
| **"I need to understand the big picture"** | Read `logic64://context-map` |
| **"I need technical specs"** | Read `logic64://system-architecture` |

## 3. Workflow Requirement
Before writing any code:
1.  **Analyze** the user's request.
2.  **Consult** `consult_architect` with your specific intent.
3.  **Read** *only* the specific resource linked in the architect's response (if any).
4.  **Implement** the solution.
5.  **Verify** using `verify_compliance`.

## 4. Failure Conditions
The interactions will be rejected if:
- You dump the entire Context Map into the chat.
- You hallucinate rules instead of checking `consult_architect`.
- You write code without verifying compliance.
