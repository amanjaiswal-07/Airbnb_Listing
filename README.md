# Airbnb listing clone — Playpower Labs take-home

A high-fidelity, desktop-only clone of the listing page at
**https://airbnb-clone-umber-two.vercel.app** (the *reference*), including the **Photo tour** and
**Lightbox** overlays, plus a production-scale architecture diagram and the AI agent configuration used
to build it.

| | |
|---|---|
| **Live clone** | https://airbnb-listing-blond.vercel.app |
| **Repository** | https://github.com/amanjaiswal-07/Airbnb_Listing |
| **Reference** | https://airbnb-clone-umber-two.vercel.app |
| **Stack** | React 19 · Vite 8 · plain CSS (co-located per component) · oxlint — no UI, state or animation libraries |
| **Target** | Desktop, ≥ 1100px wide (best at 1280px+), same as the reference |

---

## Contents

1. [Submission at a glance](#submission-at-a-glance)
2. [Quick reviewer tour (2 minutes)](#quick-reviewer-tour-2-minutes)
3. [Run it locally](#run-it-locally)
4. [What's implemented](#whats-implemented) — listing page, photo tour, lightbox
5. [Animations and transitions](#animations-and-transitions)
6. [Accessibility](#accessibility)
7. [How fidelity was achieved](#how-fidelity-was-achieved)
8. [Architecture diagram](#architecture-diagram)
9. [AI workflow, sub-agents and skills](#ai-workflow-sub-agents-and-skills)
10. [Code structure and conventions](#code-structure-and-conventions)
11. [Deployment](#deployment)
12. [Known differences from the reference](#known-differences-from-the-reference)

---

## Submission at a glance

| Brief item | Where |
|---|---|
| Listing page, Photo tour, Lightbox | [`src/`](src) · live at the link above |
| Visual fidelity and behavioural parity | [How fidelity was achieved](#how-fidelity-was-achieved) · raw measurements in [`docs/REFERENCE_NOTES.md`](docs/REFERENCE_NOTES.md) |
| Animations, transitions, accessibility | [Animations](#animations-and-transitions) · [Accessibility](#accessibility) |
| Production architecture diagram | [`docs/architecture/`](docs/architecture/ARCHITECTURE.md): PNG, SVG and editable **Excalidraw** file, generated from code |
| Modern AI workflow (agents, sub-agents, skills, prompts) | [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) |
| Sub-agent and skill configs (code quality, project structure) | [`CLAUDE.md`](CLAUDE.md), [`AGENTS.md`](AGENTS.md), [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`.claude/settings.json`](.claude/settings.json) |

---

## Quick reviewer tour (2 minutes)

Open the [live clone](https://airbnb-listing-blond.vercel.app) next to the
[reference](https://airbnb-clone-umber-two.vercel.app) at the same window size, then:

1. **Scroll the page.** When the hero photos leave the viewport, the sticky section nav appears
   (Photos · Amenities · Reviews · Location). Once the booking card scrolls out, the nav shows the price and
   a Reserve button.
2. **Click "Show all photos".** The photo tour opens instantly and the URL becomes
   `?modal=PHOTO_TOUR_SCROLLABLE`. Click a room thumbnail to smooth-scroll to that room, and hover a photo
   to see the zoom and overlay.
3. **Click any photo in the tour.** The lightbox opens and `&modalItem=1000+index` is added to the URL.
   Use **← / →**: the arrows disable at the first and last photo, with no wrap-around.
4. **Press Esc.** You return to the tour, scrolled to the photo you were viewing. Press **Esc** again: the tour
   fades and drops away, and focus returns to "Show all photos".
5. **Use browser Back and Forward** during steps 2–4. The overlays open and close with history.
6. **Pick dates** in the calendar with the mouse or the keyboard (Tab to a day, then arrows, Enter). Nights,
   the price breakdown and the booking card update together. Blocked nights (18–24, 29 and 30 Nov) cannot be
   chosen.
7. **Open any "Show more / Show all / Learn more" dialog**, for example "Show all 50 amenities". Each one
   traps focus, closes on Esc or backdrop click, and returns focus to its button.

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on :5173 |
| `npm run build` | Production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | oxlint over the project (kept at zero warnings) |
| `node docs/architecture/build-diagram.mjs` | Regenerate the architecture SVG and Excalidraw files from their spec |

Requires Node 20+.

---

## What's implemented

### 1. Listing page

| Area | Details |
|---|---|
| **Header** | Logo, "Become a host", globe and account menu. A search pill with Anywhere / Any week / Add guests and a search button. |
| **Title bar** | Listing title. **Share** shows a toast. **Save** toggles a saved heart state with a toast. |
| **Hero gallery** | Five-photo grid: one large photo and four small ones, with rounded outer corners and a hover darken. Every photo opens the tour at its room, and **Show all photos** opens it at the top. |
| **Overview** | Summary line (guests · bedrooms · beds · baths); the guest-favourite card with laurels, rating, stars and review count; a host row; three highlights; the translated description with **Show more** → dialog. |
| **Where you'll sleep** | Bedroom cards with photos. |
| **Amenities** | Ten amenities with icons; **Show all 50 amenities** → a grouped dialog with an icon per amenity (unavailable ones struck through). |
| **Calendar** | Two months side by side with prev/next paging. Range selection with a check-in/checkout state machine, blocked nights (a stay can't span an unavailable night), **Clear dates**, and full keyboard navigation (see [Accessibility](#accessibility)). |
| **Booking card** | Sticky. Price per night, promo line, date fields that jump to the calendar, a guest picker (adults / children / infants / pets, capped at 3 guests like the reference), and a live price breakdown. The main button reads **Check availability** or **Reserve**. |
| **Sticky section nav** | Appears once the hero leaves the viewport. Links scroll to sections, and the price and Reserve button appear after the booking card scrolls out. |
| **Reviews** | Rating header, overall rating distribution, category scores, topic chips (horizontal scroller), six reviews with **Show more** and **Show all 19 reviews** dialogs, and a "How reviews work" dialog. |
| **Location** | Illustrated map with a home marker and working zoom buttons, the neighbourhood blurb and a **Show more** dialog. |
| **Meet your host** | Host card (reviews, rating, years hosting), host facts, co-hosts, host details and a Message host button. |
| **Things to know** | House rules, safety and cancellation columns, each with a **Learn more** dialog. |
| **More stays nearby** | Carousel of eight stays with page arrows that disable at the ends. |

All copy, prices, dates and names come from the reference and live in
[`src/data/listing.js`](src/data/listing.js); components contain no hard-coded content. The 43 listing photos
and small UI images are real assets exported from the reference; they are not placeholders.

### 2. Photo tour (`?modal=PHOTO_TOUR_SCROLLABLE`)

- Full-screen white overlay with a back button, Share and Save, and a strip of room thumbnails
  (Living room, Full kitchen, Bedroom 1…, Exterior, Pool, Gym, Additional photos).
- Clicking a thumbnail smooth-scrolls to that room. Room titles stick while their photos scroll.
- Photos follow the reference's **full / pair** row rhythm, computed in
  [`src/lib/photoLayout.js`](src/lib/photoLayout.js).
- Opening from a hero photo scrolls straight to that photo's room.
- Closes with the back button, **Esc** or browser Back.

### 3. Lightbox (`&modalItem=<1000 + index>`)

- Full-screen viewer with a **Close** control and an "N / 43" counter; the counter is announced to screen readers.
- **← / →** keys and on-screen buttons navigate. The buttons disable at the ends; there is **no wrap-around**,
  which matches the reference.
- Neighbouring images are preloaded, so swaps are instant, as on the reference.
- **Esc** returns to the tour, scrolled to and focused on the photo you were viewing.
- Every step is a history entry, so Back and Forward move between page, tour and lightbox.
- A deep link (for example `/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1010`) opens straight into the lightbox.

---

## Animations and transitions

All timings were captured from the reference with `document.getAnimations()` during the interaction, not
estimated by eye.

| Interaction | Motion |
|---|---|
| Photo tour open | Instant (no transition), as on the reference |
| Photo tour close | 300ms `cubic-bezier(0.2, 0, 0, 1)`: opacity 1 → 0 and `translateY(0 → 35px)` |
| Tour photo hover | Image `scale(1.04)` over 400ms, plus an 8% black overlay fading in over 200ms |
| Hero photo hover | Darkening overlay |
| Lightbox navigation | Instant image swap, with neighbours preloaded |
| Dialogs (amenities, reviews…) | Open instantly; close with a 200ms opacity fade and a 250ms `translateY(25px)` drop |
| Tour room thumbnails | Smooth scroll to the room section |
| Share / Save | Toast fades in and rises 12px, then auto-dismisses |
| Sticky nav | Appears when the hero bottom crosses the 67px nav height |

With `prefers-reduced-motion: reduce`, every animation and transition becomes effectively instant.

---

## Accessibility

The reference's behaviour was kept wherever it was accessible. Where it wasn't, the clone goes further on
purpose; for example, the reference drops focus to `<body>` when an overlay closes.

- **Every overlay** (photo tour, lightbox, all dialogs):
  - portals to `<body>`
  - has `role="dialog"`, `aria-modal="true"` and an accessible name
  - traps focus ([`useFocusTrap`](src/hooks/useFocusTrap.js)) and locks scroll ([`useScrollLock`](src/hooks/useScrollLock.js))
  - makes the page behind `inert`
  - closes on **Esc**
- **Focus return:** closing an overlay returns focus to the control that opened it. Leaving the lightbox focuses
  the photo you were viewing inside the tour.
- **Calendar:**
  - Days are real `<button>`s with a roving tab stop.
  - **Arrow keys** move by day or week and page across months.
  - Unavailable days use `aria-disabled`, so keyboard users can move through them but cannot select them.
  - Labels read the full date plus "unavailable", "check-in date" or "checkout date".
- **Controls:** icon-only buttons have `aria-label`s, toggles use `aria-pressed` (Save, selected days), and the
  guest steppers announce their counts.
- **Structure:** a skip link, a logical heading order, `alt` text on every listing photo, and decorative images marked `alt=""`.
- **Focus styles:** visible `:focus-visible` rings on all interactive elements.

---

## How fidelity was achieved

The reference blocks automated browsers and replaces `window.getComputedStyle`. **Nothing was copied from
its source, and neither protection was bypassed.** All measurements came from what a normal browser renders:

1. **Observe:** the page was inspected in a real Chrome session via Claude in Chrome. Content, behaviour, URLs
   and motion were recorded in [`docs/REFERENCE_NOTES.md`](docs/REFERENCE_NOTES.md), and the visible text is in
   [`docs/reference/page-content.md`](docs/reference/page-content.md).
2. **Measure layout:** a shared probe ([`scripts/probe.js`](scripts/probe.js)) records `getBoundingClientRect`
   for ~90 text anchors on both pages at 1536×730. Section dividers were found with
   `offsetHeight − clientHeight`, which doesn't read styles.
3. **Derive type:** each font size came from the text's content-area height (≈ 1.3 × font-size for the
   reference font), and widths were checked with canvas `measureText`.
4. **Iterate:** changes continued until every anchor was within **±2px** of the reference (baseline:
   [`docs/reference/probe-reference.txt`](docs/reference/probe-reference.txt)). Screenshots were then compared
   section by section at the same scroll positions.
5. **Motion:** `document.getAnimations()` was sampled mid-interaction to read the animated property,
   duration, easing and keyframes.

**Font:** the reference uses Airbnb Cereal, which is proprietary. The clone uses **DM Sans** (free), which lands
within ±3% of Cereal's text widths at the measured sizes. Weights are mapped to match stroke weight
(Cereal 500 → 600, 600 → 650). DM Sans has no rupee sign, so a `unicode-range` `@font-face` falls back to a
system font for ₹ only.

**Assets:** the listing photos and small UI images (laurels, review-chip thumbnails, search-pill icon) were
exported in a normal browser session through a rate-limit-friendly snippet
([`scripts/assets.mjs`](scripts/assets.mjs)) and renamed by room. Icons and the logo mark are original SVGs
drawn in the same line style.

---

## Architecture diagram

![Production architecture](docs/architecture/architecture.png)

The diagram describes how an Airbnb-scale product built around this page would run in production. The full
write-up is in [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md).

| File | Use |
|---|---|
| [`architecture.excalidraw`](docs/architecture/architecture.excalidraw) | **Editable.** Open it at [excalidraw.com](https://excalidraw.com) via Menu → Open, or drag the file onto the canvas |
| [`architecture.png`](docs/architecture/architecture.png) / [`.svg`](docs/architecture/architecture.svg) | Rendered versions |
| [`build-diagram.mjs`](docs/architecture/build-diagram.mjs) | Diagram-as-code: one spec generates both the SVG and the Excalidraw file, so they never drift |

**How to read it:** requests flow left → right, and dashed orange arrows are asynchronous events.

1. **Clients** (web, iOS/Android, host tools) go through the **edge**: a global CDN + WAF serving ISR HTML and
   static assets, an image CDN for resized AVIF/WebP, and edge functions for locale and A/B bucketing.
2. The **API gateway / BFF** shapes responses per client, applies rate limits and idempotency keys,
   authenticates via **Identity (OIDC)**, and fans out to stateless **domain services**: Listing, Search &
   ranking, Availability, Pricing, Booking, Payments, Reviews, Messaging.
3. **Booking is a saga:** it places a *hold* in Availability, takes payment through Payments, then confirms, with
   compensations on failure. A Postgres exclusion constraint makes double-booking impossible.
4. **Each service owns its data** (the "Owner:" line on every data box): Postgres for listings and bookings,
   Redis, OpenSearch, object storage and a wide-column store. There is no shared database.
5. Services publish domain events through a transactional **outbox / CDC** to **Kafka**. Consumers index
   OpenSearch, **purge edge caches and revalidate ISR pages**, send notifications and feed **analytics / ML**.
6. The bottom band gives the **scaling strategy** for each area the brief asks for: frontend, backend,
   storage, search and deployment. The dashed note shows where this take-home sits: the web client's
   listing page, whose URL-addressable overlay state (`?modal=…&modalItem=…`) is already cache- and
   SSR-friendly.

---

## AI workflow, sub-agents and skills

The project was built with **Claude Code** as the primary agent. It drove the user's Chrome (Claude in Chrome)
to inspect the reference and the built-in browser to test the clone. The full account is in
[`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md): phases, the actual prompts, guardrails, measurement techniques,
and what the agent was not allowed to do.

The repeatable parts of that loop (**build → probe → review → fix**) are saved as configuration, so the next
change follows the same checks whether a person or an agent makes it:

| File | Type | Purpose |
|---|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Project memory | Commands, project map, CSS and React conventions, the overlay/a11y contract, URL contract, motion values, definition of done |
| [`AGENTS.md`](AGENTS.md) | Cross-tool rules | Points Codex, Cursor and other agents at the same rules |
| [`.claude/agents/section-builder.md`](.claude/agents/section-builder.md) | Sub-agent (writer) | Builds or rebuilds one section from measured geometry, then hands off for review |
| [`.claude/agents/ui-fidelity-reviewer.md`](.claude/agents/ui-fidelity-reviewer.md) | Sub-agent (read-only) | Layout, type, colour and motion parity report against the reference; never edits |
| [`.claude/agents/a11y-auditor.md`](.claude/agents/a11y-auditor.md) | Sub-agent (read-only) | Keyboard, focus, ARIA and history audit of the page and overlays |
| [`.claude/agents/code-quality-reviewer.md`](.claude/agents/code-quality-reviewer.md) | Sub-agent | Lint and build, plus structure and React/CSS conventions on the diff |
| [`.claude/skills/reference-probe`](.claude/skills/reference-probe/SKILL.md) | Skill | How to measure and diff layout without touching the reference's source |
| [`.claude/skills/add-listing-section`](.claude/skills/add-listing-section/SKILL.md) | Skill | Step-by-step recipe for adding a section the project way |
| [`.claude/settings.json`](.claude/settings.json) | Harness config | Pre-approved npm scripts, plus a PostToolUse hook that lints `src/` after every edit |
| [`.claude/launch.json`](.claude/launch.json) | Harness config | Dev-server definition used by the agents' browser preview |

Each sub-agent gets only the tools it needs. For example, the reviewers can't write files, and the builder
can't touch the reference browser. Example use:

```text
Use the section-builder agent to add the "Show all 19 reviews" dialog, then run
ui-fidelity-reviewer and a11y-auditor on it and fix anything they report.
```

---

## Code structure and conventions

```
src/
  App.jsx                 overlay + booking state, URL/history sync, focus-return refs
  main.jsx                entry
  index.css               design tokens (:root), resets, shared primitives (.container, .section, …)
  data/listing.js         ALL content: photos, rooms, amenities, reviews, host, stays
  lib/                    pure helpers, no React
    dates.js              date keys, ranges, nights, formatting
    guests.js             guest-count rules and labels
    photoLayout.js        full/pair row rhythm for the tour
  hooks/
    useFocusTrap.js       Tab-cycling within a container, initial focus
    useScrollLock.js      body scroll lock with scrollbar compensation
  components/             one component + co-located CSS per section or overlay
    Header, TitleBar, HeroGallery, StickyNav, Overview, Calendar, BookingPanel,
    Reviews, Location, HostSection, ThingsToKnow, MoreStays,
    PhotoTour, Lightbox, Modal, ListingDialogs, Toast, Icon, Logo
public/images/            photos/, ui/, chips/, avatars/, similar/ (real assets from the reference)
docs/
  REFERENCE_NOTES.md      measured geometry + behaviour of the reference
  AI_WORKFLOW.md          how AI was used, prompts, guardrails
  reference/              visible-text transcript + probe baseline
  architecture/           diagram (PNG/SVG/Excalidraw), its generator, write-up
scripts/
  probe.js                layout probe, run on both pages and diffed
  assets.mjs              asset export snippet + import script
```

**Conventions** (enforced by `CLAUDE.md` and the reviewer sub-agents):

- **State:** state lives in `App.jsx`, and components are presentational. Purely local UI state (open/closed,
  carousel page, zoom) stays local.
- **CSS:** plain CSS with BEM-ish class names prefixed by the component (`.booking-card__label`). Colours and
  spacing come from `:root` tokens only. Inline `style` is used only for runtime values.
- **URL is the source of truth for overlays:** `pushState` on open and `popstate` drives open/close, so deep
  links, Back and Forward all work.
- **Definition of done:** lint and build are clean, the probe is within ±2px on affected anchors, the keyboard
  path works, focus returns to the trigger, and there are no console errors.

---

## Deployment

It's a static SPA, so any static host works. It is deployed on **Vercel**: import the repo, choose framework
preset **Vite**, build command `npm run build`, output directory `dist`. No rewrites are needed because
overlay state lives in the query string, not the path. Every push to `main` redeploys.

---

## Known differences from the reference

- **Typeface:** DM Sans instead of Airbnb Cereal (proprietary), so individual glyph shapes differ slightly.
  Sizes, weights and line positions are matched.
- **Icons:** original line drawings in the same style, not the reference's icon set.
- **Deep links:** the clone opens overlays directly from a URL; the reference ignores them on first load.
- **Focus handling:** stricter than the reference (focus return and `inert` background), as described above.
- **Map:** an illustration with working zoom buttons, as on the reference; it is not a live tile map.
- **Actions without a backend** (Reserve, Message host, search): these show the same UI states as the
  reference but don't submit anywhere.
