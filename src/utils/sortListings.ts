import type { CmcListing } from '../types/cmc'

export type TableSortKey =
  | 'cmc_rank'
  | 'name'
  | 'symbol'
  | 'price'
  | 'market_cap'
  | 'volume_24h'
  | 'percent_change_24h'
  | 'percent_change_7d'

export function getQuote(row: CmcListing, convert: string) {
  return row.quote[convert] ?? row.quote['USD']
}

function compare(
  a: CmcListing,
  b: CmcListing,
  key: TableSortKey,
  convert: string,
): number {
  const qa = getQuote(a, convert)
  const qb = getQuote(b, convert)
  let va: string | number = 0
  let vb: string | number = 0
  switch (key) {
    case 'cmc_rank':
      va = a.cmc_rank
      vb = b.cmc_rank
      break
    case 'name':
      va = a.name.toLowerCase()
      vb = b.name.toLowerCase()
      break
    case 'symbol':
      va = a.symbol.toLowerCase()
      vb = b.symbol.toLowerCase()
      break
    case 'price':
      va = qa?.price ?? 0
      vb = qb?.price ?? 0
      break
    case 'market_cap':
      va = qa?.market_cap ?? 0
      vb = qb?.market_cap ?? 0
      break
    case 'volume_24h':
      va = qa?.volume_24h ?? 0
      vb = qb?.volume_24h ?? 0
      break
    case 'percent_change_24h':
      va = qa?.percent_change_24h ?? 0
      vb = qb?.percent_change_24h ?? 0
      break
    case 'percent_change_7d':
      va = qa?.percent_change_7d ?? 0
      vb = qb?.percent_change_7d ?? 0
      break
    default:
      return 0
  }
  if (typeof va === 'string' && typeof vb === 'string') {
    return va.localeCompare(vb)
  }
  return (va as number) - (vb as number)
}

export function sortCmcListings(
  rows: CmcListing[],
  sortKey: TableSortKey,
  sortDir: 'asc' | 'desc',
  convert: string,
): CmcListing[] {
  const out = [...rows]
  out.sort((a, b) => {
    const c = compare(a, b, sortKey, convert)
    return sortDir === 'asc' ? c : -c
  })
  return out
}
