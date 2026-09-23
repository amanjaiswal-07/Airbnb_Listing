# Reference Notes

Source of truth: https://airbnb-clone-umber-two.vercel.app

## How this was gathered

- The built-in automation browser is blocked ("This page could not be verified…"). Inspection was done in the
  user's own Chrome via the Claude in Chrome extension (2026-09-23).
- Viewport during inspection: **1536×730 CSS px** (DPR 1.25; layout width 1521 after the scrollbar). The
  content column is 1120px wide and centred, so it starts at x=200 here. (Early notes said 208 — that was
  measured while the photo tour had hidden the page scrollbar.)
- The reference **deliberately replaces `window.getComputedStyle`** with an obfuscated stub. We did not work
  around it. Layout values below come from `getBoundingClientRect` (which works); type sizes, weights and
  colours are read visually and should be confirmed in DevTools where precision matters.
- No source code or stylesheets were copied. Only rendered geometry, visible text and observed behaviour.

## Global

| Item | Observed |
|---|---|
| Font | Reference: `Airbnb Cereal VF` (proprietary). Clone: **DM Sans** (free) — sizes derived from measured text boxes (content-area ≈ 1.3 × font-size); widths match within ±3%. Cereal 500/600 ≈ DM Sans 600/650. |
| Text colour | near-black (#222 family); secondary grey (#6a6a6a family) — visually estimated |
| Brand | red/pink Rausch; Reserve button is a pink→magenta gradient |
| Page height | ~6256px; no footer — page ends after "More stays nearby" |
| Assets | Self-hosted on the reference under `/assets/images/` (43 listing photos as UUID `.jpeg`, 1440×1080 natural size), plus `ui/` (searchbar-house.png, discount.svg, laurel-left/right.png), `chips/` (10 review-tag icons), `avatars/` (host, rev1–5, co1–3), `similar/` (s1–s8) |

## Listing page (top → bottom)

1. **Header** (not sticky, ~88px, bottom border): logo x≈80; centred search pill (house icon · Anywhere | Anytime | *Add guests* · red round search button); right: "Become a host", globe and hamburger in ~40px grey circles.
2. **Title row**: H1 "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10" (~26px). Right: Share / Save (underlined, icon left). Hover = light-grey rounded background.
   - Share → dark toast "Share options" at bottom centre.
   - Save → toggles to red heart "Saved" + toast "Saved to wishlist"; click again to unsave.
3. **Hero grid**: 1120×494. Left 560×494, right 2×2 of 272×243, 8px gaps, outer corners rounded. Each image is a button (aria-label "…image N"). Hover = slight darkening. "Show all photos" white button 143×32, bottom-right.
   - Hero order: `2367476f`, `090d8b0b`, `9be71047`, `67c61c6f`, `c904e1ab`.
   - Clicking a hero image opens the Photo Tour scrolled to **that image's section**.
4. **Two-column body**: left column x=200 (652 wide); right column booking area x=948 (372 wide).
   - "Entire serviced apartment in Candolim, India" (~22px) + "3 guests · 1 bedroom · 1 bed · 1 bathroom".
   - Guest-favourite card (bordered, rounded): laurels, "One of the most loved homes on Airbnb, according to guests", 4.95 + stars | 19 Reviews.
   - Host row: avatar 46px, "Hosted by Mirashya Homes", "2 years hosting". Divider.
   - 3 highlights with icons: Outdoor entertainment / Designed for staying cool / Self check-in.
   - Grey translation banner "Some info has been automatically translated. Show original".
   - Description (clamped, emoji), "Show more >".
   - **Where you'll sleep**: 2 cards 316×210 (Bedroom · 1 double bed; Living room · 1 sofa).
   - **What this place offers**: 2-col list of 10 with icons; last two struck through (Carbon monoxide alarm, Smoke alarm). "Show all 50 amenities" outlined button.
   - **5 nights in Candolim** / 18 Oct 2026 – 23 Oct 2026; two-month calendar (Oct/Nov 2026), 18 & 23 black circles, range grey; unavailable nights Nov 18–24 and 29–30 (light grey, struck through); prev/next arrows; keyboard icon; "Clear dates". Day cells on the reference are plain `div`s (not focusable) — the clone uses buttons in a grid with arrow-key navigation.
   - **Right column (sticky)**: promo card (discount.svg, "Get 10% off your next stay." / "Terms apply", grey "Claim") + booking card (shadow): ₹28,499 underlined "for 5 nights"; CHECK-IN 10/18/2026 | CHECKOUT 10/23/2026; GUESTS 2 guests ▾; grey pill "Free cancellation before **17 October**"; gradient Reserve; "You won't be charged yet". Below: flag "Report this listing".
5. **Sticky sub-nav** (appears after scrolling past the photos): Photos · Amenities · Reviews · Location tabs (active = underline) on the left; right: "₹28,499 for 5 nights / ★ 4.95 · 19 reviews" + Reserve. Active tab tracks scroll position.
6. **Reviews** (full width): big 4.95 with laurels, "Guest favourite", explanation, "How reviews work"; rating bar (Overall 5–1 bars · Cleanliness 5.0 · Accuracy 5.0 · Check-in 5.0 · Communication 5.0 · Location 4.8 · Value 4.8, each with icon, vertical dividers); horizontally scrolling tag chips (Comfort 6, Accuracy 5, Hot tub 5, Condition 4, Hospitality 8, Cleanliness 4, Amenities 2, Decor 2, Indoor spaces 2, Location 2); 6 reviews in 2 columns (avatar or letter circle, name, tenure, stars · date, text, some "Show more"); "Show all 19 reviews".
7. **Where you'll be**: "Candolim, Goa, India"; illustrated map (sea/land, home pin, search + zoom buttons); "Exact location will be provided after booking."; Neighbourhood highlights + "Show more".
8. **Meet your host**: card (avatar with verified badge, "Mirashya Homes", Host | 1,463 Reviews · 4.68★ Rating · 2 Years hosting); "Born in the 80s", "Where I went to school: NICMAR GOA"; Co-Hosts grid (8); Host details (Response rate 100%, Responds within an hour); grey "Message host"; payment-protection note.
9. **Things to know**: 3 columns — Cancellation policy / House rules / Safety & property, each with "Learn more".
10. **More stays nearby**: "1 / 2" + prev/next circle arrows; 5 cards visible of 8 (208×208 images, title, price, ★ rating). Cards 7–8 reuse images s2/s4.

Full visible text: `docs/reference/page-content.md`.

## Photo tour

- Opens via "Show all photos" or any hero image. URL gains `?modal=PHOTO_TOUR_SCROLLABLE`.
- **Open: no animation** (appears instantly). **Close: 300ms `cubic-bezier(0.2,0,0,1)`, opacity 1→0 + translateY(0→35px).**
- Close: Back chevron (40×40 at 24,24), or **Esc**. Share and Save (heart) icon buttons top-right (40×40).
- Fixed 88px header, "Photo tour" centred. Below it an inner scroll container.
- Category strip: 9 thumbs (8 per row), ~112×105, grey label below. Click → **smooth-scrolls** to that section.
- Sections: left column x=272 w=458 — title (~32px, h≈35) + grey amenities line; right column x=790 w=458.
  **Section title block is sticky** while its photos scroll.
- Image layout per section: rows of **full 458×305** and **pairs 223×149**; 12px gaps; 20px between sections.
  Rounded corners. Grey placeholder until lazy-loaded.
- Photo hover: scale(1.04) with 400ms `cubic-bezier(0.2,0,0,1)` + dark overlay rgba(0,0,0,0.08) 200ms ease.
- Click photo → Lightbox.

| # | Section | Amenities line | Photos (id prefix, in order) | Layout |
|---|---|---|---|---|
| 1 | Living room 1 | Sofa · Air conditioning · Ceiling fan · TV | a9831aeb a45feaa2 f1da1c3d | F P |
| 2 | Living room 2 | Ceiling fan · Hot tub | 090d8b0b 9be71047 f6de1663 2367476f 34529829 153aa732 3c6e6809 | F P F P F |
| 3 | Full kitchen | Freezer · Fridge · Blender · Cooker · Cooking basics · Kettle · Microwave · Toaster · Wine glasses · Coffee · Crockery and cutlery | 56c44812 ddc853d7 | P |
| 4 | Bedroom | Double bed · Air conditioning · Bed linen · Ceiling fan · Clothes storage · Cot · Hangers · Iron · Room-darkening blinds · Cleaning available during stay · Cleaning products · Long-term stays allowed · Private entrance · Wifi | 67c61c6f 1c827136 0622ab42 a74e3c0b 48a8ffbc 3cf31697 | F P F P |
| 5 | Full bathroom | Hairdryer · Hot water · Shampoo · Shower gel | 97c78f8a | F |
| 6 | Gym | Air conditioning · Gym · Exercise equipment · Ceiling fan | 9aa8e65f 246bd88d 4fede77d 79f59adb f19d8c0a | F P P |
| 7 | Exterior | — | 23ea6621 5adfdf3e 608748cd 5b856fde c904e1ab 42befad7 | F P F P |
| 8 | Pool | Pool | fc02f48f 929545d3 8eb65a8b | F P |
| 9 | Additional photos | — | 70325367 cc7a56bd 30ad93b2 9642a60d b6599f26 dc01fd46 fe37b80e 3c90338e 862d936c 79addceb | F P F P F P F |

Total 43. (F = full-width, P = pair.) Layout rule: repeat [F, P]; a 2-photo section is just P; Gym (5) is F P P.

## Lightbox

- `role="dialog"`, `aria-modal="true"`, label "Photo viewer". **White background.** URL gains `&modalItem=10NN` (1000 + index).
- Header: grid icon button (aria "Show all photos", 40×40 at 16,16 — returns to tour); caption = section name, centred; "N of 43" + Close ✕ (40×40) on the right.
- Image: top at 88px, height = viewport − 176 (554 at 730 tall), width by 4:3 aspect (738), centred.
- Prev/Next: 40×40 outlined circles, vertically centred, 20px from edges. **Disabled (`disabled` attr, faded) at the ends — no wrapping.**
- ← / → keys navigate; image swap is **instant** (no transition detected).
- Esc closes the lightbox → back to the photo tour at the same scroll position.
- Focus on open stays on the clicked photo; on close it returns to that photo. (Reference focus handling is minimal — we will add a proper focus trap; see plan.)

## Accessibility observations of reference

- "Skip to content" link exists.
- Images are buttons with aria-label "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10 image N".
- Closing the photo tour sends focus to `<body>` (not back to the trigger) — we will improve on this.

## Measured geometry (document px, viewport 1536×730, layout width 1521)

Gathered with `getBoundingClientRect` + `offsetHeight − clientHeight` (border detection) — see `scripts/probe.js`.
Content column x=200…1320 (1120 wide, centred in the scrollbar-less layout width). Left column 652 wide, right column x=948, 372 wide.

| Block | Values |
|---|---|
| Header | 89px incl. 1px bottom border. Logo 80,28 103×32. Pill 559..962 (403×48, top 20); segments Anywhere 149w (house 48 at +10), Anytime 88w, Add guests 106w, search 32 at x921. "Become a host" 125×44 at x1220; globe/menu 40×40 at 1353/1401 |
| Title row | h1 y121 h30 (602w). Share button 81×34 at 1162, Save 75×34 at 1245 (ends 1320), icon at +10 |
| Hero | y174 … 668. "Show all photos" 143×32 at (1154, 612), icon 15px at +15 |
| Left column | Subtitle y715 h26; facts y747; guest-fav card y802 h81 (text x368 w281, 4.95 x671, 19 x774); host avatar 46 at y909; section borders at 981, 1220, 1473, 1857, 2268, 2729 (each section: 1px top border + 32px padding) |
| Highlights | icons 24 at x200, text x248, items 66px apart |
| Description | banner text y1263; text y1307 h99 (4 lines); "Show more" y1420 |
| Sleep | cards 318×212 (1px border) at x200/534, y1555; name y1781, detail y1805 |
| Amenities | first row y1944; rows 48 apart; columns x200 / x530; button 208×48 at y2188 |
| Calendar | h2 y2301; sub y2338; month header row y2376 (32 tall); month 298 wide, 56 gap; day cells ≈42.6 square, first row y2444; "Clear dates" y2676 |
| Booking | promo y715 h70; card y809 h366, padding 24; date box y881 h117 (rows 58/57); Reserve y1067 h48 (pill); "You won't be charged yet" y1131; report y1201; sticky top 100 |
| Reviews | border y2729; big number y2786 h143 x667 w187; laurels 72×110 at y2802 (8px from number); "Guest favourite" y2937; lead y2976 (w420, 2 lines); "How reviews work" y3031; rating bar labels y3099 (columns: first 212, then 6 × 151 with left border, 24px inset); chips y3273 h48 (gap 12); reviews from y3351 — 2 columns 520 wide, 80 gap, rows 236 apart; avatar 42; text lh 21; "Show all 19 reviews" y3982 |
| Location | border y4079; h2 y4128; place y4178; map y4225 480 tall, controls 40px inset 12, pin 56 centred; note y4723; "Neighbourhood highlights" y4783 |
| Host | border y4930; h2 y4978; card 340×260 at y5028 (avatar 88, name 2 lines lh 37, stats column x436); facts y5311/5349; co-hosts x588 (avatar 34, rows 50 apart); "Host details" y5234; "Message host" 145×48 y5342; payment note y5420 |
| Things to know | border y5492; h2 y5541; icons y5591; titles y5633; 3 columns 352 wide, 32 gap |
| More stays | h2 y5876; pager "1 / 2" x1208; cards 208×208 at y5925, 20 gap; titles y6141; page ends 6256 |
| Sticky nav | 67px incl. border; tabs 64 tall at x200/266/353/427 (8px side padding); Reserve 93×40 at x1228 |
