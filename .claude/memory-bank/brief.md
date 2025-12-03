# Project Brief: mrnx (Frontend Dashboard)

**This file is the source of truth. User-controlled only.**

## What This Project Is

mrnx is the frontend dashboard for the AI Agents portfolio. It provides a user interface for interacting with the R&D Engine and visualizing research results.

## Core Objective

Provide a clean, modern UI for:
- Submitting research queries to the R&D Engine
- Displaying structured research results
- Managing research history
- Portfolio showcase

## Architecture Summary

```
User → mrnx.io (Next.js) → rd-engine-migration.vercel.app (API)
                                     ↓
                         Claude + Grok (Research)
                                     ↓
                              Research Results
```

## Key Design Principles

1. **First Principles Simplification**: Question every assumption, delete before optimizing
2. **Server Components First**: Use React Server Components where possible
3. **Progressive Enhancement**: Works without JavaScript for basic functionality
4. **Mobile First**: Responsive design starting from mobile

## Constraints

- TypeScript strict mode required
- No `any` types without justification
- All code must pass ESLint + TypeScript before commit
- Vercel deployment

## Deployment

- **Production**: https://mrnx.io
- **Backend**: https://rd-engine-migration.vercel.app

## Related Configuration

- **First Principles Protocol**: @.claude/memory-bank/first-principles.md
- **Current Context**: @.claude/memory-bank/context.md
- **Architecture Details**: @.claude/memory-bank/architecture.md
