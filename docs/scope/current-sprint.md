# Current Sprint Scope

**Date:** April 21, 2026
**Goal:** Demo-ready shell portal + chatbot for AVPN proposal

---

## What we're building NOW

1. **Shell learner portal** — basic replica of current AVPN course catalogue ✅ Done
   - Home page with hero, stats, featured courses
   - Course catalogue with filters (country, format, level, phase)
   - Individual course detail pages (72 courses)
   - All data as JSON, all images downloaded locally

2. **AI Chatbot** — embedded in the portal ⏳ Blocked on Karthik
   - Must use Google Vertex AI / Agent Builder
   - Knows all 72 courses (fed from our JSON)
   - Can recommend courses based on user context
   - Can answer general AI literacy questions
   - Karthik exploring which Vertex agent type to use

3. **One extra demo feature** (optional) — TBD
   - Karthik said "if there's anything that catches your eye which we can also demonstrate"
   - Candidates: conversational intake, language detection, course comparison

---

## What we're NOT building now

- Admin portal
- LTP coordinator portal
- User auth / accounts
- Registration flow (just link to external forms)
- Certificate verification
- Any CRUD operations
- Full redesign of the portal UX

---

## Tech stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js + Tailwind | React ecosystem, SSG for speed, easy to embed chat widget |
| Data | Static JSON | 72 courses, no DB needed for demo |
| Chatbot | Google Vertex AI Agent Builder | Google.org requirement — Karthik selecting agent |
| Hosting | TBD | Likely Vercel for shell, GCP for agent |

---

## Blockers

| Blocker | Owner | Needed for |
|---------|-------|-----------|
| Vertex AI agent type selection | Karthik | Chatbot integration |
| Shared repo creation | Karthik | Collaboration |
| GCP project access | Karthik | Agent deployment |

---

## Next sync

After Karthik finishes Vertex AI exploration — later today or tomorrow.
