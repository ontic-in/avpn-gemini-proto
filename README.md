# AVPN AI Learning Hub — Gemini Prototype

A conversational AI learning platform for [AVPN](https://avpn.asia/) that helps workers across Asia-Pacific discover and enroll in free AI training programs. Users describe their role, location, and goals, and a Gemini-powered assistant matches them with relevant courses.

Built as a prototype for the AVPN initiative supported by Google.org and the Asian Development Bank.

## Features

- **AI chat assistant** — conversational course discovery powered by Claude Sonnet 4.5
- **Course catalog** — browse 72+ free AI training programs across 15+ countries
- **Country-based filtering** — find programs available in your region
- **Course detail pages** — per-course pages with descriptions, format, skill level, and more
- **About page** — initiative overview and partner information
- **PIN gate** — simple shared-PIN access control (HMAC-signed cookie)
- **Responsive design** — mobile-first layout with AVPN brand styling

## Tech Stack

- **Next.js 16** with App Router (Node runtime)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Gemini 2.5 Flash** via the `@google/generative-ai` SDK

## Getting Started

```bash
cp .env.example .env.local       # then fill GEMINI_API_KEY, SITE_PIN, PIN_COOKIE_SECRET
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx          # Home — hero + chat interface
    unlock/           # PIN entry form (plain HTML, server-rendered)
    about/            # About the initiative
    courses/          # Course catalog + [slug] detail pages
    api/
      chat/           # POST /api/chat → Gemini call, grounded in the catalogue
      courses/        # GET /api/courses → returns the course JSON
      unlock/         # POST /api/unlock → verifies PIN, sets signed cookie
  lib/
    avpn-context.ts   # System prompt + catalogue fed to Gemini
    courses.ts        # Reads src/data/courses.json
    match-courses.ts  # Extracts mentioned course titles from the model output
  proxy.ts            # Next.js 16 proxy (formerly middleware) — the PIN gate
  data/courses.json   # Course dataset
  types/              # TypeScript interfaces
brand/                # AVPN logos and theme tokens
public/images/        # Course hero images, logos
docs/                 # Strategy docs, sprint scope
```

---

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Var | Purpose |
|-----|---------|
| `GEMINI_API_KEY` | Key from [Google AI Studio](https://aistudio.google.com/apikey). Free tier covers the demo. |
| `SITE_PIN` | PIN shared with demo attendees (any string). |
| `PIN_COOKIE_SECRET` | 32-byte HMAC secret. Generate once: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_NAME` | Optional — text shown on the `/unlock` page. |

---

## Deploy to Vercel

1. **Get a Gemini API key** from https://aistudio.google.com/apikey. Free tier is plenty for a demo.
2. **Push this repo to GitHub.** Confirm `.env.local` and `gemini_agent_export.py` are ignored (they are — see `.gitignore`).
3. **Import the repo on Vercel.** Vercel auto-detects Next.js.
4. **Set environment variables** in Vercel → Project → Settings → Environment Variables (Production):
   - `GEMINI_API_KEY`
   - `SITE_PIN`
   - `PIN_COOKIE_SECRET` (same value you used locally, or generate a new one)
   - `NEXT_PUBLIC_SITE_NAME` (optional)
5. **Deploy.** Default `*.vercel.app` URL works for the demo; custom domain optional.

---

## Architecture

```
Browser
  └─▶ Next.js on Vercel
        ├─ src/proxy.ts          PIN-gate all routes except /unlock (Next.js 16 proxy, formerly middleware)
        ├─ /unlock               PIN entry form (plain HTML form POST → sets signed cookie)
        └─ /api/chat             → Gemini API (gemini-2.5-flash)
                                   System prompt includes the full AVPN course catalogue,
                                   so every response is grounded in the 72 catalogued programs.
```

### Why this shape (and not Vertex AI Agent Engine)

For the proposal demo, we skip the Vertex AI Agent Engine + Search retrieval layer. The catalogue (72 courses, ~20 KB of text) fits easily inside the model's context window, so the model is grounded on the full dataset at every turn — no retrieval needed. This keeps the demo infra tiny: no GCP project, no service account, no Agent Engine to keep warm.

For **production**, swap `/api/chat` to call a Vertex AI Agent Engine endpoint with a Vertex AI Search data store doing retrieval. The UI contract stays the same; only the route handler changes. That's the phase-2 story in the proposal.
