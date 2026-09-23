// Original line-icon set drawn on a 32×32 grid. Stroke icons inherit currentColor.
const strokePaths = {
  share: 'M16 3v17M9.5 9.5 16 3l6.5 6.5M6 14v14h20V14',
  heart:
    'M16 28C9 23.3 3 18.4 3 11.5 3 7.4 6 4.5 9.6 4.5c2.8 0 5 1.6 6.4 4 1.4-2.4 3.6-4 6.4-4 3.6 0 6.6 2.9 6.6 7 0 6.9-6 11.8-13 16.5Z',
  search: 'M13.5 4a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19ZM20.5 20.5 28 28',
  globe:
    'M16 3a13 13 0 1 1 0 26 13 13 0 0 1 0-26ZM3.5 12.5h25M3.5 19.5h25M16 3c-3.4 3.6-5 8-5 13s1.6 9.4 5 13M16 3c3.4 3.6 5 8 5 13s-1.6 9.4-5 13',
  menu: 'M4 9h24M4 16h24M4 23h24',
  chevronLeft: 'M20 4 8 16l12 12',
  chevronRight: 'M12 4l12 12-12 12',
  chevronDown: 'M4 11l12 12 12-12',
  close: 'M7 7l18 18M25 7 7 25',
  plus: 'M16 5v22M5 16h22',
  minus: 'M5 16h22',
  outdoor: 'M3 13 16 5l13 8H3ZM16 13v15M8 28h16M10 20h12',
  fan: 'M16 13.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM16 13.5C14 9 14.5 4.5 17.5 3.5c3 1 3 6-1.5 10M18.3 17c4.8-.6 8.7 1.6 8.4 4.7-2.2 2.3-6.5.2-8.4-4.7M13.7 17c-2.8 3.9-7 5.6-9.3 3.6-.3-3.1 4.1-4.8 9.3-3.6',
  door: 'M8 29V4h16v25M4 29h24M19.5 16.5v2',
  kitchen: 'M8 3v9a3 3 0 0 0 6 0V3M11 3v26M22 29V3c-3 2-4.5 6-4.5 11H22',
  wifi: 'M3 12.5a19 19 0 0 1 26 0M7.5 17a12.5 12.5 0 0 1 17 0M12 21.5a6 6 0 0 1 8 0M16 26h.01',
  workspace: 'M3 17h26M6 17v11M26 17v11M9 17v-4h8v4M22 17V9l-4-4M18 5l-3 3',
  car: 'M4 22v-6l3-7h18l3 7v6H4ZM4 22v4h4v-4M24 22v4h4v-4M4 16h24M9 19h2M21 19h2',
  pool: 'M3 21c2.2 0 2.2 1.5 4.3 1.5S9.5 21 11.7 21s2.2 1.5 4.3 1.5 2.2-1.5 4.3-1.5 2.2 1.5 4.3 1.5S26.8 21 29 21M3 26.5c2.2 0 2.2 1.5 4.3 1.5s2.2-1.5 4.4-1.5 2.2 1.5 4.3 1.5 2.2-1.5 4.3-1.5 2.2 1.5 4.3 1.5 2.2-1.5 4.4-1.5M10 18V6a3 3 0 0 1 6 0M20 18V6a3 3 0 0 1 6 0M10 10h10M10 14h10',
  hottub: 'M3 16h26v5a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-5ZM8 16V6a3 3 0 0 1 6 0M18 12c0-2 2-2 2-4s-2-2-2-4M24 12c0-2 2-2 2-4s-2-2-2-4',
  paw: 'M16 17c-4.5 0-8 5-8 8.5 0 2 1.5 3 3.5 3 2 0 3-1 4.5-1s2.5 1 4.5 1 3.5-1 3.5-3c0-3.5-3.5-8.5-8-8.5ZM7 11a2.5 3 0 1 1 0 6 2.5 3 0 0 1 0-6ZM25 11a2.5 3 0 1 1 0 6 2.5 3 0 0 1 0-6ZM12 4a2.5 3 0 1 1 0 6 2.5 3 0 0 1 0-6ZM20 4a2.5 3 0 1 1 0 6 2.5 3 0 0 1 0-6Z',
  camera: 'M3 5v14M3 12h6M9 8l17 4v6l-17-4V8ZM18 16.5V24h8M26 13.5l3 1',
  coAlarm: 'M5 5h22v22H5V5ZM11 13a3 3 0 1 0 0 6M16 13h2.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H16v-6ZM3 3l26 26',
  smokeAlarm: 'M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24ZM16 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM3 3l26 26',
  spray: 'M11 10h7v4l3 3v12H8V17l3-3v-4ZM11 10V6h5l2 2M22 5h.01M25 3h.01M25 7h.01M28 5h.01',
  check: 'M16 3a13 13 0 1 1 0 26 13 13 0 0 1 0-26ZM10 16.5l4 4 8-9',
  key: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14ZM9 9h.01M16 16l12 12M22 22l3-3M25 25l3-3',
  message: 'M4 5h24v17H13l-7 6v-6H4V5Z',
  map: 'M3 7l8-3 10 4 8-3v20l-8 3-10-4-8 3V7ZM11 4v20M21 8v20',
  tag: 'M3 4v11l14 14 12-12L15 3H4ZM10 10.5a1.5 1.5 0 1 1 0-.01',
  calendarX: 'M4 6h24v22H4V6ZM4 12h24M10 3v5M22 3v5M12 16l8 8M20 16l-8 8',
  keyRound: 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM12 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM17.5 17.5 28 28M23 23l-2.5 2.5M26 26l-2 2',
  shield: 'M16 3 5 7v8c0 7 5 12 11 14 6-2 11-7 11-14V7L16 3ZM16 3v26',
  balloon: 'M16 3c5 0 8.5 4 8.5 8.5 0 5.5-4.5 10.5-8.5 10.5s-8.5-5-8.5-10.5C7.5 7 11 3 16 3ZM14 22h4l-1 2h-2l-1-2ZM16 24c0 2-2 2.5-2 5',
  school: 'M2 12 16 5l14 7-14 7L2 12ZM8 15v7c2 2 5 3 8 3s6-1 8-3v-7M29 12v8',
  keyboard: 'M3 7h26v18H3V7ZM8 12h.01M12 12h.01M16 12h.01M20 12h.01M24 12h.01M8 16h.01M12 16h.01M16 16h.01M20 16h.01M24 16h.01M10 20h12',
  home: 'M5 15 16 5l11 10M8 12v15h16V12M13 27v-8h6v8',
  // Amenity dialog icons
  hairdryer: 'M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0ZM12 11.5h.01M20 8.5l8-2v11l-8-2M9 19.5l2 8.5h4l-1.6-8.3',
  cleaningProducts: 'M9 12h14l-2 17H11L9 12ZM12 12V8h8v4M14 8V4h4v4M10 18h12',
  shampoo: 'M10 13h12v15a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V13ZM13 13V9h6v4M16 9V4h-5M12 19h8M12 23h8',
  hotWater: 'M4 16h24v6a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-6ZM11 12c0-2 2-2 2-4s-2-2-2-4M17 12c0-2 2-2 2-4s-2-2-2-4M23 12c0-2 2-2 2-4s-2-2-2-4',
  showerGel: 'M7 13h11v15H7V13ZM9.5 13V9h6v4M12.5 9V4h-4M23 7a2 2 0 1 1 0 .01M26 14a2 2 0 1 1 0 .01M24 21a1.5 1.5 0 1 1 0 .01',
  washer: 'M5 3h22v26H5V3ZM5 9h22M9 6h.01M13 6h.01M16 13a7 7 0 1 1 0 14 7 7 0 0 1 0-14ZM12 21c2-2 6 2 8 0',
  hanger: 'M13 6a3 3 0 1 1 3 3v3L3 24h26L16 12',
  bedLinen: 'M3 8v18M29 26v-9H3M3 22h26M6 17v-4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4',
  blinds: 'M3 4h26M6 4v18h20V4M6 9h20M6 14h20M6 19h20M16 22v5',
  iron: 'M3 24h26c0-8-4-14-12-14H8M8 10V6h10M7 19h3M13 19h3',
  wardrobe: 'M5 3h22v26H5V3ZM16 3v26M13 14v4M19 14v4',
  cot: 'M4 5v23M28 5v23M4 11h24M4 23h24M10 11v12M16 11v12M22 11v12',
  tv: 'M3 7h26v17H3V7ZM11 28h10M16 24v4',
  ac: 'M3 7h26v11H3V7ZM7 14h18M11 22c0 2 1.5 3 1.5 5M16 22v5M21 22c0 2-1.5 3-1.5 5',
  fridge: 'M7 3h18v26H7V3ZM7 12h18M11 7v2M11 16v4',
  microwave: 'M3 6h26v20H3V6ZM6 10h15v12H6V10ZM25 11h.01M25 16h.01M25 21h.01',
  cookingBasics: 'M5 13h22v10a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V13ZM2 16h3M27 16h3M12 13v-3h8v3M16 10V7',
  crockery: 'M16 6a10 10 0 1 1 0 20 10 10 0 0 1 0-20ZM16 11a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z',
  kettle: 'M8 12h14l2 16H6L8 12ZM11 12a4 4 0 0 1 8 0M22.5 15l4.5-3v6l-3 3M15 5v3',
  coffee: 'M4 12h18v8a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8v-8ZM22 14h2a3 3 0 0 1 0 6h-2M10 8c0-2 2-2 2-4M16 8c0-2 2-2 2-4',
  wineGlasses: 'M8 3h8l1 8a5 5 0 0 1-10 0l1-8ZM12 16v12M8 28h8M20 10h7l.5 6a4 4 0 0 1-8 0l.5-6ZM23.5 20v8M20.5 28h6',
  toaster: 'M4 13a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v14H4V13ZM11 8V4M19 8V4M4 19h24M8 23h4',
  blender: 'M9 3h14l-3 16h-8L9 3ZM10 19h12v9H10v-9ZM16 23.5h.01',
  cooker: 'M4 4h24v24H4V4ZM4 12h24M10 8h.01M16 8h.01M22 8h.01M9 17h14v7H9v-7Z',
  patio: 'M16 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM16 4v4M16 16v12M12 12H8M24 12h-4M11 28h10M16 23c-3 0-5-1.5-5-4M16 23c3 0 5-1.5 5-4',
  outdoorDining: 'M4 12 16 4l12 8H4ZM16 12v16M6 20h20M8 20v8M24 20v8',
  gym: 'M3 13v6M29 13v6M7 9v14h4V9H7ZM21 9v14h4V9h-4ZM11 16h10',
  longTerm: 'M4 6h24v22H4V6ZM4 12h24M10 3v5M22 3v5M9 17h2M15 17h2M21 17h2M9 22h2M15 22h2',
}

// Filled glyphs (no stroke).
const fillPaths = {
  star: 'M16 2.5l4.2 8.6 9.5 1.4-6.9 6.7 1.6 9.4L16 24.2l-8.4 4.4 1.6-9.4-6.9-6.7 9.5-1.4L16 2.5Z',
  heartFilled:
    'M16 28C9 23.3 3 18.4 3 11.5 3 7.4 6 4.5 9.6 4.5c2.8 0 5 1.6 6.4 4 1.4-2.4 3.6-4 6.4-4 3.6 0 6.6 2.9 6.6 7 0 6.9-6 11.8-13 16.5Z',
  flag: 'M5 3h2v26H5V3ZM7 4h18l-4 6 4 6H7V4Z',
  gridDots:
    'M6 6h4v4H6V6Zm8 0h4v4h-4V6Zm8 0h4v4h-4V6ZM6 14h4v4H6v-4Zm8 0h4v4h-4v-4Zm8 0h4v4h-4v-4ZM6 22h4v4H6v-4Zm8 0h4v4h-4v-4Zm8 0h4v4h-4v-4Z',
}

export default function Icon({ name, size = 16, strokeWidth = 2, className, style }) {
  const filled = name in fillPaths
  const d = filled ? fillPaths[name] : strokePaths[name]
  if (!d) throw new Error(`Unknown icon: ${name}`)
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}
