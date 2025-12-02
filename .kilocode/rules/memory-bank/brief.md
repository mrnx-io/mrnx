# Project Brief: KINETIC-CORTEX

## What This Project Is
A premium wealth visualization platform combining 3D neural aesthetics with advanced financial modeling for Dutch BV owners comparing mortgage financing options (Bank vs BV lending).

## Core Objective
Provide an immersive, visually stunning interface that transforms complex fiscal calculations into intuitive, actionable insights through the "Wealth Architect" calculator.

## Project Structure
Standard Next.js App Router project with pages in `app/`, reusable components in `components/`, and custom hooks in `hooks/`. See [`architecture.md`](architecture.md) for detailed organization.

## Technology Stack
- **Runtime:** Next.js 16 + React 19
- **3D Engine:** Three.js via React Three Fiber
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Calculations:** Custom wealth calculator hook

## Key Design Principles
1. **Visual Premium:** Dark glassmorphism aesthetic with bioluminescent accents (#00D4AA)
2. **Performance First:** WebGL optimizations, memoized calculations
3. **Dutch Fiscal Accuracy:** Correct Box 1/2/3 tax calculations, WOZ integration
4. **Responsive Experience:** Desktop-first with mobile adaptation

## Key Constraints
- All Three.js components must have `'use client'` directive
- No external state management libraries
- GLSL shaders inline for hot-reload capability
- Dutch language UI for Wealth Architect page

## Entry Points
- **Home:** [`app/page.tsx`](app/page.tsx) - Neural visualization landing
- **Architect:** [`app/architect/page.tsx`](app/architect/page.tsx) - Wealth calculator

## Related Configuration
- **First Principles Protocol** is the meta-rule governing all decisions ([`first-principles-protocol.md`](../first-principles-protocol.md))
- Mode-specific rules in `rules-code/`, `rules-architect/`, `rules-debug/`
- Workflows in [`.kilocode/workflows/`](../../workflows/)