# Debug Mode Rules

## Debugging Approach
1. Reproduce the issue first
2. Check browser DevTools console for errors
3. Examine each directory in isolation (`app/`, `components/`, `hooks/`)
4. Use React DevTools for component state

## Common Issues by Directory

### Pages (`app/`)
- Check if `'use client'` is missing on interactive pages
- Verify imports from components/hooks
- Check metadata exports for SEO issues

### Components (`components/`)
- Check TypeScript errors in props
- Verify `'use client'` on interactive components
- Check Tailwind class conflicts with clsx

### Hooks (`hooks/`)
- Check `useMemo` dependency arrays
- Verify state initialization values
- Look for infinite re-render loops

### Three.js/Shaders
- Check WebGL context errors in console
- Verify shader syntax (missing semicolons)
- Check uniform value types match GLSL declarations
- Verify Float32Array for buffer attributes

## Debugging Commands
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build (catches more errors)
npm run build

# Run dev with verbose
npm run dev -- --verbose
```

## Three.js Specific Debugging

### Canvas Not Rendering
1. Check if Canvas has explicit width/height or parent has size
2. Verify `'use client'` on CanvasContainer
3. Check browser WebGL support

### Shader Errors
1. Look for GLSL syntax errors in console
2. Check uniform types match (float vs vec2 vs vec3)
3. Verify attribute names match (`aRandom`, `aSize`)

### Performance Issues
1. Check particle count (reduce if laggy)
2. Verify `useMemo` for geometry creation
3. Check `useFrame` delta usage for frame-independent animation

## Auto-Testing (Model-Initiated)
After fixing any bug:
1. Execute `/dev-check.md` to run full verification (type check, lint, build)
2. If tests fail, continue debugging
3. Only report fix as complete after `/dev-check.md` passes

## Failure Recovery

| If This Fails | Do This |
|---------------|---------|
| TypeScript errors | Check types, add explicit types where needed |
| ESLint errors | Run `npm run lint` for specific errors |
| Build errors | Check imports, missing `'use client'` directives |
| Runtime errors | Check console, add error boundaries |
| Three.js black screen | Check Canvas sizing, WebGL support |
| Shader compile | Check GLSL syntax in console error |
| Bad commit pushed | `git revert HEAD && git push` |