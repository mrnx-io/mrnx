# Current Context: mrnx Dashboard

## Status Legend
✅ = Complete | ⏳ = In Progress | ❌ = Blocked | ⚠️ = Needs Attention

## Current Work Focus

**Production Deployment** - mrnx deployed to Vercel at mrnx.io, ready for R&D Engine integration.

## Recent Changes (Dec 2025)

### Polyrepo Migration (Dec 3, 2025)
- **Change**: Extracted from ai-agents-research monorepo to standalone repo
- **Repository**: https://github.com/mrnx-io/mrnx
- **Deployment**: https://mrnx.io
- **First Principles Applied**: Polyrepo for Python/TypeScript separation

### Claude Memory Architecture Added (Dec 3, 2025)
- **Change**: Added full Claude Code memory architecture
- **Components**: CLAUDE.md, .claude/memory-bank, .claude/agents, .claude/commands, .claude/skills
- **Purpose**: Persistent context across sessions

## Active Components

| Component | Status | Notes |
|-----------|--------|-------|
| App Router | ✅ | Next.js 14+ |
| Home Page | ✅ | Landing page |
| Research Form | ⏳ | Needs R&D Engine connection |
| Results Display | ⏳ | Needs styling |
| API Proxy | ⏳ | /api/research route |
| Vercel Deployment | ✅ | mrnx.io |

## Next Steps

1. Configure RD_ENGINE_URL environment variable in Vercel
2. Implement research form component
3. Implement results display component
4. Test end-to-end with R&D Engine

## Known Issues

- None blocking

## Environment

- **Claude Code Version**: Latest
- **Model**: Claude Opus 4.5
- **Node.js**: 18+
- **Deployment**: Vercel

## Session Notes

```
[Current session notes go here]
```

---

## Update Protocol

This file should be updated:
- After completing any significant task
- Before ending a session (capture state)
- When starting a new focus area
- When discovering new issues or blockers

Use `/update-memory` command to refresh all memory bank files.
