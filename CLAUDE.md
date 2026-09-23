# Airbnb listing clone — agent instructions

High-fidelity clone of https://airbnb-clone-umber-two.vercel.app (the **reference**). The reference is the
single source of truth for layout, type, colour, motion and behaviour. Desktop only (≥ 1100px).

## Commands

```bash
npm run dev      # Vite dev server on :5173
npm run lint     # oxlint — must be clean
npm run build    # production build — must pass
```

## Project map

```
src/
  App.jsx               view state (tour / lightbox / dialogs), URL sync, booking state
  data/listing.js       ALL content: photos, sections, reviews, host, stays (no copy in components)
  lib/                  pure helpers (dates, guests, photoLayout) — no React
  hooks/                useFocusTrap, useScrollLock
  components/X.jsx      one component per section/overlay, with co-located X.css
  index.css             design tokens (:root), resets, shared primitives (.container, .section, .text-link…)
docs/REFERENCE_NOTES.md measured reference geometry + behaviour (read before changing layout)
scripts/probe.js        layout probe: run in both pages at 1536×730 and diff
scripts/assets.mjs      one-off asset import from the reference (browser snippet → import)
```

## Rules

- **Measure, don't guess.** Every size/spacing change must trace back to `docs/REFERENCE_NOTES.md` or a new
  probe run. Record new measurements there.
- **Never copy reference source.** It blocks automation and stubs `getComputedStyle`; do not work around
  either. Use rendered geometry (`getBoundingClientRect`), `document.getAnimations()`, screenshots, and text.
- Font is **DM Sans** standing in for Airbnb Cereal. Cereal 500 → DM Sans 600, Cereal 600 → 650.
  Derive sizes from the reference's text content-area height (≈ 1.3 × font-size).
- Content column: `.container` (1120px, centred). Section rhythm: `.section` = 1px `--border-light` top
  border; left-column sections pad 32px, full-width sections pad 48px.
- Styling: plain CSS, BEM-ish class names prefixed by the component (`.booking-card__label`). Tokens from
  `:root` only — no new hex values without adding a token. Inline `style` only for runtime values.
- Components are presentational; state lives in `App.jsx` unless it is purely local UI state (open/closed,
  carousel page, zoom).
- Overlays (`PhotoTour`, `Lightbox`, `Modal`) must: portal to `body`, set `role="dialog"` + `aria-modal`,
  trap focus (`useFocusTrap`), lock scroll (`useScrollLock`), close on Esc, and return focus to the trigger.
  The page behind gets `inert`.
- URL contract (matches the reference): `?modal=PHOTO_TOUR_SCROLLABLE` for the tour,
  `&modalItem=<1000 + index>` for the lightbox. Back/forward must open/close overlays.
- Motion (from the reference): tour opens instantly and closes with 300ms `cubic-bezier(0.2,0,0,1)`
  fade + 35px drop; tour photo hover = `scale(1.04)` 400ms + 8% black overlay 200ms; lightbox image swaps
  instantly; prev/next disable at the ends (no wrap).
- When editing files that the dev server watches, write atomically (Edit tool) — a truncated write can be
  cached as an empty stylesheet until the server restarts.

## Definition of done for a UI change

1. `npm run lint` and `npm run build` pass.
2. Probe diff vs `docs/reference/probe-reference.txt` is within ±2px for affected anchors.
3. Keyboard path works (Tab order, Esc, arrows where relevant) and focus returns to the trigger.
4. No console errors.

Sub-agents in `.claude/agents/` and skills in `.claude/skills/` encode these checks — use them.
