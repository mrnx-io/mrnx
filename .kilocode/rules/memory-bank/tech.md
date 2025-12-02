# Technology Stack

## Runtime

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Next.js | 16.0.3 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |

## 3D Rendering

| Library | Version | Purpose |
|---------|---------|---------|
| Three.js | 0.181.2 | WebGL 3D engine |
| @react-three/fiber | 9.4.0 | React renderer for Three.js |
| @react-three/drei | 10.7.7 | R3F helpers and abstractions |
| maath | 0.10.8 | Math utilities (easing, interpolation) |

## UI & Styling

| Library | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| Framer Motion | 12.23.24 | React animations |
| Recharts | 3.5.0 | Chart components |
| lucide-react | 0.554.0 | Icon library |
| clsx | 2.1.1 | Conditional classNames |
| tailwind-merge | 3.4.0 | Merge Tailwind classes |

## Development Setup

### Required Environment
```bash
Node.js 18+
npm or pnpm
```

### Installation
```bash
# Clone and install
git clone [repo]
cd kinetic-cortex
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development Commands
```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Pre-commit validation
npx tsc --noEmit && npm run lint && npm run build
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| [`package.json`](package.json) | Dependencies and scripts |
| [`tsconfig.json`](tsconfig.json) | TypeScript configuration |
| [`next.config.ts`](next.config.ts) | Next.js configuration |
| [`postcss.config.mjs`](postcss.config.mjs) | PostCSS/Tailwind setup |
| [`eslint.config.mjs`](eslint.config.mjs) | ESLint configuration |

## Design Tokens

### Colors
```css
/* Primary (Bioluminescent) */
--kinetic-primary: #00D4AA;

/* Background */
--kinetic-bg: #050505;
--kinetic-bg-card: rgba(5, 5, 5, 0.8);

/* Text */
--kinetic-text: #e2e8f0;  /* slate-200 */
--kinetic-text-muted: #94a3b8;  /* slate-400 */
--kinetic-text-subtle: #64748b;  /* slate-500 */

/* Accents */
--kinetic-danger: #ef4444;  /* red-500 */
--kinetic-border: rgba(255, 255, 255, 0.1);
```

### Glassmorphism Pattern
```css
/* Card Style */
.glass-card {
  @apply bg-[#050505]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50;
}

/* Input Style */
.glass-input {
  @apply bg-black/40 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)];
}
```

## Three.js Configuration

### Canvas Settings
```tsx
<Canvas
  camera={{ position: [0, 0, 60], fov: 45 }}
  gl={{ antialias: false, powerPreference: "high-performance" }}
/>
```

### Shader Uniforms
```glsl
uniform float uTime;      // Animation time
uniform vec2 uMouse;      // Mouse position (-1 to 1)
uniform float uHover;     // Mouse interaction strength
uniform float uFocus;     // Focus state (0 to 1)
```

## Fiscal Calculation Constants

From [`useWealthCalculator.ts`](hooks/useWealthCalculator.ts):
```typescript
const DEFAULTS = {
  loanAmount: 870000,     // €870k mortgage
  box1Cap: 540000,        // Box 1 deduction cap
  wozValue: 870000,       // Property value
  rateBV: 4.6,            // BV interest rate %
  rateBank: 4.4,          // Bank interest rate %
  taxIB: 37.48,           // Income tax rate %
  taxVpb: 19.0,           // Corporate tax rate %
  taxBox3: 2.0,           // Wealth tax rate %
  yieldBV: 1.5,           // Alternative BV yield %
  YEARS: 30,              // Loan term
};
```

## Testing (Planned)

- **Framework**: Vitest
- **Component Testing**: React Testing Library
- **E2E**: Not required for MVP
- **Mock Strategy**: Mock Three.js context, test hooks in isolation