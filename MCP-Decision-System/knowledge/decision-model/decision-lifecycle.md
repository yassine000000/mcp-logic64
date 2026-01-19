# Decision Lifecycle

1. **Trigger**: Event or cumulative insight triggers need for decision.
2. **Analysis**: AI analyzes data against `decision-matrix`.
3. **Drafting**: AI proposes a decision action.
4. **Validation**: Check against `prohibitions` and `confidence-thresholds`.
5. **Exposure**: Determine if decision is `Auto-Pilot`, `Notify-Only`, or `Human-Approval-Required`.
6. **Execution**: System handles the side-effect (AI NEVER executes, only signals).
