---
description: Enter debugging workflow for frontend errors
---

# Debug Workflow

Systematic debugging for Next.js/React issues.

## Steps

### 1. Identify Error Type

| Type | Check |
|------|-------|
| Build | Terminal output |
| Runtime | Browser console |
| API | Network tab |
| Render | React DevTools |

### 2. Run Diagnostics

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build (catches more errors)
npm run build
```

### 3. Browser Debugging

1. Open DevTools (F12)
2. Check Console for errors
3. Check Network for failed requests
4. Check React DevTools for component state

### 4. Fix and Verify

1. Make minimal fix
2. Test in browser
3. Check all breakpoints
4. Run test suite
