# Development Check Workflow

Run the full development verification suite before committing.

## Steps

1. Run TypeScript type check:
   ```bash
   npx tsc --noEmit
   ```

2. Run ESLint:
   ```bash
   npm run lint
   ```

3. Run build to catch additional errors:
   ```bash
   npm run build
   ```

4. If any step fails:
   - For TypeScript errors: Fix type issues, add explicit types
   - For ESLint errors: Check rule violations, fix or disable with comment
   - For build errors: Check imports, missing directives, module resolution

5. Report results to user with summary of:
   - TypeScript check status
   - Linting issues (if any)
   - Build status (success/failure)

## Quick Command

Run all checks in sequence:
```bash
npx tsc --noEmit && npm run lint && npm run build
```

## Common Fixes

| Error Type | Quick Fix |
|------------|-----------|
| Missing `'use client'` | Add directive to top of file |
| Type mismatch | Add explicit TypeScript types |
| Unused import | Remove or use the import |
| Missing dependency | Check useEffect/useMemo deps array |
| ESLint rule | Fix inline or add disable comment |