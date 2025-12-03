---
description: Run full development verification suite
---

# Development Check

Run the full verification suite before committing.

## Steps

### 1. TypeScript Verification

```bash
# Type check
npm run typecheck

# Lint check
npm run lint

# Run tests
npm test
```

### 2. Build Verification

```bash
npm run build
```

### 3. Handle Failures

| Failure | Action |
|---------|--------|
| TypeScript errors | Fix types |
| ESLint errors | Run `npm run lint -- --fix` |
| Test failures | Debug and fix |
| Build errors | Check imports, exports |

### 4. Report Results

```markdown
## Dev Check Results

- TypeScript: ✅/❌
- ESLint: ✅/❌
- Tests: ✅/❌
- Build: ✅/❌

**Status:** [READY TO COMMIT / NEEDS FIXES]
```
