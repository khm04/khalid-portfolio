# CLAUDE.md — Khalid Portfolio

## Confidence Rule
**Do not make any changes until you have 95% confidence in what is needed.**
If unclear, ask follow-up questions until you reach that confidence. Never guess.

## Common Commands
```bash
npm run dev        # start dev server at localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

## Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/vite, config is in index.css @theme block)
- Routing: wouter (`<Switch>` / `<Route>`)
- Backend: Supabase (auth + DB). Client is in `src/lib/supabase.ts`
- Toasts: sonner `<Toaster>` in App.tsx
- Icons: lucide-react

## Path Aliases
`@/` maps to `src/` — always use this, never relative `../../` imports.

## Code Style
- Functional components only, no class components
- Named exports for pages, default exports acceptable for sections
- No comments unless the WHY is non-obvious
- No unnecessary abstractions — keep it simple and direct
- TypeScript: avoid `any`; use types from `src/lib/database.types.ts`

## Design System — "Golden Hour Cinematic"
- **Fonts**: `var(--font-display)` (Cormorant Garamond) for headings, `var(--font-body)` (DM Sans) for body
- **Colors** (use CSS vars or oklch values from @theme):
  - Background: `var(--color-bg)` / `oklch(0.14 0.018 55)`
  - Gold accent: `var(--color-gold)` / `oklch(0.72 0.12 65)`
  - Foreground: `var(--color-fg)` / `oklch(0.92 0.02 75)`
- Use `oklch()` color values consistently — no hex or hsl
- Spacing: `max-w-7xl mx-auto px-6 lg:px-10` for section containers
- Animations: use existing CSS classes (`animate-fade-up`, `animate-ken-burns`, etc.)

## State Management
- No global state library — use React `useState` / `useEffect` locally
- Server state: fetch directly from Supabase in components or custom hooks
- Auth state: via `src/lib/useAuth.ts`

## Error Handling
- Show errors via `toast.error(message)` from sonner — never `alert()`
- Supabase calls: always destructure `{ data, error }` and check `error` before using `data`
- Missing env vars throw at startup (see supabase.ts) — do not silence them

## Admin / Gating
- All `/admin/*` routes are wrapped in `<AdminGuard>` — do not bypass it
- Admin identity is checked against `ADMIN_EMAIL` in `src/lib/supabase.ts`
- RLS on Supabase enforces permissions — the anon key is safe to expose

## Debugging
- Check browser console first; Supabase errors surface there
- For auth issues, inspect `supabase.auth.getSession()` in the console
- Dev server: `localhost:5173`

## Pull Request Template
```
## What
[one sentence]

## Why
[motivation or ticket]

## Test
- [ ] Tested in dev server
- [ ] No console errors
- [ ] Mobile checked
```