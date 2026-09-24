# AI workflow

How this clone was built with AI assistance, and how that process is captured as reusable configuration.

## Tools

| Tool | Role |
|---|---|
| **Claude Code** (desktop, Claude Opus) | Primary coding agent: planning, implementation, measurement scripts, verification, git |
| **Claude in Chrome** | Inspecting the reference in a real browser session (the reference blocks automated browsers) |
| **Built-in browser preview** | Running the clone at 1536×730 for probes, keyboard tests and console checks |
| **Headless Edge** | Rendering the architecture diagram to PNG |

## Phases and prompts

The work followed the phased brief I gave the agent (condensed):

> *"You are a senior frontend engineer and UI replication specialist… The reference website is the source of
> truth… Do not copy or directly extract the reference website's codebase… Work incrementally: inspect the
> reference, implement the listing page, photo tour, lightbox, then compare, fix, and prepare deployment.
> Do not fabricate reference details. Do not claim pixel-perfect without comparing."*

| Phase | What the agent did | Guardrail |
|---|---|---|
| 1. Inspect | Read the assignment, tried the reference, hit bot detection, switched to Claude in Chrome with my approval. Recorded content, layout, and motion into [`REFERENCE_NOTES.md`](REFERENCE_NOTES.md). | Did **not** bypass bot detection or the stubbed `getComputedStyle`; used only rendered geometry, visible text and `document.getAnimations()`. |
| 2. Assets | Exported the 43 photos + UI images through a browser-console snippet that respects the site's rate limit, renamed by room ([`scripts/assets.mjs`](../scripts/assets.mjs)). | Asked before downloading; no scraping of source code. |
| 3. Build | Data module first, then one component + CSS per section, overlays with focus trap / scroll lock / URL sync. | Conventions written down as it went (later [`CLAUDE.md`](../CLAUDE.md)). |
| 4. Measure & fix | Shared probe script run on both pages at the same viewport; per-anchor diffs driven to ≤ ±2px. | "Measure, don't guess" — every CSS change traced to a measurement. |
| 5. Typography | Derived font sizes from the reference's text content-area heights (≈ 1.3 × size) and checked DM Sans widths with canvas `measureText` (±3%). | Free font instead of the proprietary Cereal (my decision when asked). |
| 6. Behaviour | Scripted keyboard/URL/focus tests: tour ↔ lightbox ↔ page, Back/Forward, deep links, dialogs, calendar arrows. | Fixed the bugs these surfaced (focus lost behind `inert`, calendar arrows stuck on unavailable dates). |
| 7. Review passes | My visual review (amenity icons, chip alignment) + an automated text-anchor diff of ~90 anchors against the reference. | Only reported "done" with lint, build, probe and console evidence. |
| 8. Ship | Git history in logical commits, pushed to GitHub, deployed on Vercel, smoke-tested live. | Asked before pushing/deploying. |

Example follow-up prompts I used during review:

- *"In the clone, 'Show all 50 amenities' has no icons — the reference does. Fix it, and fix any other differences you find."*
- *"Correct the alignment for these review chips"* (with a screenshot).
- *"See the clone for any bug or alignment issue; fix them, otherwise it's good to go."*

## Measurement techniques the agent relied on

- **Layout probe** — text anchors → `y,h,x,w` in document coordinates on both pages, diffed ([`scripts/probe.js`](../scripts/probe.js)).
- **Border detection** — `offsetHeight − clientHeight` to find section dividers without reading styles.
- **Motion capture** — sampling `document.getAnimations()` during an interaction to read property, duration,
  easing and keyframes (e.g. tour close = 300ms `cubic-bezier(0.2,0,0,1)`, opacity + `translateY(35px)`).
- **Font calibration** — Range client-rect heights for size, canvas `measureText` for width parity.

## Reusable configuration (included in the repo)

| File | Purpose |
|---|---|
| [`CLAUDE.md`](../CLAUDE.md) | Project rules: structure, CSS conventions, overlay/a11y contract, URL contract, motion values, definition of done |
| [`AGENTS.md`](../AGENTS.md) | Points Codex / Cursor / other agents at the same rules |
| [`.claude/agents/ui-fidelity-reviewer.md`](../.claude/agents/ui-fidelity-reviewer.md) | Read-only sub-agent: layout/type/motion parity report against the reference |
| [`.claude/agents/a11y-auditor.md`](../.claude/agents/a11y-auditor.md) | Read-only sub-agent: keyboard, focus, ARIA, history behaviour |
| [`.claude/agents/code-quality-reviewer.md`](../.claude/agents/code-quality-reviewer.md) | Sub-agent: lint/build + structure and React/CSS conventions on the diff |
| [`.claude/agents/section-builder.md`](../.claude/agents/section-builder.md) | Sub-agent: builds one section from measurements, hands off to reviewers |
| [`.claude/skills/reference-probe`](../.claude/skills/reference-probe/SKILL.md) | Skill: measure and diff layout without touching reference source |
| [`.claude/skills/add-listing-section`](../.claude/skills/add-listing-section/SKILL.md) | Skill: recipe for adding a section the project way |
| [`.claude/settings.json`](../.claude/settings.json) | Allowed npm scripts + a PostToolUse hook that lints `src/` after every edit |

These files encode the loop that was run manually during the build (build → probe → review → fix), so the next
change — by me or another agent — follows the same checks. Typical use:

```text
Use the section-builder agent to add the "Show all 19 reviews" dialog, then run
ui-fidelity-reviewer and a11y-auditor on it and fix anything they report.
```

## What the agent was not allowed to do

- Bypass the reference's bot check or its `getComputedStyle` stub, or copy its markup/CSS/JS.
- Guess measurements, or claim parity without a probe or screenshot comparison.
- Download files, push, or deploy without my explicit go-ahead.
