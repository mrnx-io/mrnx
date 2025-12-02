# Kilo Code Configuration Index

**READ THIS FIRST.** This file defines the boot sequence and file hierarchy for all tasks.

## Boot Sequence

At the start of EVERY task, execute these steps in order:

### Step 1: Load Memory Bank
Read ALL files in `.kilocode/rules/memory-bank/`:
1. `brief.md` - Project overview (source of truth)
2. `product.md` - What we're building and why
3. `architecture.md` - Component architecture and data flow
4. `tech.md` - Technology stack and setup
5. `context.md` - Current work focus and recent changes

After reading, confirm: `[Memory Bank: Active]`

### Step 1.5: Check Task Patterns
If task matches a pattern in `tasks.md`, follow the documented steps.

### Step 2: Load Current Mode Rules
Based on current mode, read the corresponding folder:
- **Code mode**: `.kilocode/rules-code/`
- **Architect mode**: `.kilocode/rules-architect/`
- **Debug mode**: `.kilocode/rules-debug/`

### Step 3: Apply First Principles
All decisions must follow `.kilocode/rules/first-principles-protocol.md`

### Step 4: Start Task
Now you have full context. Begin the user's task.

---

## Definitions

**Model-Initiated:** AI executes automatically after completing a step, without waiting for user prompt. The automation chain is model-initiated.

---

## Navigation Quick-Reference

| I need to... | Use Mode | Then Workflow |
|--------------|----------|---------------|
| Plan/design component | architect | - |
| Write/modify code | code | `/add-feature.md` |
| Fix a bug | debug | `/dev-check.md` |
| Commit changes | any | `/git-commit.md` |
| Undo a bad commit | any | `git revert HEAD && git push` |
| Update documentation | any | `/update-memory-bank.md` |

---

## Mode Switching

| Current Situation | Switch To | Trigger | Auto? |
|-------------------|-----------|---------|-------|
| Build fails in code mode | debug | TypeScript/ESLint errors | Yes |
| Design decision needed | architect | Uncertainty about approach | No |
| Design approved | code | Ready to implement | No |
| Bug fixed in debug mode | code | Fix verified | Yes |
| Three.js shader issue | debug | Visual/WebGL errors | Yes |

---

## File Hierarchy

```
.kilocode/
├── rules/                              # Always loaded
│   ├── 00-index.md                     # THIS FILE - Read first
│   ├── first-principles-protocol.md   # Meta-rule for all decisions
│   ├── coding-rules.md                # TypeScript + React + Three.js standards
│   ├── memory-bank-instructions.md    # Memory Bank operations
│   └── memory-bank/                   # Project context (6 files)
│       └── tasks.md                   # Repetitive workflow patterns
├── rules-code/                         # Code mode only
│   └── implementation.md              # Implementation + automation chain
├── rules-architect/                    # Architect mode only
│   └── design.md                      # Component design decisions
├── rules-debug/                        # Debug mode only
│   └── debugging.md                   # Debugging procedures
└── workflows/                          # Slash commands (/name.md)
    ├── dev-check.md                   # Pre-commit verification
    ├── add-feature.md                 # Feature development flow
    ├── update-memory-bank.md          # Memory persistence
    └── git-commit.md                  # Commit + auto-push
```

---

## Automation Chain

After completing any implementation:
```
Code Change → /dev-check.md → /update-memory-bank.md → /git-commit.md → Auto-push
```

All steps execute automatically (model-initiated) with YOLO mode enabled.

---

## Key Commands

| Command | Action |
|---------|--------|
| `initialize memory bank` | First-time Memory Bank setup |
| `update memory bank` | Refresh all Memory Bank files |
| `add task` | Document repetitive workflow |
| `/dev-check.md` | Run verification suite |
| `/git-commit.md` | Commit and push changes |
| `git revert HEAD && git push` | Undo most recent commit |