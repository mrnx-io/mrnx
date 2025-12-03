# mrnx - Claude Code Memory

**READ THIS FIRST.** This file is the boot sequence for all Claude Code sessions.

## Boot Sequence

At the start of EVERY task, execute these steps in order:

### Step 1: Load Memory Bank
Read the memory bank files via @imports below:
1. @.claude/memory-bank/brief.md - Project scope (source of truth)
2. @.claude/memory-bank/product.md - What we're building and why
3. @.claude/memory-bank/architecture.md - System design and structure
4. @.claude/memory-bank/tech.md - Technology stack and setup
5. @.claude/memory-bank/context.md - Current work focus and recent changes

After reading, confirm: `[Memory Bank: Active]`

### Step 2: Apply First Principles Protocol (MANDATORY)
**CRITICAL:** Load and internalize @.claude/memory-bank/first-principles.md

Before ANY significant decision, you MUST apply the 5-step algorithm:
1. **Requirements** → Are they actually correct? Question everything.
2. **Delete** → What can be removed entirely?
3. **Simplify** → What's the minimal solution?
4. **Accelerate** → Only after deletion and simplification
5. **Automate** → Only after the process is proven

After reading, confirm: `[First Principles: Loaded]`

### Step 3: Check Task Patterns
If task matches a pattern in @.claude/memory-bank/tasks.md, follow the documented steps.

### Step 4: Start Task
Now you have full context. Begin the user's task.

---

## Quick Reference

| I need to... | Action |
|--------------|--------|
| Plan/design changes | Enter Plan Mode (Shift+Tab twice) |
| Write/modify code | Use code agents, follow coding rules |
| Fix a bug | Use `/debug` command |
| Commit changes | Use `/commit` command |
| Update documentation | Use `/update-memory` command |

---

## Key Commands

| Command | Action |
|---------|--------|
| `/init-memory` | First-time Memory Bank setup |
| `/update-memory` | Refresh all Memory Bank files |
| `/dev-check` | Run verification suite (lint, type, test) |
| `/commit` | Commit and push changes |
| `/debug` | Enter debugging workflow |

---

## Memory Hierarchy

```
~/.claude/CLAUDE.md                    # Personal global preferences
./CLAUDE.md                            # THIS FILE - Project boot sequence
./.claude/memory-bank/                 # Detailed project context (6 files)
./.claude/agents/                      # Specialized subagents
./.claude/commands/                    # Custom slash commands
./.claude/skills/                      # Reusable expertise
./CLAUDE.local.md                      # Personal project overrides (gitignored)
```

---

## Coding Rules (Next.js Frontend)

- **TypeScript**: Strict mode, no `any` types
- **React**: Functional components, hooks only
- **Testing**: Jest, React Testing Library
- **Quality**: ESLint + Prettier before commit
- **Git**: Conventional commits, atomic changes

---

## Error Handling

- Use error boundaries for React components
- Handle async errors with try/catch
- Display user-friendly error messages
- Log errors for debugging

---

## First Principles Protocol (ALWAYS APPLY)

**You are REQUIRED to apply first principles thinking to EVERY decision.**

### The Test (Ask Before Every Action)
- Am I reasoning from first principles or by analogy?
- Have I tried to DELETE this requirement/component?
- Is this the SIMPLEST possible solution?
- Am I optimizing something that shouldn't exist?
- Am I automating too early?

### The Algorithm (Execute in Order)
1. **Requirements** → Your constraints are wrong. Question them.
2. **Delete** → If not adding back 10%, not deleting enough.
3. **Simplify** → Don't optimize what shouldn't exist.
4. **Accelerate** → Only after deletion and simplification.
5. **Automate** → Only after the process is proven.

**If uncertain about any decision, invoke the first-principles skill.**
