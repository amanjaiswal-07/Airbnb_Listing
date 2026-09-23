---
name: reference-probe
description: Measure layout on the reference site and the clone at the same viewport and diff them. Use before changing any spacing/size, after a visual change, or when asked "how close is it?".
---

# Reference probe

Measures where key text anchors sit on both pages and reports deltas. Works without reading any reference
source code: it only uses rendered geometry.

## 1. Viewport
Both pages at **1536×730** CSS px.
- Built-in browser (clone): `resize_window { width: 1536, height: 730 }`.
- Chrome (reference): check `innerWidth` is 1536; if DevTools device mode is on, ask the user to turn it off.

## 2. Collect
Paste the body of `scripts/probe.js` into `javascript_tool` on each page (top of page, no overlay open).
Output: `doc:<height> label:y,h,x,w …` in document coordinates.

The saved reference run is `docs/reference/probe-reference.txt` — only re-probe the reference when the
reference itself may have changed.

## 3. Diff
For each label compare `y` (vertical rhythm), `h` (line-height / wrapping), `x`/`w` (alignment, text width).
- `y` drift that starts at one anchor and persists below it → the section above it has the wrong height.
- `h` doubles → text wraps; compare widths and font size before touching spacing.
- Button labels report the text box, not the button; ±8–16px there is expected.

## 4. Typography check (optional)
On the reference, a text node's Range client-rect height ≈ 1.3 × font-size (Cereal). Compute the DM Sans
width at that size with a canvas `measureText` and compare to the reference width (target ±3%).

## 5. Record
Add new or corrected numbers to the "Measured geometry" table in `docs/REFERENCE_NOTES.md`.

## Pitfalls
- Chrome only paints the active tab — use one tab and navigate between URLs; wait ~9s for the reference's
  bot check before measuring.
- Screenshots right after `scrollTo` can be blank; wait 1s.
- Output that looks like `key=value` may be blocked by the extension — use `:` separators.
