# Architecture

## System Overview

Standard Next.js App Router project with three main directories:

```
app/           # Pages and layouts (route handlers)
components/    # Reusable React components (UI building blocks)
hooks/         # Custom React hooks (state and business logic)
```

## Directory Details

### Pages (`app/`)
- **Location**: [`app/`](app/)
- **Function**: Route handlers, layout composition
- **Files**:
  - [`app/page.tsx`](app/page.tsx) - Home with neural visualization
  - [`app/architect/page.tsx`](app/architect/page.tsx) - Wealth calculator
  - [`app/layout.tsx`](app/layout.tsx) - Root layout with fonts/meta

### Components (`components/`)
- **Location**: [`components/`](components/)
- **Function**: Reusable UI elements, both Server and Client
- **Core Components**:
  - [`CanvasContainer.tsx`](components/CanvasContainer.tsx) - R3F canvas wrapper
  - [`NeuralKernel.tsx`](components/NeuralKernel.tsx) - Lorenz attractor particles with inline GLSL shaders
  - [`UIOverlay.tsx`](components/UIOverlay.tsx) - Terminal-style overlay
- **Architect Components** ([`components/architect/`](components/architect/)):
  - [`ControlPanel.tsx`](components/architect/ControlPanel.tsx) - Input controls
  - [`ResultsDisplay.tsx`](components/architect/ResultsDisplay.tsx) - Comparison results
  - [`MatrixTable.tsx`](components/architect/MatrixTable.tsx) - 30-year breakdown

### Hooks (`hooks/`)
- **Location**: [`hooks/`](hooks/)
- **Function**: Business logic, state management, calculations
- **Main Hook**:
  - [`useWealthCalculator.ts`](hooks/useWealthCalculator.ts) - All fiscal math
    - Inputs: loan, rates, fiscal params
    - Outputs: delta, bank/BV breakdowns, yearly matrix

## Key Technical Decisions

*Each decision annotated with the [First Principles Algorithm](../first-principles-protocol.md) step applied.*

### 1. Inline GLSL Shaders
**FP Step 3 (Simplify):** Keeping shaders in component files enables hot-reload during development. External `.glsl` files add complexity without benefit for this scale.

### 2. Custom Hook for Calculations
**FP Step 2 (Delete):** No Redux/Zustand. Single `useWealthCalculator` hook handles all state. Adding state libraries for a single-view app adds unnecessary complexity.

### 3. Client-Only Three.js
**FP Step 1 (Requirements):** Three.js requires browser APIs (WebGL). Server rendering is impossible, so all 3D components are explicitly `'use client'`.

### 4. Memoized Calculations
**FP Step 4 (Accelerate):** `useMemo` in calculator hook prevents recalculation on every render. Only recalculates when inputs change.

### 5. Tailwind v4 Direct
**FP Step 2 (Delete):** No CSS-in-JS library. Tailwind handles all styling with design tokens for consistency.

## Source Code Paths

| Component | Path |
|-----------|------|
| Home page | [`app/page.tsx`](app/page.tsx) |
| Architect page | [`app/architect/page.tsx`](app/architect/page.tsx) |
| Canvas wrapper | [`components/CanvasContainer.tsx`](components/CanvasContainer.tsx) |
| Neural particles | [`components/NeuralKernel.tsx`](components/NeuralKernel.tsx) |
| UI overlay | [`components/UIOverlay.tsx`](components/UIOverlay.tsx) |
| Control panel | [`components/architect/ControlPanel.tsx`](components/architect/ControlPanel.tsx) |
| Results display | [`components/architect/ResultsDisplay.tsx`](components/architect/ResultsDisplay.tsx) |
| Matrix table | [`components/architect/MatrixTable.tsx`](components/architect/MatrixTable.tsx) |
| Calculator hook | [`hooks/useWealthCalculator.ts`](hooks/useWealthCalculator.ts) |
| Global styles | [`app/globals.css`](app/globals.css) |

## Data Flow

```
WealthInputs (TypeScript Interface):
├── loanAmount: number (e.g., 870000)
├── box1Cap: number (e.g., 540000)
├── wozValue: number (e.g., 870000)
├── rateBV: number (e.g., 4.6%)
├── rateBank: number (e.g., 4.4%)
├── costBank: number (e.g., 3500)
├── taxIB: number (e.g., 37.48%)
├── taxVpb: number (e.g., 19%)
├── taxBox3: number (e.g., 2%)
├── yieldBV: number (e.g., 1.5%)
└── useBox3Savings: boolean

WealthResults:
├── delta: number (cumulative advantage)
├── bank: { totalWealth, interestPaid, taxRefund, netCost, altGain }
├── bv: { totalWealth, interestPaid, taxRefund, netIncome, box3Savings, taxLoad }
├── chartData: Array<{name, bank, bv}>
└── yearlyData: Array<{year, bankInterest, bankNetCost, bvInterest, ...}>
```

## Deployment

- **Development**: `npm run dev` (localhost:3000)
- **Build**: `npm run build` (static export)
- **Preview**: `npm run start`