# Product: mrnx Dashboard

## Why This Project Exists

mrnx provides the user interface for the AI Agents portfolio. It's the primary way users interact with the R&D Engine and other AI agent capabilities.

## Problems Solved

| Problem | Current Pain | Solution |
|---------|--------------|----------|
| **No UI for R&D Engine** | API-only access | Clean dashboard interface |
| **Raw JSON Results** | Hard to read research output | Formatted, styled results |
| **No History** | Can't review past queries | Query history tracking |
| **No Portfolio** | No showcase for projects | Portfolio section |

## Core Components

### Research Interface
- Query input form
- Loading states with progress
- Formatted result display
- Citation links

### Dashboard
- Research history
- Quick actions
- Status indicators

### Portfolio (Optional)
- Project showcase
- Technical details
- Links to repos

## Quality Goals

| Goal | Target |
|------|--------|
| Lighthouse Performance | >90 |
| TypeScript Coverage | 100% strict |
| Accessibility | WCAG 2.1 AA |
| Mobile Responsive | Yes |

## User Experience

1. User visits mrnx.io
2. Enters research query
3. Sees loading progress
4. Receives formatted results with sources
5. Can review history of past queries
