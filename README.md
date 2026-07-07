# Game Team Analyzer

AI-powered League of Legends team coach — synergy scoring, duo/team recommendations, and win/loss reasoning grounded in real match data.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Prisma/PostgreSQL · Upstash Redis · Zod · TanStack Query · Recharts · Vercel AI SDK (OpenAI)

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, RIOT_API_KEY, UPSTASH_*, OPENAI_API_KEY
npm run prisma:migrate
npm run dev
```

## Architecture

```
src/
  app/(marketing)        public landing pages
  app/(dashboard)         authenticated app shell: summoner, teams, matches
  app/api                 route handlers: riot proxy, ai coaching, auth
  server/services         business logic, orchestrates repositories + external APIs
  server/repositories      Prisma queries only
  server/riot              Riot API client, rate limiter, region routing
  server/ai                 prompt templates, AI SDK calls
  lib                       framework-agnostic utilities
  hooks                     TanStack Query hooks
  components/ui             shadcn primitives
  components/charts         Recharts wrappers
  components/features       feature-specific composed components
  validation                Zod schemas
  types                     shared TypeScript types
prisma/schema.prisma
```

Route Handlers/Server Actions → `services/` → `repositories/` + `riot/` + `ai/` + Redis. Client components never touch Prisma/Redis/Riot directly.

## Scripts

- `npm run dev` / `build` / `start`
- `npm run lint`
- `npm run prisma:generate` / `prisma:migrate` / `prisma:studio`

## Status

Scaffolded per the architecture in `.claude/agents/agent.md`: schema, layered services, cached Riot proxy, AI-SDK-backed team synergy analysis, and the marketing/dashboard shell are in place. Riot/OpenAI/Upstash credentials still need to be provisioned before live data flows.
