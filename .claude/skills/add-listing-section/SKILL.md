---
name: add-listing-section
description: Step-by-step recipe for adding or rebuilding a section of the listing page so it matches the reference and the project conventions. Use for any new section, dialog, or major section rework.
---

# Add / rebuild a listing section

## 1. Understand the target
- Read the section's entries in `docs/REFERENCE_NOTES.md` (content, geometry, behaviour).
- Missing numbers? Run the `reference-probe` skill on the reference first. Record what you measure.
- List the interactions (hover, click, keyboard) and what each does on the reference.

## 2. Data
Put all copy, counts and image paths in `src/data/listing.js` (export a named object/array). Images go in
`public/images/<group>/` with descriptive names.

## 3. Component
`src/components/<Name>.jsx` + `<Name>.css`:
- Root: `<section className="<block> section" aria-labelledby="<block>-title">` with a heading id.
- Class names: `<block>__<element>` / `<block>--<modifier>`.
- Use shared primitives: `.section-title`, `.text-link`, `.outline-button`, `Icon`, `Avatar`, `Stars`.
- Buttons for actions, links for navigation; every icon-only control gets `aria-label`.
- Local UI state only (open/closed, page); lift anything shared to `App.jsx`.

## 4. Styles
- Section padding: left column `32px 0`, full width `48px 0` (plus the `.section` top border).
- Sizes from measurements; font weights mapped Cereal→DM Sans (500→600, 600→650).
- Colours from tokens; add a token to `:root` if a new colour is truly needed.

## 5. Wire up
Import in `App.jsx`, place it in document order, pass data + callbacks. Overlays follow the overlay rules
in `CLAUDE.md` (portal, dialog, focus trap, scroll lock, Esc, focus return, `inert` page).

## 6. Verify
```bash
npm run lint && npm run build
```
Then: probe diff (±2px), screenshot comparison at the same scroll position, keyboard pass, console clean.
Hand the result to the `ui-fidelity-reviewer` and `a11y-auditor` agents.
