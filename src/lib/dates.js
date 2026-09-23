// Date helpers working on local-midnight Date objects and 'YYYY-MM-DD' keys.

export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1)

export const nightsBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86_400_000)

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const SHORT_MONTHS = MONTHS.map((m) => m.slice(0, 3))

export const monthLabel = (d) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`

// "18 Oct 2026"
export const shortDate = (key) => {
  const d = fromKey(key)
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// "10/18/2026" (booking card inputs)
export const slashDate = (key) => {
  const d = fromKey(key)
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

// "Sunday, 18 October 2026" (screen-reader labels)
export const longDate = (d) =>
  d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Weeks for a month grid: arrays of 7 (Date | null), Sunday first.
export const monthMatrix = (month) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = Array(first.getDay()).fill(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(month.getFullYear(), month.getMonth(), day))
  while (cells.length % 7) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}
