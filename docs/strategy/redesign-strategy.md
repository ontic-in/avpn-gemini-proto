# AVPN Learning Portal — Redesign Strategy

> **Status:** Proposal-level thinking. NOT current sprint scope.
> This document captures product strategy for the full 100K+ platform build (the May proposal).
> Current sprint scope is in `docs/scope/current-sprint.md`.

---

## Analysis of Current Portal

### What it is today

A **flat catalogue** — essentially a WordPress listing page with 72 course cards, 4 filter dropdowns, and links to external registration forms. The user experience is:

```
Land → Browse cards → Click one → Read metadata → Click external registration link → Leave
```

### Core problems

**1. False choice architecture**
All 72 courses teach the same 5-module curriculum (AI basics → productivity tools → prompt engineering → responsible AI → staying ahead). The difference is *who delivers it* and *where*. But the UI presents them as if they're different learning products. A learner in Jakarta doesn't need to compare 8 Indonesian courses — they need the one that fits *them*.

**2. Zero user context**
The portal doesn't know anything about the visitor. A fishery worker in Vietnam, a university student in India, and a TVET instructor in Malaysia all see the same 72-card grid. The filters help narrow down, but put the cognitive burden on the user.

**3. Catalogue ≠ Learning**
The portal is a directory, not a learning experience. Once someone registers, they leave the platform entirely (to Google Forms, Korika.id, Microsoft Forms, etc.). AVPN has no relationship with the learner after that click.

**4. Discovery requires expertise**
To use the filters well, you already need to know what you're looking for (country, format, skill level). But the people this is designed for — workers at risk of AI displacement — often don't know what they need.

---

## Radical Redesign: From Catalogue to Concierge

### Core concept: "Match, don't browse"

Instead of showing 72 options and hoping users self-select, the portal should behave like a knowledgeable advisor who asks 3-4 questions and delivers a tailored recommendation.

---

### Proposed IA (3 layers)

```
Layer 1: WHO ARE YOU?        (context capture — 30 seconds)
Layer 2: HERE'S YOUR PATH    (personalized recommendation)
Layer 3: LEARN + TRACK       (progress, not just registration)
```

---

### Layer 1: Conversational Intake (replaces filters)

Instead of dropdowns, the first screen is a single open question powered by Gemini:

> **"Tell us about yourself — what do you do, and where are you based?"**

Or structured quick-select cards for low-literacy users:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Farmer     │  │  Teacher    │  │  Student    │
└─────────────┘  └─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Small Biz   │  │  Worker     │  │  Not sure   │
└─────────────┘  └─────────────┘  └─────────────┘
```

Then one follow-up: **"What do you hope AI can help you with?"**

This gives the system: role + location + intent. That's enough to recommend.

---

### Layer 2: Personalized Recommendation (replaces the 72-card grid)

After intake, show **1-2 best-fit courses** — not 72. The key shift: **explain WHY this course**, don't just list features.

- "Recommended for you" with reasoning
- "WHY THIS FITS YOU" section per course
- Chatbot available for "why not the other ones?" follow-ups
- Full catalogue accessible as power-user escape hatch

---

### Layer 3: The Chatbot as Primary Navigation

The chatbot isn't a support widget in the corner — it IS the interface for discovery:

| Use case | Example |
|----------|---------|
| **Discovery** | "I'm a nurse in Ho Chi Minh. Is there anything for healthcare?" |
| **Comparison** | "What's the difference between AI-SHIFT Phase 1 and Phase 2?" |
| **Eligibility** | "I don't have a university degree, can I still join?" |
| **Logistics** | "Is there anything in-person near Pune?" |
| **Motivation** | "I'm scared AI will take my job" → empathetic response + relevant course |
| **Post-registration** | "I signed up last week, what should I prepare?" |

---

### Design Provocations

**A. Kill the course detail page**
Replace with short, opinionated summary + "what you'll be able to do after" (outcomes, not inputs).

**B. Social proof by segment**
"4,200 teachers in Indonesia have completed this" > generic testimonial carousel.

**C. Language-first routing**
First interaction should detect or ask for language, then route to a localized experience.

**D. WhatsApp as a channel**
Chatbot could live on WhatsApp (Gemini API → WhatsApp Business), meeting users where they are.

**E. Progressive disclosure of the catalogue**
Full 72-course grid = "power user" mode. Default path = context → recommendation → action.

---

### Design Principles

| Principle | Current | Redesigned |
|-----------|---------|-----------|
| Entry point | Filter dropdowns | "Who are you?" conversation |
| Navigation | Browse 72 cards | Get 1-2 recommendations |
| Decision aid | Read metadata yourself | AI explains why this fits |
| Language | English-only UI | Multilingual from first touch |
| Chatbot role | Support widget (corner) | Primary interface |
| Post-click | External form, goodbye | Track progress, stay connected |
| IA model | Catalogue (flat) | Concierge (guided) |

---

## User Personas

**Context:** The portal is for anyone across Asia looking to learn about AI and develop AI skills. We're making reasonable assumptions based on the course data, target audiences, and regional context.

---

### Persona 1: Priya — The Anxious Worker

| | |
|---|---|
| **Who** | 28, customer support agent at a mid-size company in Bangalore |
| **Tech literacy** | Uses smartphone daily, comfortable with WhatsApp/Instagram, never opened a terminal |
| **Motivation** | Her manager mentioned AI might "restructure" the team. She wants to prove she can adapt. |
| **Context** | Found the portal via a LinkedIn post shared by a colleague. Browsing on her phone during lunch. |
| **Core need** | "Tell me clearly: is this for me, will it help me keep my job, and how long will it take?" |
| **Barriers** | Overwhelmed by jargon ("prompt engineering"?), doesn't know what skill level she is, doesn't want to pick the wrong course |
| **Success** | Enrolled in a course within 5 minutes. Feels like she's doing something concrete about her anxiety. |

**Design implication:** She won't use filters. She needs reassurance + a fast path. The chatbot's tone matters as much as its accuracy.

---

### Persona 2: Pak Adi — The MSME Owner

| | |
|---|---|
| **Who** | 45, runs a small garment export business in Surabaya, Indonesia |
| **Tech literacy** | WhatsApp power user, uses Tokopedia/Shopee, basic laptop skills |
| **Motivation** | Heard AI can help with product photos, customer replies, and inventory. Wants practical, applicable skills — not theory. |
| **Context** | Saw an Instagram ad or was told by a local business association. Prefers Bahasa Indonesia. |
| **Core need** | "Don't teach me what AI is. Show me what it can do for my business THIS WEEK." |
| **Barriers** | English-heavy content, "Beginner" label feels patronizing, long course descriptions bore him |
| **Success** | Finds a course in his language, near his city, that promises practical tools. Registers in under 3 minutes. |

**Design implication:** Language selection must happen immediately. Outcome-first messaging ("use AI to write customer replies") beats curriculum descriptions ("Module 2: Generative AI fundamentals").

---

### Persona 3: Ms. Thanh — The Educator

| | |
|---|---|
| **Who** | 38, high school teacher in Da Nang, Vietnam |
| **Tech literacy** | Uses Google Classroom, YouTube for lesson planning. Moderate digital skills. |
| **Motivation** | Wants to integrate AI into teaching. Also wants a certificate to show her school administration she's upskilling. |
| **Context** | Referred by the Ministry of Education or a colleague who completed Phase 1. Arrives knowing roughly what she wants. |
| **Core need** | "Is there something specifically for teachers? Will I get a certificate? Can I do it evenings/weekends?" |
| **Barriers** | Concerned about time commitment alongside teaching load. Needs Vietnamese language. Wants credibility (who's behind this?). |
| **Success** | Finds the educator-track course, sees it's backed by Google.org, confirms flexible schedule, registers. |

**Design implication:** She's closer to the "sent here with intent" user. Needs fast filtering by role (educator), clear credential/certificate info, and schedule transparency. A "for educators" landing variant would convert her fastest.

---

### Persona 4: Ravi — The University Student

| | |
|---|---|
| **Who** | 21, final-year engineering student in Pune, India |
| **Tech literacy** | High — uses GitHub, knows basic Python, has tried ChatGPT |
| **Motivation** | Wants to add AI skills to resume before job hunting. Looking for something structured and recognized. |
| **Context** | Found via college placement cell, Google search, or peer recommendation. Browses on laptop. |
| **Core need** | "Is this rigorous enough to put on my resume? Or is it too basic for me?" |
| **Barriers** | "Beginner" courses feel beneath him. Wants to know depth before committing. Module-level detail matters. |
| **Success** | Quickly assesses skill level, sees it's legitimately backed, finds hybrid/instructor-led format, registers. |

**Design implication:** He WILL use filters and read module descriptions. He's the one user the current catalogue works for. But even he benefits from a "skill assessment" entry point that tells him where he fits. Consider showing module depth/complexity clearly.

---

### Persona 5: Fatima — The Job Seeker

| | |
|---|---|
| **Who** | 24, recently laid off from a garment factory in Dhaka, Bangladesh |
| **Tech literacy** | Low — has a smartphone, uses Facebook and Imo, limited English |
| **Motivation** | Told by a community NGO that learning AI skills can help her find new work. Skeptical but willing. |
| **Context** | An LTP coordinator showed her the site on their phone or shared via WhatsApp group. |
| **Core need** | "Is this free? Is it in my language? Will it actually get me a job?" |
| **Barriers** | Low confidence ("AI is for engineers"), language, data costs, doesn't know what to click |
| **Success** | Someone (chatbot or coordinator) walks her through. She understands it's free, accessible, and leads somewhere. |

**Design implication:** This is the hardest user to serve via a web portal. She may need the WhatsApp channel, or the portal needs an ultra-simple mode — big buttons, local language, no jargon, and immediate reassurance (free, no prerequisites, certificate at end).

---

### Persona Priority Matrix

| Persona | Volume (assumed) | Ease to serve | Strategic value | Priority |
|---------|-----------------|---------------|-----------------|----------|
| Priya (Anxious Worker) | High | Medium | High — this is the core audience | **P1** |
| Pak Adi (MSME Owner) | Medium | Medium | High — economic impact story | **P1** |
| Ms. Thanh (Educator) | Medium | Easy | Medium — multiplier effect | **P2** |
| Ravi (Student) | High | Easy | Medium — already served by current design | **P2** |
| Fatima (Job Seeker) | High | Hard | Very High — mission-critical for Google.org | **P1 for chatbot** |

---

### Design Takeaway

The portal needs to serve **two modes simultaneously**:

1. **Guided mode (default)** — For Priya, Pak Adi, and Fatima. Chat-first, context-aware, recommends 1-2 courses with clear "why this fits you" reasoning. Minimal UI, maximum reassurance.

2. **Browse mode (escape hatch)** — For Ravi and Ms. Thanh. Filter-rich catalogue, module-level detail, comparison features. Power user territory.

The chatbot bridges both: it's the primary interface for guided mode, and a helper in browse mode ("compare these two courses for me").
