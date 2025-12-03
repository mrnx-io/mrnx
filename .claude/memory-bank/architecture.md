# Architecture: mrnx Dashboard

## System Overview

```
User → mrnx.io (Vercel) → rd-engine-migration.vercel.app
                                    ↓
                          Research Results (JSON)
```

## Directory Structure

```
mrnx/
├── CLAUDE.md                    # Boot sequence
├── .claude/
│   ├── memory-bank/             # Persistent context
│   ├── agents/                  # Subagents
│   ├── commands/                # Slash commands
│   └── skills/                  # Reusable expertise
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── api/                     # API routes
│   │   └── research/
│   │       └── route.ts         # Proxy to R&D Engine
│   └── (routes)/                # Page routes
├── components/                  # React components
│   ├── ui/                      # Base UI components
│   └── features/                # Feature components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities
├── styles/                      # Global styles
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── next.config.js               # Next.js config
```

## Key Components

### App Router (`app/`)
- Server Components by default
- Client Components marked with 'use client'
- API routes in `app/api/`

### Components (`components/`)
- `ui/` - Reusable UI primitives (Button, Input, Card)
- `features/` - Feature-specific components (ResearchForm, ResultsDisplay)

### API Proxy (`app/api/research/route.ts`)
- Proxies requests to R&D Engine
- Handles authentication
- Transforms responses if needed

## Data Flow

```
1. User enters query in ResearchForm
2. Client calls /api/research (local)
3. API route calls rd-engine-migration.vercel.app/api/research
4. R&D Engine processes query
5. Results returned to API route
6. Results displayed in ResultsDisplay component
```

## Key Design Decisions

1. **Next.js App Router**: Modern React patterns, server components
2. **Vercel Deployment**: Seamless integration, auto-scaling
3. **API Proxy**: Hide backend URL, add auth if needed
4. **TypeScript Strict**: Catch errors at compile time
5. **Tailwind CSS**: Utility-first, no CSS maintenance
