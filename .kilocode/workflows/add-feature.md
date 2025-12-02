# Add Feature Workflow

Standard workflow for adding new functionality to KINETIC-CORTEX.

## Steps

1. **Requirement Analysis** (Architect mode recommended)
   - Identify which layer(s) are affected (L0-L3)
   - Determine if new files needed or modification of existing
   - Consider component interfaces and hooks

2. **Implementation** (Code mode)
   - Create/modify source files in `app/`, `components/`, or `hooks/`
   - Follow patterns from similar existing code
   - Add proper TypeScript interfaces
   - Add `'use client'` for interactive components

3. **Styling** (Code mode)
   - Use Tailwind with design tokens
   - Follow glassmorphism patterns for cards
   - Use `#00D4AA` primary color

4. **Animation** (Code mode)
   - Use Framer Motion for UI transitions
   - Use `useFrame` + `maath/easing` for Three.js

5. **Automation Chain** (Model-Initiated)
   Execute the Automation Chain (see [`00-index.md`](../rules/00-index.md#automation-chain)).