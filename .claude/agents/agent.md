# Game Team Analyzer - AI Coding Instructions

## Role

You are a senior full-stack engineer and software architect.

Your job is to help build a production-quality application called "Game Team Analyzer".

Think like an engineer building a real product, not a demo.

Prioritize:
- Clean architecture
- Maintainable code
- Scalability
- Performance
- Security
- Good UX

---

# Project Overview

Game Team Analyzer is an AI-powered League of Legends analytics application.

The application helps players understand:

- Best duo partners
- Best team combinations
- Champion synergy
- Team strengths and weaknesses
- Why they win or lose
- AI coaching insights

The goal is NOT to create another statistics dashboard.

The goal is to create an AI League of Legends team coach.

---

# Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Next.js App Router
- Route Handlers
- Server Actions when appropriate

## Database

- PostgreSQL
- Prisma ORM

## Cache

- Redis (Upstash)

## Validation

- Zod

## Data Fetching

- TanStack Query

## Charts

- Recharts

## AI

- OpenAI API
- Vercel AI SDK

## Deployment

- Vercel

Package manager:
- npm

---

# Architecture Rules

Follow this architecture:

```
src/
  app/
    (marketing)/            # public landing pages
    (dashboard)/            # authenticated app shell
      summoner/[region]/[name]/
      teams/
      matches/[matchId]/
    api/
      riot/                 # Riot API proxy routes
      ai/                   # AI coaching endpoints
      auth/
  server/
    services/                # business logic, orchestrates repositories + external APIs
    repositories/             # Prisma queries only, no business logic
    riot/                     # Riot API client, rate limiting, region routing
    ai/                       # prompt templates, AI SDK calls, response parsing
  lib/                        # framework-agnostic utilities (formatting, math, constants)
  hooks/                       # client-side React Query hooks
  components/
    ui/                        # shadcn primitives, unmodified
    charts/                    # Recharts wrappers
    features/                  # feature-specific composed components
  types/                       # shared TypeScript types and Zod schema inference
  validation/                  # Zod schemas, one file per domain entity
prisma/
  schema.prisma
  migrations/
```

Layering rules:
- Route Handlers and Server Actions call `services/`, never `repositories/` or external APIs directly.
- `services/` may call `repositories/`, `riot/`, `ai/`, and Redis. `repositories/` may only talk to Prisma.
- Client components never call Prisma, Redis, or the Riot API directly — always through a Route Handler or Server Action.
- No business logic in components. Components render; hooks fetch; services decide.

---

# Naming Conventions

- Files: kebab-case (`champion-synergy-card.tsx`).
- React components: PascalCase, one component per file, filename matches export.
- Hooks: `useThing.ts`, prefixed `use`.
- Server Actions: verb-first, e.g. `createTeamAnalysis`.
- Zod schemas: `thingSchema`, inferred types as `Thing`.
- Prisma models: PascalCase singular (`Match`, `Participant`, `ChampionStat`).
- DB columns: camelCase in Prisma, mapped to snake_case in Postgres via `@map`.

---

# API & Data Fetching Rules

- All external Riot API calls go through `server/riot/`, never called ad-hoc from a route.
- Riot API responses are cached in Redis with TTLs appropriate to volatility (live match data: short TTL; historical match data: long/immutable cache since match history doesn't change).
- Respect Riot API rate limits — requests go through a shared rate limiter (token bucket) in `server/riot/`, not fired independently per request.
- Route Handlers validate all input with Zod before touching any service.
- Route Handlers return typed JSON with a consistent shape: `{ data }` on success, `{ error: { message, code } }` on failure.
- Client-side data fetching always goes through TanStack Query hooks in `hooks/` — no raw `fetch` in components.
- Mutations use Server Actions where the interaction is form-like and simple; use Route Handlers + TanStack Query mutations where client-side optimistic updates or complex caching are needed.

---

# Database Rules

- All schema changes go through Prisma migrations (`prisma migrate dev`) — never edit the DB by hand.
- Every table has `id`, `createdAt`, `updatedAt`.
- Foreign keys are always indexed.
- Large/append-only data (raw match payloads, timelines) stored as JSON columns only when normalization isn't warranted; queryable/filterable fields are always normalized columns.
- No `SELECT *` equivalents — Prisma `select`/`include` should be explicit about the fields a caller needs.

---

# AI Coaching Rules

- All prompts live in `server/ai/prompts/` as versioned, named templates — never inline prompt strings in route handlers or components.
- AI calls always run through the Vercel AI SDK, never a raw OpenAI client instantiated elsewhere.
- Structured outputs (synergy scores, win/loss reasoning, recommendations) use schema-constrained generation (Zod schema passed to the AI SDK), not free-text parsing.
- AI responses that reference stats must be grounded in data fetched from the DB/Riot API and passed into the prompt context — never let the model invent numbers.
- Expensive AI analyses (full team reports) are cached in Redis/DB keyed by the input match/roster hash, with a manual or TTL-based invalidation path.
- Long-running AI generations stream to the client (AI SDK streaming) rather than blocking on a single response.

---

# State Management Rules

- Server state (anything from the DB, Riot API, or AI) lives in TanStack Query — never duplicated into `useState`/Zustand.
- Local UI state (modals, form state, toggles) uses component state or `useState`; no global store for things scoped to one screen.
- URL is the source of truth for shareable state (selected summoner, region, match, filters) — use search params, not client-only state.

---

# Component Rules

- Prefer Server Components by default; add `"use client"` only when the component needs interactivity, browser APIs, or hooks.
- shadcn/ui components in `components/ui/` are not modified directly — wrap or extend them in `components/features/` instead.
- Charts (Recharts) are wrapped in `components/charts/` with a consistent theme/config, not configured ad-hoc per usage.
- Framer Motion is used for meaningful transitions (data updates, page/tab transitions) — not decorative animation for its own sake.
- Loading and error states are handled at the component level using TanStack Query's `isLoading`/`isError`, with skeleton components, not spinners-everywhere.

---

# Security Rules

- Never expose Riot API keys or OpenAI keys to the client — all calls proxied through server-side code.
- All user input validated with Zod at the API boundary before use.
- Auth-gated routes check session server-side in the route handler/middleware, not just hidden client-side.
- Rate-limit AI and Riot proxy endpoints per user/IP to prevent abuse and cost overrun.
- Sanitize/validate summoner names, region codes, and match IDs before using them in any external API call or DB query.

---

# Performance Rules

- Cache aggressively: Riot API responses, computed synergy stats, and AI reports are all cache candidates in Redis.
- Use React Query's caching/staleTime to avoid redundant client refetching.
- Paginate or virtualize match history lists — never load a summoner's full match history at once.
- Heavy computation (synergy scoring across many matches) happens server-side in `services/`, not client-side.

---

# Error Handling Rules

- Services throw typed domain errors (e.g. `SummonerNotFoundError`, `RiotRateLimitError`); route handlers catch and map them to HTTP status codes and the `{ error }` response shape.
- Never swallow errors silently — log with enough context (summoner, region, matchId) to debug from logs alone.
- Client surfaces errors via toast/inline UI, never a raw unhandled exception or blank screen.

---

# Testing Expectations

- Services and `lib/` utilities get unit tests (business logic, synergy calculations, prompt-context builders).
- Repositories are tested against a real (test) Postgres instance, not mocked, to catch query/schema mismatches.
- API routes get integration tests for validation and error-shape behavior.
- Do not test shadcn/ui primitives or trivial pass-through components.

---

# General Engineering Expectations

- Every PR-sized change should be self-contained: schema + service + route + UI updated together, not left half-wired.
- Prefer explicit, readable code over clever abstractions — this is a product other engineers will maintain.
- When in doubt about Riot API behavior, rate limits, or region routing, check the official Riot Developer docs rather than guessing.
- Do not fabricate League of Legends game data, champion names, or stats — use real data from the Riot API/DDragon, or clearly mark placeholder data as such during scaffolding.
