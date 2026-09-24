# Airbnb listing clone — Playpower Labs take-home

A high-fidelity, desktop-only clone of the listing page at
**https://airbnb-clone-umber-two.vercel.app**, including the **Photo tour** and **Lightbox** overlays.

**Live:** https://airbnb-listing-blond.vercel.app · **Repo:** https://github.com/amanjaiswal-07/Airbnb_Listing

**Stack:** React 19 + Vite, plain CSS (co-located per component), no UI or animation libraries.

## Submission at a glance

| Brief item | Where |
|---|---|
| Listing page, Photo tour, Lightbox | [`src/`](src) · live at the link above |
| Visual fidelity & behavioural parity | [How fidelity was achieved](#how-fidelity-was-achieved) · measurements in [`docs/REFERENCE_NOTES.md`](docs/REFERENCE_NOTES.md) |
| Animations, transitions, accessibility | [Photo tour](#photo-tour-modalphoto_tour_scrollable), [Lightbox](#lightbox-modalitem1000--index), [Accessibility](#accessibility) |
| Production architecture diagram | [`docs/architecture/`](docs/architecture/ARCHITECTURE.md) — PNG, SVG and editable **Excalidraw** file |
| Modern AI workflow (agents, sub-agents, skills, prompts) | [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) |
| Sub-agent / skill configs (code quality, project structure) | [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md), [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`.claude/settings.json`](.claude/settings.json) |

![Architecture diagram](docs/architecture/architecture.png)

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run lint      # oxlint
```

Best viewed at ≥ 1280px wide (the reference is desktop-only; the layout holds down to 1100px).

## What's implemented

### Listing page
Header with search pill · title with Share/Save (toasts, saved state) · 5-photo hero grid · summary,
guest-favourite card, host row, highlights, translated description · "Where you'll sleep" · amenities ·
two-month availability calendar (range selection, blocked nights, keyboard navigation, live price) ·
sticky booking card (promo, dates, guest picker capped at 3 guests, reserve) · sticky section nav with
scroll-spy · reviews (rating breakdown, topic chips, 6 reviews) · illustrated map with zoom · host card
with co-hosts · things to know · "More stays nearby" carousel · dialogs for every "Show more / Show all /
Learn more".

### Photo tour (`?modal=PHOTO_TOUR_SCROLLABLE`)
Opens from **Show all photos** (top) or any **hero photo** (jumps to that photo's room). Room thumbnails
smooth-scroll to their section; section titles are sticky; photos use the reference's full/pair rhythm;
hover zooms 1.04× with an 8% overlay. Opens instantly and closes with the reference's 300ms fade + 35px
drop. Back button, Esc, and browser Back all close it.

### Lightbox (`&modalItem=<1000 + index>`)
White full-screen viewer with caption and "N of 43". ←/→ keys and buttons navigate; arrows disable at
the ends (no wrap, like the reference); neighbours are preloaded so swaps are instant. Esc or the grid
button returns to the tour on the photo you were viewing.

### Accessibility
Every overlay is a labelled `role="dialog"` with `aria-modal`, a focus trap, scroll lock, Esc to close,
an `inert` background, and focus returned to the element that opened it (the reference drops focus to
`<body>`; this is a deliberate improvement). Icon-only controls are labelled, the counter is announced,
calendar days are real buttons with arrow-key navigation, and there's a skip link.

## How fidelity was achieved

The reference blocks automated browsers and replaces `getComputedStyle`, so nothing was copied from it.
Instead:

1. **Observed** it in a real Chrome session and recorded content, behaviour and motion
   (`document.getAnimations()` for durations, easings and keyframes) → [`docs/REFERENCE_NOTES.md`](docs/REFERENCE_NOTES.md).
2. **Measured** layout with `getBoundingClientRect` and a shared probe script ([`scripts/probe.js`](scripts/probe.js)),
   run on both pages at 1536×730. Section borders were located from `offsetHeight − clientHeight`.
3. **Derived type sizes** from each text node's content-area height (≈ 1.3 × font-size for the reference
   font) and checked widths with canvas `measureText`.
4. **Iterated** until every probe anchor is within ~2px of the reference (see
   [`docs/reference/probe-reference.txt`](docs/reference/probe-reference.txt)), then compared screenshots
   section by section at the same scroll positions.

**Font:** the reference uses Airbnb Cereal (proprietary). The clone uses **DM Sans** (free), which lands
within ±3% of Cereal's text widths at the measured sizes; weights are mapped (Cereal 500 → 600,
600 → 650) to match stroke weight. The rupee sign falls back to the system font because DM Sans lacks it.

**Assets:** the 43 listing photos and small UI images were exported from the reference in a normal browser
session (the site rate-limits scripted requests) and renamed by room — see [`scripts/assets.mjs`](scripts/assets.mjs).
Icons and the logo mark are original SVGs.

## Project structure

```
src/
  App.jsx                 overlay + booking state, URL/history sync
  data/listing.js         all content (photos, rooms, reviews, host, stays)
  lib/                    dates, guests, photo-row layout (pure functions)
  hooks/                  useFocusTrap, useScrollLock
  components/             one component + CSS per section/overlay
docs/
  REFERENCE_NOTES.md      measured geometry and behaviour of the reference
  architecture/           production architecture diagram + write-up
scripts/
  probe.js                layout probe used for comparisons
  assets.mjs              asset import (browser snippet → public/images)
```

## AI-assisted workflow

Built with Claude Code as the primary agent, driving the user's Chrome (Claude in Chrome) for reference
inspection and the built-in browser for the clone. The full story — phases, prompts, guardrails and
measurement techniques — is in [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md). The repeatable parts are captured
as configuration:

| File | Purpose |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md) | Project rules, commands, conventions, definition of done |
| [`.claude/agents/ui-fidelity-reviewer.md`](.claude/agents/ui-fidelity-reviewer.md) | Read-only visual/motion parity review against the reference |
| [`.claude/agents/a11y-auditor.md`](.claude/agents/a11y-auditor.md) | Keyboard, focus and ARIA audit of page + overlays |
| [`.claude/agents/code-quality-reviewer.md`](.claude/agents/code-quality-reviewer.md) | Diff review for structure, React/CSS conventions, lint/build |
| [`.claude/agents/section-builder.md`](.claude/agents/section-builder.md) | Builds one section from measurements, then hands off for review |
| [`.claude/skills/reference-probe`](.claude/skills/reference-probe/SKILL.md) | How to measure and diff layout without touching reference source |
| [`.claude/skills/add-listing-section`](.claude/skills/add-listing-section/SKILL.md) | Recipe for adding a section the project way |
| [`.claude/settings.json`](.claude/settings.json) | Allowed npm scripts + a post-edit lint hook |

## Deployment

It's a static SPA — any static host works. On Vercel: import the repo, framework preset **Vite**,
build `npm run build`, output `dist`. No rewrites are needed (overlay state lives in the query string).

## Known differences from the reference

- Typeface is DM Sans rather than Airbnb Cereal, so glyph shapes differ slightly.
- Icons are original drawings in the same style, not the reference's icon set.
- Deep links open overlays directly (the reference ignores them on load), and focus handling is stricter.
- Map is an illustration with working zoom buttons, as on the reference; it is not a tile map.
