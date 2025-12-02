# Memory Bank

Memory persists context across session resets. **Boot sequence is in [`00-index.md`](00-index.md).**

## Structure

| File | Purpose | Editable |
|------|---------|----------|
| `brief.md` | Project scope, source of truth | User only |
| `product.md` | Why/how project works | AI |
| `context.md` | Current focus, recent changes | AI |
| `architecture.md` | Component architecture, data flow | AI |
| `tech.md` | Stack, setup, dependencies | AI |
| `tasks.md` | Repetitive workflow templates | AI |

## Workflows

### Initialize (`initialize memory bank`)
1. Analyze all source, config, and component files
2. Create 5 core Memory Bank files
3. Self-verify consistency against source code

### Update (`update memory bank`)
1. Review ALL Memory Bank files
2. Update `context.md` with current focus
3. Update other files if structural changes

### Add Task (`add task`)
Store repetitive workflows in `tasks.md`:
```markdown
## Task Name
**Files:** Component.tsx, hook.ts
**Steps:**
1. Step one
2. Step two
**Notes:** Important considerations
```

## Rules
- Read ALL Memory Bank files at task start (confirm: `[Memory Bank: Active]`)
- Prioritize `brief.md` if conflicts exist
- Suggest Memory Bank updates after significant changes
- On context window fill: update Memory Bank, then start fresh conversation