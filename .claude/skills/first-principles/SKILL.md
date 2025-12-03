---
name: first-principles
description: Apply first principles thinking to any decision or problem.
allowed-tools: Read, Grep, Glob
---

# First Principles Thinking Skill

Apply systematic first principles analysis.

## When to Use

- Making component decisions
- Evaluating approaches
- Simplifying solutions
- Questioning requirements

## The Protocol

**The 5-Step Algorithm:**
1. **Requirements** - Your constraints are wrong. Fix them first.
2. **Delete** - If not adding back 10%, not deleting enough.
3. **Simplify** - Don't optimize what shouldn't exist.
4. **Accelerate** - Only after deletion and simplification.
5. **Automate** - Only after the process is proven.

## Output Format

```markdown
## First Principles Analysis

### 1. Deconstruction
**Dumb Requirement:** [what's being questioned]
**Fundamental Axiom:** [what's actually true]

### 2. Algorithm Application
**Step Applied:** [Delete/Simplify/Accelerate/Automate]
**Reasoning:** [why]

### 3. Output
**Decision:** [solution]
**Trade-offs:** [what we're accepting]
```

## Frontend-Specific

| Question | First Principles Answer |
|----------|------------------------|
| "Do we need this component?" | What does it actually provide? |
| "Should we use this library?" | What's the minimal solution? |
| "Should we add state management?" | Is local state sufficient? |
