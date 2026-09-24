// Diagram-as-code: one spec → architecture.svg (for GitHub/README) + architecture.excalidraw (editable).
// Usage: node docs/architecture/build-diagram.mjs
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = import.meta.dirname
const W = 1600
const H = 1210

const palette = {
  client: { fill: '#ffffff', stroke: '#9a9a9a' },
  edge: { fill: '#fff4f6', stroke: '#ff385c' },
  api: { fill: '#ffffff', stroke: '#9a9a9a' },
  svc: { fill: '#f3f7ff', stroke: '#5b7fd6' },
  data: { fill: '#f2faf4', stroke: '#3f9a5c' },
  async: { fill: '#fff8ec', stroke: '#d99a2b' },
  scale: { fill: '#fafafa', stroke: '#9a9a9a' },
  note: { fill: '#ffffff', stroke: '#ff385c', dashed: true },
}

// ── Spec ───────────────────────────────────────────────────────────────────────
const lanes = [
  [40, 'CLIENTS'],
  [300, 'EDGE'],
  [590, 'API LAYER'],
  [850, 'DOMAIN SERVICES  (stateless, Kubernetes + HPA)'],
  [1300, 'DATA'],
]

const boxes = [
  // clients
  { id: 'web', kind: 'client', x: 40, y: 150, w: 220, h: 92, title: 'Web (React / Next.js)', lines: ['SSR + ISR listing pages,', 'client-side overlays'] },
  { id: 'mobile', kind: 'client', x: 40, y: 262, w: 220, h: 76, title: 'iOS / Android', lines: ['Same BFF, push notifications'] },
  { id: 'tools', kind: 'client', x: 40, y: 358, w: 220, h: 76, title: 'Hosts & internal tools', lines: ['Calendar, pricing, support'] },
  // edge
  { id: 'cdn', kind: 'edge', x: 300, y: 150, w: 250, h: 110, title: 'Global CDN + WAF', lines: ['Static JS/CSS, ISR HTML (s-maxage +', 'stale-while-revalidate), bot mgmt,', 'DDoS / rate limits, geo-DNS'] },
  { id: 'img', kind: 'edge', x: 300, y: 280, w: 250, h: 92, title: 'Image CDN', lines: ['On-the-fly resize, AVIF/WebP,', 'srcset widths, immutable cache'] },
  { id: 'edgefn', kind: 'edge', x: 300, y: 392, w: 250, h: 76, title: 'Edge functions', lines: ['Locale/currency, A/B bucketing'] },
  // api
  { id: 'bff', kind: 'api', x: 590, y: 150, w: 220, h: 130, title: 'API gateway / BFF', lines: ['GraphQL/REST per client,', 'request fan-out, response', 'shaping, per-user rate limits,', 'idempotency keys on writes'] },
  { id: 'idp', kind: 'api', x: 590, y: 300, w: 220, h: 76, title: 'Identity (OIDC)', lines: ['Sessions, JWT, MFA, KYC'] },
  // services
  { id: 'listing', kind: 'svc', x: 850, y: 150, w: 200, h: 84, title: 'Listing', lines: ['Details, photo metadata,', 'amenities, host profile'] },
  { id: 'search', kind: 'svc', x: 1070, y: 150, w: 200, h: 84, title: 'Search & ranking', lines: ['Geo + date + price filters,', 'ML re-ranking'] },
  { id: 'avail', kind: 'svc', x: 850, y: 252, w: 200, h: 84, title: 'Availability', lines: ['Calendar, holds (TTL),', 'min-stay rules, iCal sync'] },
  { id: 'pricing', kind: 'svc', x: 1070, y: 252, w: 200, h: 84, title: 'Pricing', lines: ['Nightly rates, fees, taxes,', 'coupons, FX'] },
  { id: 'booking', kind: 'svc', x: 850, y: 354, w: 200, h: 84, title: 'Booking (saga)', lines: ['Hold → pay → confirm,', 'compensations on failure'] },
  { id: 'payments', kind: 'svc', x: 1070, y: 354, w: 200, h: 84, title: 'Payments', lines: ['PSP integration, payouts,', 'double-entry ledger'] },
  { id: 'reviews', kind: 'svc', x: 850, y: 456, w: 200, h: 84, title: 'Reviews', lines: ['Rating aggregates,', 'moderation'] },
  { id: 'msg', kind: 'svc', x: 1070, y: 456, w: 200, h: 84, title: 'Messaging & notify', lines: ['Host↔guest chat (WebSocket),', 'email / SMS / push'] },
  // data — each store is owned by one service (no shared database)
  { id: 'pgl', kind: 'data', x: 1300, y: 150, w: 260, h: 104, title: 'PostgreSQL — listings', lines: ['Sharded by listing_id,', 'read replicas per region', 'Owner: Listing'] },
  { id: 'pgb', kind: 'data', x: 1300, y: 266, w: 260, h: 104, title: 'PostgreSQL — bookings', lines: ['Home-region writes; exclusion', 'constraint on (listing, dates)', 'Owner: Booking, Payments'] },
  { id: 'redis', kind: 'data', x: 1300, y: 382, w: 260, h: 86, title: 'Redis cluster', lines: ['Hot listings, holds, sessions', 'Used by: Availability, BFF'] },
  { id: 'os', kind: 'data', x: 1300, y: 480, w: 260, h: 86, title: 'OpenSearch', lines: ['Geo index, facets, autocomplete', 'Owner: Search (fed by events)'] },
  { id: 's3', kind: 'data', x: 1300, y: 578, w: 260, h: 86, title: 'Object storage (S3)', lines: ['Photo originals → image CDN', 'Owner: Listing media pipeline'] },
  { id: 'wide', kind: 'data', x: 1300, y: 676, w: 260, h: 86, title: 'Wide-column store', lines: ['Messages, review text, activity', 'Owner: Messaging, Reviews'] },
  // async + analytics
  {
    id: 'bus', kind: 'async', x: 590, y: 600, w: 680, h: 118, title: 'Event bus (Kafka) + workers',
    lines: [
      'Outbox/CDC from Postgres → listing.updated, availability.changed, booking.confirmed, review.created',
      'Consumers: search indexer (near-real-time), cache purge + ISR revalidate, notifications, payouts,',
      'image pipeline (resize / moderate), analytics sink. At-least-once + idempotent handlers, DLQs.',
    ],
  },
  {
    id: 'ml', kind: 'data', x: 40, y: 600, w: 510, h: 118, title: 'Analytics & ML',
    lines: ['Data lake + warehouse, feature store; offline training for', 'search ranking, pricing suggestions and fraud scoring;', 'online inference behind the Search / Pricing services.'],
  },
]

// Scaling strategy: one column per area named in the brief.
const scaleTop = 790
const scaleCols = [
  ['Frontend', ['ISR HTML cached at the edge;', 'revalidated by listing events', 'Image CDN + srcset (LCP image', 'preloaded, rest lazy)', 'Overlays code-split; URL-', 'addressable (?modal=…)', 'RUM Core Web Vitals budgets']],
  ['Backend', ['Stateless services, HPA on', 'CPU / RPS; BFF fan-out', 'Rate limits + idempotency keys', 'Booking = saga with holds (TTL)', 'Queue-based load levelling', 'for launch / holiday spikes', 'Split services only on measured', 'bottlenecks']],
  ['Storage', ['Postgres sharded by listing_id,', 'regional read replicas', 'Bookings pinned to a home region;', 'exclusion constraint = no', 'double booking', 'Redis read-through for hot', 'listings; S3 + lifecycle tiers']],
  ['Search', ['OpenSearch shards per region;', 'rebuilt from events, never the', 'source of truth', 'Near-real-time indexing via CDC', 'Availability re-checked on the', 'booking path', 'ML re-rank inside Search service']],
  ['Deployment', ['Frontend: CDN/Vercel, preview', 'deploy per PR', 'Services: GitHub Actions → image', '→ Argo CD canary, SLO auto-rollback', 'Terraform; multi-region active-', 'active reads, DR replicas', 'OpenTelemetry traces + SLOs']],
]
const colGap = 16
const colW = (W - 80 - colGap * 4) / 5
const colH = 196
scaleCols.forEach(([title, lines], i) => {
  boxes.push({ id: `scale-${i}`, kind: 'scale', x: 40 + i * (colW + colGap), y: scaleTop + 32, w: colW, h: colH, title, lines })
})

boxes.push({
  id: 'note', kind: 'note', x: 40, y: 1060, w: W - 80, h: 110, title: 'Where this take-home sits',
  lines: [
    'The clone is the "Web" client\'s listing page: a static React SPA (Vite) served from a CDN (Vercel). Listing data lives in src/data/listing.js, shaped like the',
    'Listing / Reviews / Availability responses a BFF would return, so swapping it for a fetch is a local change. Photo tour and lightbox state is URL-addressable',
    '(?modal=PHOTO_TOUR_SCROLLABLE&modalItem=…), which is what lets SSR/ISR render the same overlay deep links and the CDN cache them per URL.',
  ],
})

// Connectors: [points…], dashed = async/event flow
const arrows = [
  { pts: [[260, 196], [298, 196]] },
  { pts: [[260, 300], [280, 300], [280, 210], [298, 210]] },
  { pts: [[260, 396], [285, 396], [285, 225], [298, 225]] },
  { pts: [[550, 205], [588, 205]] },
  { pts: [[700, 280], [700, 298]] },
  { pts: [[810, 192], [848, 192]] },
  { pts: [[810, 215], [830, 215], [830, 294], [848, 294]] },
  { pts: [[810, 240], [835, 240], [835, 396], [848, 396]] },
  { pts: [[950, 540], [950, 598]], dashed: true },
  { pts: [[1170, 540], [1170, 598]], dashed: true },
  { pts: [[1270, 640], [1286, 640], [1286, 523], [1298, 523]], dashed: true },
  { pts: [[590, 660], [552, 660]], dashed: true },
]

const title = 'Vacation-rental marketplace — production architecture'
const subtitle = 'Read-heavy browse/search served from the edge · strongly consistent booking core · event-driven fan-out · multi-region'

// ── SVG ───────────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const svg = []
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif">`)
svg.push(`<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#555"/></marker>`)
svg.push(`<marker id="ad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d99a2b"/></marker></defs>`)
svg.push(`<rect width="${W}" height="${H}" fill="#fff"/>`)
svg.push(`<text x="40" y="52" font-size="28" font-weight="700" fill="#222">${esc(title)}</text>`)
svg.push(`<text x="40" y="80" font-size="15" fill="#6a6a6a">${esc(subtitle)}</text>`)
for (const [x, label] of lanes) svg.push(`<text x="${x}" y="130" font-size="13" font-weight="700" letter-spacing="1.5" fill="#8a8a8a">${esc(label)}</text>`)
svg.push(`<text x="40" y="${scaleTop + 16}" font-size="13" font-weight="700" letter-spacing="1.5" fill="#8a8a8a">SCALING STRATEGY</text>`)
for (const b of boxes) {
  const p = palette[b.kind]
  svg.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5"${p.dashed ? ' stroke-dasharray="6 5"' : ''}/>`)
  svg.push(`<text x="${b.x + 18}" y="${b.y + 28}" font-size="15" font-weight="700" fill="#222">${esc(b.title)}</text>`)
  b.lines.forEach((l, i) => svg.push(`<text x="${b.x + 18}" y="${b.y + 50 + i * (b.kind === 'scale' ? 19 : 18)}" font-size="12.5" fill="#555">${esc(l)}</text>`))
}
for (const a of arrows) {
  const d = a.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
  svg.push(`<path d="${d}" fill="none" stroke="${a.dashed ? '#d99a2b' : '#555'}" stroke-width="1.6"${a.dashed ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#${a.dashed ? 'ad' : 'a'})"/>`)
}
svg.push('</svg>')
writeFileSync(join(OUT, 'architecture.svg'), svg.join('\n') + '\n')

// ── Excalidraw ────────────────────────────────────────────────────────────────
let seed = 1000
const base = (type, x, y, w, h, extra = {}) => ({
  id: `${type}-${seed}`,
  type,
  x,
  y,
  width: w,
  height: h,
  angle: 0,
  strokeColor: '#1e1e1e',
  backgroundColor: 'transparent',
  fillStyle: 'solid',
  strokeWidth: 1,
  strokeStyle: 'solid',
  roughness: 0,
  opacity: 100,
  groupIds: [],
  frameId: null,
  roundness: null,
  seed: seed++,
  version: 1,
  versionNonce: seed * 7,
  isDeleted: false,
  boundElements: null,
  updated: 1,
  link: null,
  locked: false,
  ...extra,
})
const text = (x, y, str, size, color = '#1e1e1e', bold = false) => {
  const lines = str.split('\n')
  return base('text', x, y, Math.max(...lines.map((l) => l.length)) * size * 0.55, lines.length * size * 1.25, {
    strokeColor: color,
    text: str,
    originalText: str,
    fontSize: size,
    fontFamily: bold ? 2 : 2,
    textAlign: 'left',
    verticalAlign: 'top',
    containerId: null,
    lineHeight: 1.25,
    autoResize: true,
  })
}
const els = []
els.push(text(40, 30, title, 28, '#222', true))
els.push(text(40, 68, subtitle, 15, '#6a6a6a'))
for (const [x, label] of lanes) els.push(text(x, 118, label, 13, '#8a8a8a'))
els.push(text(40, scaleTop + 4, 'SCALING STRATEGY', 13, '#8a8a8a'))
for (const b of boxes) {
  const p = palette[b.kind]
  els.push(
    base('rectangle', b.x, b.y, b.w, b.h, {
      strokeColor: p.stroke,
      backgroundColor: p.fill,
      strokeWidth: 1,
      strokeStyle: p.dashed ? 'dashed' : 'solid',
      roundness: { type: 3 },
    }),
  )
  els.push(text(b.x + 16, b.y + 12, b.title, 16, '#1e1e1e', true))
  els.push(text(b.x + 16, b.y + 38, b.lines.join('\n'), 13, '#555'))
}
for (const a of arrows) {
  const [x0, y0] = a.pts[0]
  const pts = a.pts.map(([x, y]) => [x - x0, y - y0])
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  els.push(
    base('arrow', x0, y0, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), {
      strokeColor: a.dashed ? '#d99a2b' : '#555555',
      strokeStyle: a.dashed ? 'dashed' : 'solid',
      points: pts,
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: 'arrow',
      elbowed: false,
    }),
  )
}
const scene = {
  type: 'excalidraw',
  version: 2,
  source: 'https://excalidraw.com',
  elements: els,
  appState: { viewBackgroundColor: '#ffffff', gridSize: null },
  files: {},
}
writeFileSync(join(OUT, 'architecture.excalidraw'), JSON.stringify(scene, null, 2) + '\n')
console.log(`wrote architecture.svg and architecture.excalidraw (${els.length} elements)`)
