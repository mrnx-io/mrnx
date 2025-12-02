# Code Mode Implementation Rules

## Before Making Changes
1. Read relevant existing code first
2. Understand the project structure (`app/`, `components/`, `hooks/`)
3. Check for existing patterns in similar code

## Implementation Guidelines
- Follow existing patterns in the codebase
- Use TypeScript interfaces for all props/state
- Add `'use client'` for interactive components
- Export named components, not default

## Testing Requirements
- Test hooks in isolation with mock data
- Visual testing for Three.js components
- Keep calculations pure and testable

## Common Patterns

### Component Files
```tsx
'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface ComponentProps {
  // Define props
}

export function Component({ prop }: ComponentProps) {
  return (
    // JSX
  )
}
```

### Hook Files
```tsx
import { useState, useMemo } from 'react'

export interface InputType { /* ... */ }
export interface OutputType { /* ... */ }

export function useMyHook(initial: InputType) {
  const [state, setState] = useState(initial)
  
  const computed = useMemo(() => {
    // Expensive calculation
  }, [state])
  
  return { state, computed, setState }
}
```

### Three.js Patterns
See [`NeuralKernel.tsx`](components/NeuralKernel.tsx) for reference:
- Geometry: useMemo with Float32Array
- Animation: useFrame with delta
- Shaders: Inline GLSL strings
- Uniforms: useMemo with { value: initial }

### Tailwind Patterns
See [`ControlPanel.tsx`](components/architect/ControlPanel.tsx) for reference:
- Glass card: `bg-[#050505]/80 backdrop-blur-2xl border border-white/10`
- Primary accent: `text-[#00D4AA]` or `bg-[#00D4AA]/10`
- Input focus: `focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA]`

## Post-Implementation
After completing any implementation, execute the Automation Chain (see [`00-index.md`](../rules/00-index.md#automation-chain)).