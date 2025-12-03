# Technology Stack: mrnx Dashboard

## Runtime Environment

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Next.js | 14+ | React framework |
| Vercel | Latest | Hosting |

## Frontend Stack

### Core
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5.0+ | Type safety |
| Next.js | 14+ | React framework |

### Styling
| Library | Purpose |
|---------|---------|
| Tailwind CSS | Utility-first CSS |
| shadcn/ui | Component library (optional) |

### Development
| Tool | Purpose |
|------|---------|
| ESLint | Linting |
| Prettier | Formatting |
| Jest | Testing |
| React Testing Library | Component testing |

## Environment Variables

### Required (Production)
```bash
NEXT_PUBLIC_RD_ENGINE_URL=https://rd-engine-migration.vercel.app
```

### Optional
```bash
RD_ENGINE_API_KEY=...           # If backend requires auth
```

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Test
npm test
```

## Vercel Configuration

Automatic from `next.config.js`:
- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: `.next`

## Key Configuration Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code boot sequence |
| `.claude/settings.json` | Project permissions + hooks |
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript config |
| `next.config.js` | Next.js config |
| `tailwind.config.js` | Tailwind config |
