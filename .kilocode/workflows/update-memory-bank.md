# Update Memory Bank Workflow

Workflow to update Memory Bank files after significant work. Can be auto-triggered by model-initiated slash commands.

## When to Execute

This workflow should be executed when:
- New feature implemented
- Architecture changes made
- Bug fixes that reveal important patterns
- Technology/dependency changes
- Any work that should persist to future sessions

## Steps

1. **Review Current Context**
   - Read `.kilocode/rules/memory-bank/context.md`
   - Identify what has changed since last update

2. **Update context.md**
   - Update "Current Work Focus" to reflect latest state
   - Add significant changes to "Recent Changes" section
   - Update "Next Steps" if priorities changed
   - Add any new "Known Issues" discovered

3. **Update architecture.md** (if structural changes)
   - Update layer details if modified
   - Add new technical decisions if made
   - Update source code paths if files added/moved

4. **Update tech.md** (if technology changes)
   - Add new dependencies
   - Update version requirements
   - Add new development commands

5. **Update product.md** (if scope changes)
   - Only if core objectives or success metrics changed
   - Rare - most updates are to context.md

6. **Verify Consistency**
   - Ensure brief.md still accurately describes project
   - If brief.md needs updates, suggest changes to user (don't edit directly)

## Output

Report to user what was updated:
- Files modified
- Key changes captured
- Any suggestions for brief.md updates