# AVPN AI Learning Hub — Gemini Prototype

A conversational AI learning platform for [AVPN](https://avpn.asia/) that helps workers across Asia-Pacific discover and enroll in free AI training programs. Users describe their role, location, and goals, and a Gemini-powered assistant matches them with relevant courses.

Built as a prototype for the AVPN initiative supported by Google.org and the Asian Development Bank.

## Features

- **AI chat assistant** — conversational course discovery powered by Gemini (currently mock responses)
- **Course catalog** — browse 72+ free AI training programs across 15+ countries
- **Country-based filtering** — find programs available in your region
- **Course detail pages** — per-course pages with descriptions, format, skill level, and more
- **About page** — initiative overview and partner information
- **Responsive design** — mobile-first layout with AVPN brand styling

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx          # Home — hero + chat interface
    about/            # About the initiative
    courses/          # Course catalog + [slug] detail pages
    api/courses/      # Course data API route
  components/         # Header, Footer, CourseCard, CourseFilters
  data/courses.json   # Course dataset
  lib/                # Course helpers, mock chat logic
  types/              # TypeScript interfaces
brand/                # AVPN logos and theme tokens
public/images/        # Course hero images, logos
docs/                 # Strategy docs, sprint scope
```

## Status

Early prototype — chat responses are mocked. Gemini API integration is the next milestone.
