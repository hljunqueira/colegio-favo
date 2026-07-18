# PRD — Centro Educacional Favo de Mel

## Problem Statement
Institutional website (PT-BR) for "Centro Educacional Favo de Mel", a kindergarten in
Balneário Arroio do Silva – SC, Brazil. Award-worthy animated marketing site + lead
capture + simple admin panel. Phone (48) 99627-5127, Google 4,4 / 47 reviews.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui, framer-motion + Lenis smooth scroll.
- Backend: FastAPI (routes under /api) + MongoDB (motor).
- Auth: JWT email/password (Bearer token in localStorage 'favo_token'), admin seeded on startup.

## User Personas
- Parents (public): browse, evaluate trust signals, submit visit/enrollment request.
- Admin/Secretaria: log in, view & triage leads (status workflow).

## Implemented (2026-07-18)
- Kinetic hero (masked line reveal, parallax image, Google rating badge).
- Editorial marquee, numbered manifesto chapters (01/02/03), Turmas bento grid,
  gallery with hover reveal, dark contact section with form + Google map + footer.
- Public POST /api/leads (lead capture) with success toast.
- Admin: /api/auth/login, /auth/me, /api/admin/leads (GET), PATCH status.
- Admin UI: /admin (login), /admin/dashboard (list + status Select, logout, route guard).
- Design system "The Golden Hive": amber/honey/moss/cream, Cabinet Grotesk + Cormorant + Manrope.
- Verified: testing_agent iteration_1 → backend 14/14, frontend 100% of flows.

## Backlog
- P1: Email notification to school on new lead (Resend), lead detail/notes.
- P1: WhatsApp deep-link CTA; brute-force lockout on login; PATCH 404 + status enum validation.
- P2: CMS-style gallery upload, About/História page, blog/avisos, pagination on leads.
- P2: Migrate startup events to FastAPI lifespan; optimistic-update rollback in dashboard.
