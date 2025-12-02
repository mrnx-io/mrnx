# Coding Rules

## TypeScript Standards
- TypeScript 5.x strict mode
- Explicit return types for all exported functions
- Interface over type for object shapes
- Avoid `any` - use `unknown` with type guards when needed

## React Patterns
- React 19 with Server/Client component architecture
- `'use client'` directive for all Three.js and interactive components
- Custom hooks for state management (no external state libraries)
- Prefer composition over inheritance
- Named exports for all components

## Next.js Conventions
- App Router (Next.js 16)
- File-based routing in `app/` directory
- Metadata API for SEO
- Dynamic imports for heavy components (Three.js)

## Three.js / R3F Patterns
- React Three Fiber for declarative Three.js
- `@react-three/drei` for common abstractions
- GLSL shaders inline in component files for hot-reload
- `useFrame` for animation loops
- `useMemo` for geometry/material creation
- Dispose resources in cleanup

## File Organization
- Source code in `app/` (pages) and `components/` (UI)
- Custom hooks in `hooks/`
- Public assets in `public/`
- No `src/` directory (Next.js 16 convention)

## Code Quality
- ESLint with `eslint-config-next`
- No Prettier (Tailwind handles formatting)
- Pre-commit validation: Run [`/dev-check.md`](../workflows/dev-check.md)

## Styling
- Tailwind CSS v4 (PostCSS integration)
- `clsx` + `tailwind-merge` for conditional classes
- Design tokens: `#00D4AA` (primary/bioluminescent), `#050505` (background)
- Glassmorphism: `backdrop-blur-xl`, `bg-white/5`, `border-white/10`

## Animation
- Framer Motion for UI transitions
- `maath/easing` for Three.js interpolation
- Spring physics over duration-based animations

## Error Handling

### Client Components
- Error boundaries for Three.js canvas failures
- Suspense with fallback for async operations
- Graceful degradation for WebGL unsupported browsers

### Hooks
- Return `null` or empty state, never throw in render
- Use `useState` error state for async operations

### Fail-Fast Rules
- `throw` in event handlers is acceptable
- Console.error for non-critical warnings
- Never catch and suppress silently

## Testing Requirements
- Vitest for unit tests (when added)
- React Testing Library for component tests
- Mock Three.js context in tests
- No E2E tests required for MVP