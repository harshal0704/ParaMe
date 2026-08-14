# ParaMe — Comprehensive Full-Stack Overhaul Plan

> **Site:** `parame.harshalsp.com`
> **Repo brand decision:** Standardize on **ParaMe** (matches git-log commit "ParaMe Omnichannel AI Persona…", `wrangler.jsonc` name `parame`, and the user's stated domain). The codebase currently inconsistently uses "Pavtar" everywhere — this plan unifies on "ParaMe".

---

## 1. Current-State Assessment — Problems Found

### 1.1 Brand & Naming Inconsistency
- Git commit #8260de5 says "ParaMe"; README + all source code says "Pavtar"; `wrangler.jsonc` says `"name": "parame"`. No single canonical name.
- `.env.example` references `/dashboard/onboarding` and `/dashboard/takeover/{id}` routes that **do not exist** in the codebase.

### 1.2 UI / Design System Problems
- **No shared component library** — every button, card, badge is duplicated as inline Tailwind utility classes across `page.jsx`, `dashboard/page.jsx`, `PublicTwinClient.jsx`, sign-in/out pages. The `.ks-button-*` and `.plinth-*` CSS classes exist in `globals.css` but are inconsistently applied (some components ignore them and re-declare equivalent styles inline).
- **Magic strings** — hex colors `bg-[#070604]`, `text-[#f5f1e8]`, `border-white/[0.07]` repeated ~100× across JSX instead of using the CSS variables already defined in `:root`.
- **No responsive mobile nav** — homepage nav is `hidden md:flex`; no hamburger/menu on mobile. `sign-in`/`sign-up` pages have no mobile consideration.
- **Broken slider layout** in `InteractiveProof.jsx` — left pane uses fixed `w-[580px] md:w-[680px]` width that overflows on small screens; the dual-layer overlap with `left` positioning causes content bleed.
- **Unused imports** — `page.jsx` imports `Zap`, `Globe`, `Terminal`, `Cpu`, `ShieldCheck` (shield) none used.
- **`grain-overlay` z-index 9999** can obscure floating elements.

### 1.3 User-Flow Problems
- **Homepage → Dashboard**: "Launch Studio Free" CTA → `/sign-up` — but Clerk keys are placeholder, so it redirects to a dead auth screen OR (via the dev-mode bypass) straight to `/dashboard` which renders an entirely static, non-functional page.
- **Dashboard is 100% local state** — `page.jsx` uses `useState` for avatar URL, handle, bio sliders (uncontrolled `<input type="range">` with no `value`/`onChange`), and "Connect Google Photos" / Telegram / WhatsApp buttons that do **nothing**. No save, no load, no API call.
- **Public twin `/u/harshal` chat is mocked** — `PublicTwinClient.submitQuery` uses `setTimeout(() => …, 700)` with hardcoded keyword responses. No LLM, no RAG, no backend call.
- **LiveKit token fetched but WebRTC never connects** — `startVoiceCall` POSTs to `/api/livekit/token` but never creates a `Room`, never subscribes to audio tracks, never wires microphone. The `AvatarStage` Three.js scene runs in isolation — it does not receive viseme data from the agent over a LiveKit data channel.
- **Missing routes**: `/dashboard/onboarding`, `/dashboard/takeover/[sessionId]` — referenced in `.env.example` + `takeover.py` but not implemented.
- **`generateStaticParams` only pre-generates 2 usernames** — no dynamic persona resolution.
- **Env var mismatch**: frontend uses `NEXT_PUBLIC_API_URL` (VoiceRecorder, PublicTwinClient) but `.env.example` defines `API_BASE_URL` and `NEXT_PUBLIC_APP_URL`. `NEXT_PUBLIC_API_URL` is **never set** → API calls silently fail to `localhost:8000`.

### 1.4 Core Functionality Gaps (Agent / Backend)
- **Voice agent (`agent/main.py`) is a skeleton**:
  - `entrypoint` sends one greeting and registers a `participant_connected` handler — no audio subscribe, no STT, no LLM loop, no TTS streaming, no viseme publishing.
  - `extract_viseme_weights_from_audio` is defined but **never called**.
  - `silero.VAD` loaded but **never used**.
  - `groq_client` created but **never used** for Whisper transcription.
  - `synthesize_speech_edge` called once for greeting only.
  - Agent never calls the RAG engine or persists conversation logs.
- **Backend API incompleteness**:
  - No CRUD routes for personas (`/api/personas`), no chat endpoint, no memories endpoint, no Google Photos ingestion.
  - `omnichannel.py` hardcodes `"harshal"` and `"default"` instead of looking up the persona from the DB or webhook payload.
  - Telegram voice handler sets `user_text = "Voice message received."` — **never transcribes** the actual voice note (no Groq Whisper call).
  - CORS is `allow_origins=["*"]` with `allow_credentials=True` (security anti-pattern).
  - No `__init__.py` in `backend/db/`, `backend/routers/`, `backend/services/` — relies on namespace packages (fragile, may fail under uvicorn's import resolution depending on PYTHONPATH).
- **Missing integrations referenced in README but absent from code**: Discord bot, Resend email webhook, Google Photos ingestion service, Notion sync. Schema references `'notion'` as a `source_type` but no ingestion path exists.

### 1.5 Deployment / Config Gaps
- `Caddyfile` only reverse-proxies backend LiveKit API+webhooks; the **Next.js frontend is not served by Caddy** (it's deployed separately via Cloudflare Workers/OpenNext) — this split needs to be made explicit and consistent.
- `wrangler.jsonc` `"name": "parame"` but no `routes` or `domains` configured for `parame.harshalsp.com`.
- `widget.js` hardcodes `https://yourtwin.domain/widget.js` (non-existent domain).
- `dashboard/page.jsx` embed script uses `https://yourtwin.domain/widget.js`.
- `setup_vm.sh` ends at `free -h` — **never runs `docker compose up`** to start services.
- `.env.example` missing `NEXT_PUBLIC_API_URL` and other dev-time variables the frontend expects.

---

## 2. Key Design Decisions

| # | Decision | Resolution |
|---|----------|------------|
| D1 | Brand name | **ParaMe** — unify all "Pavtar" → "ParaMe" across code, README, CSS, favicon alt text, Docker names. |
| D2 | Site domain | `parame.harshalsp.com` — Caddy handles TLS via ACME; Cloudflare Tunnel/WAF fronts everything. |
| D3 | Frontend styling | **Shared `ui/` component library** (Button, Card, Badge, Input, Textarea, Slider, Modal, Dialog, Avatar, Tabs). All colors via CSS variables / Tailwind theme. `clsx` + `tailwind-merge` via `cn()`. |
| D4 | Typography | Albert Sans (body) + Alumni Sans (display headings) + Newsreader (serif accent) — already loaded in `globals.css`; formalize via Tailwind `fontFamily` theme (not globals.css custom properties that aren't hooked into Tailwind). |
| D5 | Environment variables | Add `NEXT_PUBLIC_API_URL` to `.env.example`; alias all frontend API calls through it with sensible fallback. Reconcile `API_BASE_URL` / `NEXT_PUBLIC_APP_URL`. |
| D6 | LiveKit architecture | Voice agent runs as a LiveKit worker (already in docker-compose). Frontend uses `livekit-client` `Room` + `LocalParticipant` + `RemoteParticipant` to connect audio bidirectional. Visemes sent via LiveKit `DataChannel` (`publishData`). Agent publishes `avatar_state` data messages consumed by `AvatarStage`. |
| D7 | Chat architecture | **Text chat** goes through the backend REST endpoint `/api/twin/chat` which calls Gemini with RAG context. **Voice call** goes through LiveKit agent pipeline. Both share the same RAG engine + persona DB lookup. |
| D8 | Persona data flow | Backend exposes `/api/personas/{handle}` → returns `display_name`, `bio`, `system_prompt`, `avatar_glb_url`, `voice_config`, `traits`, `is_public`. Frontend and agent both consume this. Dashboard writes via `/api/personas/{handle} PUT`. |
| D9 | Dashboard state | Persisted to backend `personas` table (via Clerk `user_id`). Local `useState` replaced with `fetch` + React `useEffect` + form submission. |
| D10 | Integrations | Add Discord bot (webhook + async reply), Resend email webhook, Google Photos ingestion service, Notion sync service — each as optional env-gated features. |
| D11 | Testing | No existing test framework. Add Jest + Playwright config + representative tests (no full coverage mandate). |
| D12 | Package manager | `npm` (lockfile exists — `package-lock.json`); keep npm. Add missing deps: `@radix-ui/react-*` (optional), `class-variance-authority`, `@heroicons/react` for additional icons. |

---

## 3. Architecture & Data Flow

```
┌─────────────────┐     ┌──────────────────────────────────────────┐
│  Visitor at      │      │  parame.harshalsp.com (Cloudflare)        │
│  /u/harshal or   │◄───►│  ┌────────────────────────────────────┐   │
│  embeds widget   │      │  │ Caddy (TLS, ACME, reverse proxy)   │   │
│                  │      │  └────────────────────────────────────┘   │
│                  │      │         │            │                   │
│                  │      │         ▼            ▼                   │
│                  │      │  ┌─────────┐  ┌──────────────┐            │
│                  │      │  │ Frontend│  │  Backend     │            │
│                  │      │  │ Next.js │  │  FastAPI     │            │
│                  │      │  │ Workers │  │  (uvicorn)   │            │
│                  │      │  │ .open-next│  │              │            │
│                  │      │  └─────────┘  │  ┌────────┐  │            │
│                  │      │         │    │  │ RAG    │  │            │
│                  │      │         │    │  │ Engine │  │            │
│                  │      │         │    │  └────────┘  │            │
│                  │      │         │    │  ┌────────┐  │            │
│                  │      │         │    │  │ Routers│  │            │
│                  │      │         │    │  └────────┘  │            │
│                  │      │         │    └──────┬───────┘            │
│                  │      │         │           │                    │
│                  │      └─────────┼───────────┼────────────────────┘
│                  │                │           │
│                  │      ┌─────────▼──┐  ┌──────▼────────┐
│                  │      │  LiveKit    │  │ PostgreSQL    │
│                  │      │  SFU (VM)   │  │ + pgvector   │
│                  │      └──────┬────┘  └──────┬────────┘
│                  │             │              │
│                  │      ┌──────▼────────┐     │
│                  │      │ Voice Agent   │     │
│                  │      │ (Docker)      │     │
│                  │      │ STT: Groq     │     │
│                  │      │ LLM: Gemini   │◄────┘
│                  │      │ TTS: Edge-TTS │
│                  │      │ Visemes: →data│
│                  │      │ channel       │
│                  │      └───────────────┘
│                  │
│     Webhooks:     │
│     Telegram,     │
│     WhatsApp,     │
│     Discord,      │
│     Email(Resend) │
└──────────────────┘
```

### Text Chat flow (WebRTC call not needed)
1. Visitor types message on `/u/{username}`.
2. Frontend POSTs to `NEXT_PUBLIC_API_URL/api/twin/chat` with `{ persona_handle, message, channel: "web" }`.
3. Backend resolves persona, searches pgvector RAG, calls Gemini Flash with system prompt + memory context, persists to `conversation_logs`, returns text.
4. Frontend renders response + any memory photo from RAG results.

### Voice Call flow
1. Visitor clicks "Start Voice Call" → frontend requests LiveKit token from `POST /api/livekit/token`.
2. Backend generates JWT scoped to a room, returns `token`, `room_name`, `livekit_url`, `persona_id`, `avatar_glb_url`.
3. Frontend `AvatarStage` creates `LiveKitRoom`, `LocalAudioTrack` from mic, joins room as `visitor_{id}`.
4. Agent worker subscribes to the visitor's audio track, runs Silero VAD → Groq Whisper STT → Gemini LLM (with RAG) → edge_tts TTS (streamed back as `RemoteAudioTrack`).
5. Agent extracts viseme weights from spoken audio, publishes `{ type: "avatar_state", mood, visemes }` over data channel.
6. Frontend receives data channel message → `AvatarStage` applies ARKit morph targets → 3D avatar lip-syncs in real-time.

### VIP Takeover flow
1. Agent/backend detects VIP keyword → sets takeover flag in LiveKit room data + writes to `takeover_sessions` table.
2. Telegram alert sent to admin with button linking to `https://parame.harshalsp.com/dashboard/takeover/{session_id}`.
3. Admin opens takeover page → connects to same LiveKit room as `human_takeover` participant → subscribes to audio → chat box lets human type/reply that gets spoken by TTS.

---

## 4. Phase 1 — Foundation (Design System, Config, API Contracts)

### 4.1 Brand & Config Unification
- **TASK 1.1** — Rename all "Pavtar" → "ParaMe" in: `frontend/package.json` name, `README.md` title/description, `frontend/app/layout.jsx` metadata, all page titles, favicon SVG title, Docker container names, backend `main.py` title. Keep gold color palette.
- **TASK 1.2** — Update `wrangler.jsonc`: set `name: "parame"`, add `routes` array for `*.harshalsp.com`, set `vars` for `API_BASE_URL` / `NEXT_PUBLIC_API_URL`.
- **TASK 1.3** — Update `Caddyfile`: route `/api/*`, `/webhooks/*` to backend; route everything else to the static Next.js export / OpenNext worker (or document that frontend is deployed separately); add `parame.harshalsp.com` site block with ACME TLS. Keep LiveKit routing.
- **TASK 1.4** — Reconcile `.env.example`: add `NEXT_PUBLIC_API_URL=http://localhost:8000`, `NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880`, `NEXT_PUBLIC_APP_URL=https://parame.harshalsp.com`, reconcile `API_BASE_URL`. Document all variables.
- **TASK 1.5** — Create `backend/db/__init__.py`, `backend/routers/__init__.py`, `backend/services/__init__.py`, `backend/db/seed.py` (seed default "harshal" persona). Fix docker `CMD` to set `PYTHONPATH=/app` and `cd /app` so relative imports work.

### 4.2 Design System
- **TASK 1.6** — Create `frontend/lib/utils.ts`: `cn(...inputs)` using `clsx` + `tailwind-merge`.
- **TASK 1.7** — Extend `frontend/tailwind.config.js`: add `fontFamily` for `body`/`display`/`mono`/`serif-accent`, add `animation` keyframes (`marquee`, `pulse-gold`), add `maxWidth: { '8xl': '90rem', '9xl': '100rem' }`, add `transitionTimingFunction` presets.
- **TASK 1.8** — Create `frontend/components/ui/` library:
  - `button.tsx` — variant-based (primary, ghost, destructive, icon)
  - `card.tsx` — plinth-style card wrapper
  - `badge.tsx`
  - `input.tsx`, `textarea.tsx`, `label.tsx`
  - `slider.tsx` (replaces range slider)
  - `tabs.tsx`, `modal.tsx` (sheet/dialog), `avatar.tsx`
  - `separator.tsx`, `scroll-area.tsx` (lightweight)
- **TASK 1.9** — Define theme token map in `globals.css` only — no magic hex in JSX. Create `@layer components` for `.ks-button-*`, `.plinth-card` etc. so they're centralized. Add `.grain-overlay` z-index fix (lower it or move to body-level). Remove unused imports in `page.jsx`.
- **TASK 1.10** — Create `frontend/lib/api.ts` — a thin typed HTTP client that reads `NEXT_PUBLIC_API_URL`, handles JSON, returns `{ data, error }`, and provides typed hooks for persona, chat, livekit-token, voice upload.
- **TASK 1.11** — Add lint/typecheck scripts: `"lint": "next lint && tsc --noEmit"` (but note frontend is JSX, not TSX — decide: **keep `.jsx` for existing files**, new components can be `.tsx` with prop typing). Recommendation: adopt TypeScript for **new** `ui/` components and API layer; leave existing JSX as-is until refactored in Phase 2. Add `tsconfig.json` if not present.

### 4.3 Database Seed Data
- **TASK 1.12** — Add seed SQL in `backend/db/seed.sql`: insert a default `harshal` persona with avatar URL, system prompt, traits, and sample memories (so `/u/harshal` works without Clerk). Add `is_seed` flag.
- **TASK 1.13** — Wire seed into Docker: run `seed.sql` on `db` init container or in backend startup.

**Exit criteria:** `tsc --noEmit` passes (new TS files), `next lint` passes, `npm run dev` starts, backend `uvicorn` boots with seeded DB.

---

## 5. Phase 2 — Core Functionality & User Flow

### 5.1 API Layer (Backend)
- **TASK 2.1** — Create `backend/routers/personas.py`:
  - `GET /api/personas/{handle}` → persona profile DTO
  - `PUT /api/personas/{handle}` → update (auth-gated via Clerk token header)
  - `GET /api/personas?handle=...` lookup
- **TASK 2.2** — Create `backend/routers/chat.py`:
  - `POST /api/twin/chat` → `{ persona_handle, message, channel, session_id }`
  - Resolves persona, runs RAG, calls Gemini 2.0 Flash, persists to `conversation_logs`, returns `{ reply, memories, mood }`.
- **TASK 2.3** — Fix `routers/livekit_token.py` — rename to `/api/livekit/token` (matches middleware public route). Add `persona_handle` lookup in the query path (already does `WHERE handle = :handle`). Keep persona_id for agent metadata.
- **TASK 2.4** — Fix `omnichannel.py` — remove hardcoded "harshal"/"default". Derive persona from webhook payload (e.g., Telegram bot username → persona; WhatsApp phone number → persona mapping table or env). Actually transcribe Telegram voice notes via Groq Whisper. Add proper HMAC verification for WhatsApp webhook.
- **TASK 2.5** — Fix CORS in `main.py` — restrict to `NEXT_PUBLIC_APP_URL` origin in production; allow `localhost:3000` in dev.
- **TASK 2.6** — Add `GET /api/spotify/now-playing` → returns current track via `spotify_tool` (used by frontend ambient bar).
- **TASK 2.7** — Add `GET /api/voice/status` → returns voice calibration status for a persona (sample downloaded, duration).

### 5.2 Public Twin Page (User Flow)
- **TASK 2.8** — Rewrite `PublicTwinClient.jsx` → `PublicTwinClient.tsx`:
  - Fetch persona via `GET /api/personas/{handle}` on mount.
  - Replace mocked `submitQuery` with real `POST /api/twin/chat`. Show streaming or final reply.
  - Display memory photo from RAG response (if present).
  - Wire voice call button to real `livekit-client` Room connection.
  - Fetch Spotify now-playing via `GET /api/spotify/now-playing`.
  - Add "Report issue" / "Human takeover request" button → POST to chat with takeover trigger.
- **TASK 2.9** — Connect `AvatarStage.jsx` → `AvatarStage.tsx` to LiveKit data channel. On `avatar_state` data message, apply viseme weights to morph targets. On audio track received, optionally analyze waveform for live visemes.
- **TASK 2.10** — Make `/u/[username]/page.jsx` dynamic (SSR fetch persona, 404 if not found or not public). Replace `generateStaticParams` with `getStaticPaths` fallback `blocking`.

### 5.3 Dashboard Wizard
- **TASK 2.11** — Create `/dashboard/onboarding/page.tsx` — multi-step wizard:
  1. Persona basics (name, handle, bio)
  2. Avatar (Avaturn iframe + URL picker)
  3. Voice (VoiceRecorder upload)
  4. Memory sources (Google Photos, Notion, manual)
  5. Channel integrations (Telegram, WhatsApp, Discord, Email)
  6. Publish
- **TASK 2.12** — Refactor `dashboard/page.jsx` → `dashboard/page.tsx`:
  - Add Clerk guard (redirect to `/sign-up` if not authed, **unless** dev-mode bypass env is set).
  - Replace local `useState` with fetched persona data + save endpoint.
  - Make voice trait sliders controlled (`value` + `onChange` → API PATCH).
  - Connect "Connect Google Photos" / integrations to real OAuth flow or stub with clear "coming soon" messaging.
  - Add real embed widget URL using `NEXT_PUBLIC_APP_URL`.
- **TASK 2.13** — Create `/dashboard/takeover/[sessionId]/page.tsx`:
  - Reconnect to LiveKit room as human takeover participant.
  - Chat input → TTS via backend (new `/api/tts` endpoint or agent data channel).
  - Show incoming visitor audio waveform.
  - Button to end takeover → resume AI bot.

### 5.4 Voice Agent Pipeline
- **TASK 2.14** — Rewrite `agent/main.py` `entrypoint`:
  - Subscribe to audio track from visitor (`AutoSubscribe.AUDIO_ONLY`).
  - Pipe audio through Silero VAD → buffer speech segments.
  - Send segments to Groq Whisper → transcript.
  - Run transcript through RAG (`search_persona_memories`) + Gemini Flash → reply text.
  - Strip `[MOOD: …]` tag → set avatar mood → edge_tts stream audio back via `RemoteAudioTrack`.
  - Extract viseme weights (`extract_viseme_weights_from_audio`) from the TTS output → publish `{ type: "avatar_state", mood, visemes }` over data channel every ~20ms.
  - Detect VIP triggers → call `check_and_trigger_vip_takeover`.
  - Persist all utterances to `conversation_logs` via backend HTTP callback (agent can't access DB directly) or via LiveKit data messages stored by backend.
- **TASK 2.15** — Add `agent/Dockerfile` healthcheck + env validation. Update docker-compose to pass `PERSONA_HANDLE` env to agent worker.
- **TASK 2.16** — Add `backend/routers/tts.py` — `POST /api/tts` for dashboard/webhook contexts that can't use LiveKit (email summaries, etc.). Reuses edge-tts.

### 5.5 Homepage & Auth Polish
- **TASK 2.17** — Rewrite `app/page.jsx` → `app/page.tsx`: replace inline classes with `ui/` components. Add mobile hamburger nav (`<Sheet>` with menu). Fix InteractiveProof slider layout. Fix `NEXT_PUBLIC_API_URL` usage.
- **TASK 2.18** — Rewrite sign-in/sign-up pages using `ui/` components. Remove fragile `clerkKey.includes('placeholder')` dev bypass — replace with a proper `NEXT_PUBLIC_DEV_MODE_BYPASS` env toggle.
- **TASK 2.19** — Add `app/about/page.tsx`, `app/docs/page.tsx` (link from footer). Add `app/api/config/route.ts` — returns public runtime config (livekit URL, features) to the frontend (avoids env duplication).

**Exit criteria:** Text chat works end-to-end on `/u/harshal`. Voice call connects (audio flows both ways, avatar visemes move). Dashboard loads/saves persona. Onboarding wizard completes. Takeover page renders. All API routes respond. `npm run build` passes, `next lint` + `tsc` clean.

---

## 6. Phase 3 — Integrations

### 6.1 Discord Bot
- **TASK 3.1** — Add `backend/routers/discord.py`:
  - `POST /webhooks/discord` — handles inbound messages + voice note attachments.
  - Transcribe voice notes (Groq Whisper), reply with Gemini-generated text + TTS audio (as Discord voice or file).
  - HMAC signature verification (Discord interaction signature).
- **TASK 3.2** — Add `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY` to `.env.example`.
- **TASK 3.3** — Agent: add Discord presence sync (agent joins Discord voice if needed — optional, phase 3+).

### 6.2 Resend Email
- **TASK 3.4** — Add `backend/routers/email.py`:
  - `POST /webhooks/email` — Resend inbound webhook (catches `email.received` events).
  - Reply via `resend` SDK with Gemini-generated body.
- **TASK 3.5** — Add outbound email capability: `/api/email/send` for VIP takeover notifications (fallback if Telegram bot is down). Uses `resend` package.
- **TASK 3.6** — Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL` to `.env.example`.

### 6.3 Google Photos Ingestion
- **TASK 3.7** — Create `backend/services/photos.py`:
  - OAuth2 flow (Google Photos Library API) → store refresh token per persona.
  - Paginate media items → download → run Gemini 2.0 Flash Vision to generate narrative text + tags (location, date, people).
  - Generate embeddings (`models/text-embedding-004`) → insert into `persona_memories` with `source_type='google_photos'`, `media_url` pointing to R2/Clojure.
- **TASK 3.8** — Add `GET/POST /api/photos/ingest` endpoint (auth-gated, triggers background task). Add `backend/routers/photos.py`.
- **TASK 3.9** — Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` to `.env.example`.

### 6.4 Notion Sync
- **TASK 3.10** — Create `backend/services/notion.py`:
  - Notion OAuth2 → sync selected databases/pages.
  - Chunk page content → embed → store in `persona_memories` with `source_type='notion'`.
- **TASK 3.11** — Add `GET/POST /api/notion/sync` endpoint. Add `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET` to `.env.example`.

### 3.5 Integration Dashboard Controls
- **TASK 3.12** — Dashboard "Memory Vault" tab: connect Google Photos button → redirect to OAuth; show ingest status/progress. Connect Notion button → same.
- **TASK 3.13** — Dashboard "Omnichannel" tab: status badges for Telegram/Discord/WhatsApp/Email (active/configured/disconnected). Reconnect buttons.

**Exit criteria:** Discord + Resend webhooks return 200 and echo/log. Google Photos OAuth flow redirects correctly (no API key → graceful "connect" button). Notion OAuth flow works. Frontend shows integration status badges.

---

## 7. Phase 4 — Polish, Responsiveness, Deployment

### 7.1 Responsive Design Audit
- **TASK 4.1** — Audit all pages at 320px/768px/1024px/1440px breakpoints. Fix overflow, font sizes, column counts. Ensure `max-w-7xl mx-auto` wraps every page section consistently.
- **TASK 4.2** — Add `next/image` for optimized images (avatar, memory photos). Configure `images.domains` / `remotePatterns`.
- **TASK 4.3** — Add smooth CSS scroll-behavior for anchor links (`#proof`, `#avatar-engine`, etc.).

### 7.2 Animations & Microinteractions
- **TASK 4.4** — Add `framer-motion` (or CSS-only where simpler) for: page transitions, tab transitions, button hover states, avatar mood transitions, chat message appear.
- **TASK 4.5** — Live waveform on voice call active state (canvas or CSS bars driven by audio data).
- **TASK 4.6** — Theme toggle (light/dark) with persisted preference — even though default is dark gold-luxury, some users want light mode. Low priority.

### 7.3 Deployment — `parame.harshalsp.com`
- **TASK 4.7** — `docker-compose.yml` production profile: add `restart: always`, `env_file`, named volumes. Add `frontend` service (or confirm it's deployed via `npm run deploy` to Cloudflare Workers).
- **TASK 4.8** — `setup_vm.sh`: append `docker compose up -d --build` at the end. Add pull-latest. Add health check wait.
- **TASK 4.9** — Update `docker-compose.yml` build context env vars to include API_URL pointing to Caddy.
- **TASK 4.10** — Cloudflare Tunnel config: `cloudflared` ingress routes `parame.harshalsp.com → Caddy:80`.

### 7.4 Logging, Monitoring, Error Boundaries
- **TASK 4.11** — Frontend: add React error boundaries around AvatarStage / InteractiveProof (Three.js crashes shouldn't kill the page).
- **TASK 4.12** — Backend: structured `logging` via `structlog` or `loguru`. Add `/metrics` endpoint (Prometheus format).
- **TASK 4.13** — Agent: log STT/LLM/TTS latency per utterance.

### 7.5 Tests
- **TASK 4.14** — `jest.config.js` + `@testing-library/react` + `@testing-library/jest-dom`. Test: Button renders, cn() merges classes, VoiceRecorder stops recording, Persona API client parses response.
- **TASK 4.15** — `playwright.config.ts`. Test: homepage loads, nav links scroll, `/u/harshal` page renders twin, `/dashboard` redirects or renders.
- **TASK 4.16** — Backend: `ruff`/`pytest` config. Test: livekit token generation, chat endpoint with mocked Gemini, RAG search returns empty gracefully.

**Exit criteria:** Lighthouse 85+ on mobile/desktop. No console errors in production build. `npm run test` and `npm run test:e2e` pass. `docker compose up --build` works end-to-end.

---

## 8. Rollback & Validation

- **Validation steps:**
  1. `cd frontend && npm run lint && npx tsc --noEmit`
  2. `cd frontend && npm run build` (Next.js production build)
  3. `cd backend && python -m pytest` (or `ruff check .`)
  4. `npx playwright test`
  5. `docker compose up --build -d && curl localhost:8000/health`
  6. Manual: visit `http://localhost:3000`, `/u/harshal`, `/dashboard`, `/sign-up`.

- **Rollback:** All changes are additive file creation / edits to source. `git checkout` individual files. DB migrations via `schema.sql` only (no destructive ALTER — new columns use `IF NOT EXISTS`).

- **Risks:**
  - R1: LiveKit WebRTC in a serverless Cloudflare Workers context is non-trivial — the voice agent runs in Docker on the VM, frontend connects client-side directly to LiveKit. Document this split clearly.
  - R2: Three.js GLTF loading + LiveKit data channel must be tested in a room with actual participants — local dev needs a running LiveKit server (docker-compose includes it).
  - R3: Google Photos / Notion OAuth in dev requires `localhost` redirect URIs — use `http://localhost:3000/api/auth/callback/...` patterns.
  - R4: `next/image` on Cloudflare Workers may need custom loader — test before relying.

- **Out of scope (deferred):**
  - Mobile app (React Native) — mentioned nowhere in code, only a "portfolio widget."
  - Real Fish.Audio voice cloning API — the agent uses Edge-TTS only; Fish.Audio is referenced in schema but not implemented. (Phase 5 candidate.)
  - Full Discord voice channel bridge — Phase 3 handles text/voice-note only.

---

## 9. Task List Summary (Ordered)

| Phase | Task | File(s) / Area |
|-------|------|----------------|
| **1** | 1.1  Brand unify → "ParaMe" | all source files |
| **1** | 1.2  wrangler.jsonc routes | frontend/wrangler.jsonc |
| **1** | 1.3  Caddyfile TLS + frontend route | config/Caddyfile |
| **1** | 1.4  .env.example reconciliation | .env.example |
| **1** | 1.5  `__init__.py` + seed data | backend/db/, setup_vm.sh |
| **1** | 1.6  `lib/utils.ts` (cn) | frontend/lib/utils.ts |
| **1** | 1.7  Tailwind theme extensions | frontend/tailwind.config.js |
| **1** | 1.8  `components/ui/` library | frontend/components/ui/* |
| **1** | 1.9  globals.css token cleanup | frontend/app/globals.css |
| **1** | 1.10 lib/api.ts typed client | frontend/lib/api.ts |
| **1** | 1.11 tsconfig + lint scripts | frontend/ |
| **1** | 1.12 seed.sql + db init | backend/db/seed.sql |
| **2** | 2.1  personas router CRUD | backend/routers/personas.py |
| **2** | 2.2  chat router | backend/routers/chat.py |
| **2** | 2.3  fix livekit_token route | backend/routers/livekit_token.py |
| **2** | 2.4  fix omnichannel hardcode + transcribe | backend/routers/omnichannel.py |
| **2** | 2.5  CORS fix | backend/main.py |
| **2** | 2.6  spotify now-playing endpoint | backend/routers/spotify_status.py |
| **2** | 2.7  voice status endpoint | backend/routers/voice_upload.py |
| **2** | 2.8  PublicTwinClient rewrite (ts, real API) | frontend/app/u/[[...]] |
| **2** | 2.9  AvatarStage data channel | frontend/components/AvatarStage.tsx |
| **2** | 2.10 dynamic /u/[username] | frontend/app/u/[username]/page.tsx |
| **2** | 2.11 onboarding wizard | frontend/app/dashboard/onboarding/page.tsx |
| **2** | 2.12 dashboard refactor | frontend/app/dashboard/page.tsx |
| **2** | 2.13 takeover page | frontend/app/dashboard/takeover/[id]/page.tsx |
| **2** | 2.14 agent pipeline rewrite | agent/main.py |
| **2** | 2.15 agent Dockerfile | agent/Dockerfile |
| **2** | 2.16 tts router | backend/routers/tts.py |
| **2** | 2.17 homepage rewrite | frontend/app/page.tsx |
| **2** | 2.18 sign-in/up polish | frontend/app/sign-*/.../page.tsx |
| **2** | 2.19 public config route + about/docs | frontend/app/ |
| **3** | 3.1  Discord webhook router | backend/routers/discord.py |
| **3** | 3.2  Discord env | .env.example |
| **3** | 3.4  Email webhook router | backend/routers/email.py |
| **3** | 3.5  SMTP/fallback via Resend | backend/services/email.py |
| **3** | 3.6  Resend env | .env.example |
| **3** | 3.7  photos.py service | backend/services/photos.py |
| **3** | 3.8  photos routes | backend/routers/photos.py |
| **3** | 3.9  Google OAuth env | .env.example |
| **3** | 3.10 Notion service | backend/services/notion.py |
| **3** | 3.11 Notion routes | backend/routers/notion.py |
| **3** | 3.12-3.13 Dashboard integration UI | frontend/app/dashboard/ |
| **4** | 4.1  responsive audit | all pages |
| **4** | 4.2  next/image opt | frontend/app/ |
| **4** | 4.3  scroll-behavior | frontend/app/globals.css |
| **4** | 4.4  framer-motion | package.json + components |
| **4** | 4.5  live waveform | AvatarStage |
| **4** | 4.7  docker-compose prod | docker-compose.yml |
| **4** | 4.8  setup_vm.sh finalize | scripts/setup_vm.sh |
| **4** | 4.11 error boundaries | frontend/components/ |
| **4** | 4.12 backend logging+Prometheus | backend/ |
| **4** | 4.14 jest unit tests | frontend/ |
| **4** | 4.15 playwright e2e | frontend/ |
| **4** | 4.16 ruff/pytest | backend/ |

---

## 10. Open Questions for Implementer

1. **Q:** Does the team have a live Google/Gemini API key, Groq API key, and Clerk production keys to test end-to-end? (Plan assumes free-tier keys exist or are stubbed gracefully.)
2. **Q:** Is the Oracle VM / Cloudflare Tunnel already provisioned for `parame.harshalsp.com`, or does infra need to be stood up from scratch?
3. **Q:** Should Fish.Audio cloning API (schema references it, never implemented) be included, or is Edge-TTS sufficient for the MVP?
