# Prompt sequence

The prompts I gave the coding agent (Claude Code), in order, copied verbatim (typos included). The
agent's own sub-steps are summarised under each prompt. See [`AI_WORKFLOW.md`](AI_WORKFLOW.md) for the
tools, guardrails and measurement techniques, and [`.claude/`](../.claude) for the sub-agents and skills
that capture the workflow for future changes.

| # | Stage | Prompt (short) |
|---|---|---|
| 1 | Kick-off brief | *You are a senior frontend engineer and UI replication specialist…* |
| 2 | Reference access | any thing you need to open this website reference https://airbnb-cl… |
| 3 | Browser connected | done |
| 4 | Asset download blocked | what to do ? |
| 5 | Assets exported | i have tried this in another browser |
| 6 | Build go-ahead | proceed ahead (and if any thing extra required which i didnt mentio… |
| 7 | My visual review | just minor changes |
| 8 | My visual review | correct the alignment for this |
| 9 | Agent self-review | now from your end see the clone if any bug , alignment issue  or ma… |
| 10 | Resume after usage limit | I hit my usage limit while you were working, but it has reset now.… |
| 11 | Confirmation | so no bugs are left for now ? |
| 12 | Ship | push it to github and deploy to vercel |
| 13 | Architecture + AI configs | clone is ready now |
| 14 | Review of the diagram | open excalidraw file and check |
| 15 | Challenge the result | is the flow you suggested is correct ?? or any improvement needed |
| 16 | Scope check | it is required to do changes or present flow will be fine? |
| 17 | Apply | yes add |
| 18 | Verify | have every thing updated please check once (as you update some flow… |
| 19 | Final check | now check every thing before final submission |
| 20 | Responsiveness | is this responsive for Desktop |
| 21 | Packaging | this is the instruction for submission: … A zipped file containing… |

---

## 1. Kick-off brief

Sent with the assignment document attached (`Playpower Labs Assignment_ Airbnb-Clone App.docx`).

```text
You are a senior frontend engineer and UI replication specialist.

I need to complete a take-home assignment for Playpower Labs.

Your task is to help me build a high-fidelity Airbnb listing page
clone that closely matches the provided reference website.

REFERENCE WEBSITE:
https://airbnb-clone-umber-two.vercel.app/

TECH STACK:
- React
- Vite
- JavaScript
- CSS

You may recommend additional lightweight libraries if they
are genuinely useful, but keep the implementation focused.

==================================================
1. UNDERSTAND THE ASSIGNMENT
==================================================

The assignment requires three views:

1. Listing Page
   - Recreate the complete property listing page.
   - Match the layout, spacing, typography, colors, images,
     and interactions.

2. Photo Tour
   - A full-screen photo gallery.
   - Opened through the "Show all photos" button or a hero image.
   - Match the reference's layout and behavior.

3. Lightbox
   - A single-photo viewer.
   - Previous and next navigation.
   - Keyboard navigation using the left and right arrow keys.
   - Appropriate close behavior, transitions, and accessibility.

Desktop implementation only. Mobile responsiveness is
not required by the assignment.

The assignment also requires:

- A high-level production architecture diagram.
- AI sub-agent/skill configuration files.
- A clean, complete implementation.

IMPORTANT:
Do not copy or directly extract the reference website's
codebase. Create an original implementation based on
observing its appearance and behavior.

==================================================
2. YOUR FIRST TASK: ANALYZE THE REFERENCE
==================================================

Before writing application code, inspect the reference website.

If browser access is available, open the reference website
and examine it carefully.

Analyze the following:

A. LISTING PAGE

- Navbar layout and dimensions.
- Property title and location.
- Rating and review information.
- Main photo gallery.
- Image proportions and cropping.
- Property description.
- Amenities and other visible sections.
- Host information.
- Booking card and pricing.
- Typography, font weights, and colors.
- Margins, padding, borders, and border radii.
- Buttons, icons, hover states, and other interactions.

B. PHOTO TOUR

- How the gallery opens.
- Number of columns.
- Image sizes and aspect ratios.
- Spacing between images.
- Scrolling behavior.
- Image click behavior.
- Close or return behavior.

C. LIGHTBOX

- Image dimensions and positioning.
- Previous and next buttons.
- Close button.
- Keyboard navigation.
- Background overlay.
- Click behavior.
- Animations and transitions.
- Focus management.

Do not invent property information or claim that you have
inspected interactions that you could not actually verify.

If the reference website cannot be accessed, explain the
limitation and tell me what screenshots or assets you need
from me before proceeding.

==================================================
3. PROJECT SETUP
==================================================


==================================================
4. IMPLEMENTATION STRATEGY
==================================================

Work incrementally.

Do not attempt to generate the entire application in one
large code-generation step.

Use the following phases: (you can create your plan also i am just giving overview)

PHASE 1:
- Inspect the reference.
- Analyze the layout and interactions.
- Identify assets and information required.
- Create an implementation plan.
- Set up the project if necessary.

PHASE 2:
- Implement the Listing Page.
- Focus on accurate layout, dimensions, typography,
  image positioning, and spacing.

PHASE 3:
- Implement the Photo Tour.
- Reuse the listing page's image data where appropriate.

PHASE 4:
- Implement the Lightbox.
- Add previous/next controls.
- Add keyboard navigation.
- Implement appropriate closing behavior and transitions.

PHASE 5:
- Compare the implementation against the reference.
- Correct visual differences.
- Test interactions and accessibility.
- Fix console errors and other issues.

PHASE 6:
- Prepare the architecture diagram.
- Add the required AI configuration files.
- Prepare the application for deployment.

==================================================
5. VISUAL FIDELITY REQUIREMENTS
==================================================

The reference website is the source of truth.

Do not create a generic Airbnb-inspired design.

Reproduce the actual reference as closely as possible.(if any enhancement required then do so but not a beyound a limit or ask me)

Pay particular attention to:

- Exact content positioning.
- Container widths.
- Image dimensions and aspect ratios.
- Image cropping.
- Font sizes and font weights.
- Line heights.
- Colors.
- Borders and shadows.
- Button dimensions.
- Icon positioning.
- Vertical and horizontal spacing.

Do not randomly change the design based on personal preference.

==================================================
6. AI WORKFLOW
==================================================

Use an AI-assisted development workflow.

Before implementing each major component:

1. Explain the component's purpose.
2. Identify the reference details it must reproduce.
3. Implement the component.
4. Test it.
5. Compare it against the reference.
6. Correct any identified differences.

Keep the code modular, readable, and maintainable.

Avoid unnecessary abstractions, unnecessary backend work,
and features that are not required by the assignment.

Do not claim that a component is pixel-perfect without
actually comparing it against the reference.

==================================================
7. IMPORTANT RULES
==================================================

- Do not fabricate reference details.
- Do not use placeholder images if the actual images can
  reasonably be obtained from legitimate sources.
- Do not copy the reference website's source code.
- Do not skip the Photo Tour or Lightbox.
- Do not ignore keyboard navigation or accessibility.
- Do not over-engineer the application.
- Do not leave broken buttons or nonfunctional interactions.
- Do not delete existing project files without checking them.
- Keep me informed about important implementation decisions.
- Clearly identify anything that still requires my input.


Begin by examining the project and the reference, then
report your findings and proceed with the initial setup. and tell me what to do next (you can plan accrdingly)

Your priority is a faithful, functional implementation, professional looking site
that satisfies the Playpower Labs assignment.
```

**Result:** the agent read the assignment, inspected the project, tried the reference, reported that it blocks automated browsers, and proposed a plan.

## 2. Reference access

```text
any thing you need to open this website reference https://airbnb-clone-umber-two.vercel.app/ you can do i allow you
```

**Result:** The reference blocks automated browsers. The agent did not bypass this; it proposed connecting my own Chrome via the Claude in Chrome extension.

## 3. Browser connected

```text
done
```

**Result:** After I installed Claude in Chrome, the agent inspected the reference in a real session and recorded layout, content and motion in `docs/REFERENCE_NOTES.md`.

## 4. Asset download blocked (with screenshot of HTTP 429 errors)

```text
what to do ?
```

**Result:** The agent wrote a rate-limit-friendly browser-console snippet (cache-first, back-off, one JSON bundle) instead of scraping.

## 5. Assets exported (with screenshot + `airbnb-assets.json`)

```text
i have tried this in another browser
```

**Result:** The agent imported 72 of 74 assets and renamed them by room (`scripts/assets.mjs`).

## 6. Build go-ahead

```text
proceed ahead (and if any thing extra required which i didnt mention you can proceed to that also i give you permission)
```

**Result:** Phases 2–5: data module, listing page sections, photo tour, lightbox, URL/history sync, focus management. Probe-driven comparison until text anchors were within ±2px of the reference.

## 7. My visual review (2 screenshots of the amenities dialog)

```text
just minor changes
the clone you have built
in that when we click on Show all 50 amenities window is pop up but there is no icons corresponding to that
in reference there is a icon so add them

form my side i see these difference
if you find any another please resolve them
```

**Result:** Added 28 amenity icons and an icon mapping in the data module; the agent re-checked other dialogs.

## 8. My visual review (screenshot of review chips)

```text
correct the alignment for this
```

**Result:** Fixed review-chip sizing and spacing to match the reference.

## 9. Agent self-review

```text
now from your end see the clone if any bug , alignment issue  or many more if there is left fixed them otherwise good to go
```

**Result:** Automated diff of ~90 text anchors against the reference; fixed calendar arrow-key navigation over unavailable dates and several alignment offsets.

## 10. Resume after usage limit

```text
I hit my usage limit while you were working, but it has reset now. Please continue from where you left off.
```

## 11. Confirmation

```text
so no bugs are left for now ?
```

**Result:** The agent reported lint/build/probe/console evidence rather than a bare yes.

## 12. Ship

```text
push it to github and deploy to vercel
https://github.com/amanjaiswal-07/Airbnb_Listing
```

**Result:** Logical commit history pushed; deployed on Vercel (Vite preset); live smoke test.

## 13. Architecture + AI configs

```text
clone is ready now
now next part of the assignment is
Architecture Diagram
Submit a high-level architecture diagram for a production-scale vacation-rental marketplace (think Airbnb) alongside your app. The diagram should illustrate your scaling strategy for frontend, backend, storage, search, and deployment. Tools like lucid.app or excalidraw are recommended.

What they Will Look At submission

* Modern AI workflow usage (coding agents, sub-agents, skills, prompts)
* How closely the clone matches the reference, visual fidelity and behavioural parity, including animations, transitions, and accessibility
* Production architecture thinking
* AI subagent configs for code quality and project structure

Please keep the scope focused and do include your sub-agent/skill config files in your submission. A clean, complete implementation is better than an over-engineered incomplete one.

do the all the required things
```

**Result:** Diagram-as-code (`docs/architecture/build-diagram.mjs`) → SVG, PNG and Excalidraw; `ARCHITECTURE.md`; `CLAUDE.md`, `AGENTS.md`, 4 sub-agents, 2 skills, settings with a lint hook; `docs/AI_WORKFLOW.md`.

## 14. Review of the diagram

```text
open excalidraw file and check
also the suggested flow is correct ??
update readme into detail
and lastly remove the unwanted from repo which is of no use (such that it is easy during submission)
```

**Result:** Opened the file in excalidraw.com and fixed clipped labels. Corrected the flow (edge grouping, BFF → all services, outbox/CDC from every service, booking saga arrows, cache-purge path). Detailed README; removed unused files.

## 15. Challenge the result

```text
is the flow you suggested is correct ?? or any improvement needed
```

**Result:** The agent listed remaining gaps by priority (missing SSR tier, image-CDN origin, external providers, ML loop …).

## 16. Scope check

```text
it is required to do changes or present flow will be fine?
```

**Result:** Recommendation: add only the two gaps a reviewer would notice; skip the polish.

## 17. Apply

```text
yes add
```

**Result:** Added the Web SSR / ISR tier and the S3 → image CDN origin fetch; regenerated all diagram formats and docs.

## 18. Verify

```text
have every thing updated please check once (as you update some flow) (excalidraw.com) check also
```

**Result:** Regenerated-vs-committed diff (none), docs consistency grep, re-loaded the Excalidraw file from GitHub.

## 19. Final check

```text
now check every thing before final submission
```

**Result:** Lint, build, link check, live-bundle hash vs local build, live smoke test of tour/lightbox/dialogs/deep links/focus return, console errors.

## 20. Responsiveness

```text
is this responsive for Desktop
```

**Result:** Measured at 1100, 1280, 1920 and 2560px: no horizontal scroll, centred 1120px column, overlays scale.

## 21. Packaging

```text
this is the instruction for submission: … A zipped file containing the code and architecture diagram (image/pdf file). The sequence of prompts used for AI-assisted development …
```

**Result:** This file, a PDF of the diagram, and the submission zip.
