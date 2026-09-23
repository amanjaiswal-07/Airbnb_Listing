// Split a section's photos into rows: repeat [full, pair]; a trailing 2 is a pair, a trailing 1 is full.
export function layoutRows(items) {
  const rows = []
  for (let i = 0; i < items.length; ) {
    const left = items.length - i
    if (left === 2 || (rows.length && rows[rows.length - 1].length === 1 && left >= 2)) {
      rows.push(items.slice(i, i + 2))
      i += 2
    } else {
      rows.push([items[i]])
      i += 1
    }
  }
  return rows
}
