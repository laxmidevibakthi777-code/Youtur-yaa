---
name: YOUTUR backend integration
description: How the YouTube Data API v3 and OpenRouter are wired into the YOUTUR project.
---

## Architecture
- API server: Express on port 8080, artifact path `/api` (artifact.toml: `paths = ["/api"]`)
- Frontend: Vite on port 24407, artifact path `/`
- Replit's path-based router forwards all `/api/*` browser requests to port 8080 — **no Vite proxy config needed**
- Frontend calls `/api/...` directly (no hostname, no port)

## Key files
- `artifacts/api-server/src/lib/youtube.ts` — YouTube Data API v3 helpers (search, channel, videos); uses TTLCache
- `artifacts/api-server/src/lib/openrouter.ts` — OpenRouter helpers; model: `openai/gpt-4o-mini`; auto-retry once on failure
- `artifacts/api-server/src/lib/cache.ts` — Simple TTL Map cache (1-hour default)
- `artifacts/api-server/src/middlewares/rateLimiter.ts` — Per-IP 60 req/min
- `artifacts/api-server/src/routes/youtube.ts` — GET /api/youtube/search, GET /api/youtube/channel/:id
- `artifacts/api-server/src/routes/ai.ts` — POST /api/ai/analyze, POST /api/ai/studio, POST /api/ai/studio/all
- `artifacts/youtur/src/lib/api.ts` — Typed frontend API client + fmtNumber, parseDuration, tracked-channels localStorage helpers

## Why
- API keys (YOUTUBE_API_KEY, OPENROUTER_API_KEY) must stay server-side only; never exposed to frontend
- Cache prevents redundant YouTube quota usage; analysis cache is per channelId 1 hour

## Tracked channels
- ChannelSummary objects persisted to localStorage key `youtur_tracked_channels` (max 20)
- Added when user clicks "Analyze Channel" or navigates to /channel/:id
- Shown on My Channels (/channel-selection) page; removable per-item
