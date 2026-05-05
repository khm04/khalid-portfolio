# Khalid — Videographer Portfolio

Cinematic videography portfolio. Built with Vite + React + TypeScript + Tailwind v4.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project structure

```
src/
├── components/
│   ├── sections/      # Hero, About, Frames, Videography, Services, Testimonials, Contact
│   ├── ui/            # Reusable primitives
│   ├── Navbar.tsx
│   └── Footer.tsx
├── hooks/             # useInView, etc.
├── lib/               # Helpers (cn, etc.)
├── pages/             # Home (and later: Admin)
├── App.tsx            # Router
├── main.tsx           # Entry
└── index.css          # Tailwind + design tokens
```

## Phases

- **Phase 1** ✅ Public site
- **Phase 2** (in progress) — Supabase auth, DB, storage, contact form persistence
- **Phase 3** — Admin dashboard (analytics + frames/videos/certs manager + messages)

## Phase 2 — Supabase setup

1. Create a Supabase project at https://supabase.com (Frankfurt region recommended)
2. Copy `.env.example` → `.env.local` and fill in:
   - `VITE_SUPABASE_URL` — Project Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` — Project Settings → API → anon public key
   - `VITE_ADMIN_EMAIL` — the email you'll sign in with as admin
3. In Supabase dashboard → **SQL Editor → New query** → paste `supabase/schema.sql` → **Run**
4. Restart the dev server (`npm run dev`) so it picks up env changes
5. Submit the contact form → check **Table Editor → messages** in Supabase to verify the row appeared

## Design system

"Golden Hour Cinematic" — deep warm charcoal backgrounds, warm gold accents, dusty rose, cream text. Cormorant Garamond (display) + DM Sans (body). See `src/index.css`.
