import type { CmcListing } from '../types/cmc'

export interface ClientFilterOptions {
  text: string
  /** Quote key for `row.quote[convert]` — rows without this quote are dropped. */
  convert: string
  /** `YYYY-MM-DD` — keep rows with date_added on or after this day (UTC start). */
  minDateAdded: string | undefined
}

function parseDayStartUtc(isoDate: string): number {
  const d = new Date(`${isoDate}T00:00:00.000Z`)
  return d.getTime()
}

export function filterListings(
  rows: CmcListing[],
  opts: ClientFilterOptions,
): CmcListing[] {
  const t = opts.text.trim().toLowerCase()
  const minAdded =
    opts.minDateAdded != null && opts.minDateAdded.length > 0
      ? parseDayStartUtc(opts.minDateAdded)
      : null

  return rows.filter((row) => {
    if (t) {
      const n = row.name.toLowerCase()
      const s = row.symbol.toLowerCase()
      if (!n.includes(t) && !s.includes(t)) return false
    }
    if (minAdded != null) {
      if (!row.date_added) return false
      const rowT = new Date(row.date_added).getTime()
      if (!Number.isFinite(rowT) || rowT < minAdded) return false
    }
    const q = row.quote[opts.convert] ?? row.quote['USD']
    if (!q) return false
    return true
  })
}
