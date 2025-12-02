# Architect Mode Design Rules

## Planning Approach
1. Analyze requirements against project structure
2. Identify which directory is affected (`app/`, `components/`, `hooks/`)
3. Consider component dependencies
4. Document component props and hook interfaces

## Architecture Decisions
- Maintain Server/Client component separation
- Keep shaders inline for hot-reload
- Custom hooks for state management (no Redux)
- Prioritize visual premium over complexity

## Documentation Requirements
- Update `.kilocode/rules/memory-bank/architecture.md` for structural changes
- Update README.md for user-facing changes
- Document new TypeScript interfaces

## First Principles Checklist
- [ ] Does this simplify or add complexity?
- [ ] Is this the minimal solution?
- [ ] Does this maintain 60fps performance?
- [ ] Are calculations properly memoized?
- [ ] Is the UI consistent with design tokens?

## Component Design Patterns

### New Page
1. Create file in `app/[route]/page.tsx`
2. Add layout if needed
3. Import necessary components from `components/`
4. Use hooks from `hooks/` for state

### New Component
1. Determine Server vs Client (`'use client'`)
2. Define TypeScript interface for props
3. Use Tailwind with design tokens
4. Add Framer Motion for animations if needed

### New Hook
1. Create in `hooks/`
2. Define input/output interfaces
3. Use `useMemo` for expensive calculations
4. Export both hook and types

### New 3D Feature
1. Extend `NeuralKernel.tsx` or create sibling
2. Keep shader code inline
3. Use `useFrame` for animations
4. Memoize geometry/material creation