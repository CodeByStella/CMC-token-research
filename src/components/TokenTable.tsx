import { useMemo } from 'react'
import type { CmcListing, CmcUrls, TokenMarkets } from '../types/cmc'
import { getQuote, type TableSortKey } from '../utils/sortListings'
import { TokenLinks } from './TokenLinks'

export type { TableSortKey } from '../utils/sortListings'

export interface TokenTableProps {
  rows: CmcListing[]
  convert: string
  sortKey: TableSortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: TableSortKey) => void
  urlsById: Record<number, CmcUrls | undefined>
  marketsById: Record<number, TokenMarkets | undefined>
}

function formatPrice(val: number | undefined, convert: string) {
  if (val == null) return '—'
  if (convert === 'BTC' || convert === 'ETH') {
    return `${val.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${convert}`
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: convert,
      maximumFractionDigits: 6,
    }).format(val)
  } catch {
    return `${val} ${convert}`
  }
}

const COLS: { key: TableSortKey; label: string }[] = [
  { key: 'cmc_rank', label: 'Rank' },
  { key: 'name', label: 'Name' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'price', label: 'Price' },
  { key: 'market_cap', label: 'Market cap' },
  { key: 'volume_24h', label: 'Vol 24h' },
  { key: 'percent_change_24h', label: 'Δ 24h' },
  { key: 'percent_change_7d', label: 'Δ 7d' },
]

export function TokenTable({
  rows,
  convert,
  sortKey,
  sortDir,
  onSort,
  urlsById,
  marketsById,
}: TokenTableProps) {
  const compact = useMemo(
    () => new Intl.NumberFormat(undefined, { notation: 'compact' }),
    [],
  )

  const pct = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: 2,
      }),
    [],
  )

  if (rows.length === 0) {
    return (
      <p className="table-empty" role="status">
        No rows to display. Adjust filters and search again.
      </p>
    )
  }

  return (
    <div className="table-wrap">
      <table className="token-table">
        <thead>
          <tr>
            {COLS.map(({ key, label }) => (
              <th key={key} scope="col">
                <button
                  type="button"
                  className={
                    sortKey === key ? 'th-btn th-btn--active' : 'th-btn'
                  }
                  onClick={() => onSort(key)}
                >
                  {label}
                  {sortKey === key ? (
                    <span className="th-btn__dir" aria-hidden>
                      {sortDir === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  ) : null}
                </button>
              </th>
            ))}
            <th scope="col" className="th-plain">
              Links
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const q = getQuote(row, convert)
            const price = formatPrice(q?.price, convert)
            return (
              <tr key={row.id}>
                <td>{row.cmc_rank}</td>
                <td>{row.name}</td>
                <td className="mono">{row.symbol}</td>
                <td className="num mono">{price}</td>
                <td className="num">{compact.format(q?.market_cap ?? 0)}</td>
                <td className="num">{compact.format(q?.volume_24h ?? 0)}</td>
                <td
                  className={`num ${
                    (q?.percent_change_24h ?? 0) >= 0 ? 'pos' : 'neg'
                  }`}
                >
                  {pct.format((q?.percent_change_24h ?? 0) / 100)}
                </td>
                <td
                  className={`num ${
                    (q?.percent_change_7d ?? 0) >= 0 ? 'pos' : 'neg'
                  }`}
                >
                  {q?.percent_change_7d != null
                    ? pct.format(q.percent_change_7d / 100)
                    : '—'}
                </td>
                <td className="link-cell">
                  <TokenLinks
                    urls={urlsById[row.id]}
                    markets={marketsById[row.id]}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
