# R&D Engine Frontend

Next.js frontend for the Autonomous R&D Engine with Vercel AI SDK integration.

## Getting Started

### Prerequisites
- Node.js 18+
- Restate server running (backend)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure `RESTATE_INGRESS_URL` to point to your Restate server.

## Architecture

```
frontend/
├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts    # API route → Restate backend
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Main research interface
├── hooks/
│   └── useResearch.ts      # Research state management
└── package.json
```

## API Endpoints

### POST /api/research
Execute a research query via the Restate backend.

**Request:**
```json
{
  "query": "Your research question",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "request_id": "research-xxx",
  "output": {
    "executive_summary": "...",
    "themes": [...],
    "contradictions": [...],
    "verification": {...}
  },
  "duration_seconds": 120,
  "tokens_used": 50000
}
```

## Deployment

### Vercel

```bash
npx vercel
```

Set `RESTATE_INGRESS_URL` in Vercel environment variables.

### Docker

```bash
docker build -t rd-engine-frontend .
docker run -p 3000:3000 \
  -e RESTATE_INGRESS_URL=http://restate:8080 \
  rd-engine-frontend
```