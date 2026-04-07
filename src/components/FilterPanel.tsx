import { CMC_LISTINGS_LATEST_DOC_HREF } from '../config/cmcListingsLatestDoc'
import type { ListingsSort } from '../types/cmc'
import type { FilterFormState } from './filterTypes.ts'
import { formatFilterSummary } from './filterSummary.ts'

/** Mirrors “Listings Latest” › `sort` enum / prose sort fields (same doc page). */
const SORT_OPTIONS: { value: ListingsSort; label: string }[] = [
  { value: 'market_cap', label: 'Market cap' },
  { value: 'market_cap_strict', label: 'Market cap (strict)' },
  {
    value: 'market_cap_by_total_supply_strict',
    label: 'Market cap by total supply (strict)',
  },
  { value: 'name', label: 'Name' },
  { value: 'symbol', label: 'Symbol' },
  { value: 'date_added', label: 'Date added' },
  { value: 'price', label: 'Price' },
  { value: 'circulating_supply', label: 'Circulating supply' },
  { value: 'total_supply', label: 'Total supply' },
  { value: 'max_supply', label: 'Max supply' },
  { value: 'num_market_pairs', label: 'Market pairs' },
  { value: 'volume_24h', label: 'Volume 24h' },
  { value: 'volume_7d', label: 'Volume 7d' },
  { value: 'volume_30d', label: 'Volume 30d' },
  { value: 'percent_change_1h', label: 'Change 1h' },
  { value: 'percent_change_24h', label: 'Change 24h' },
  { value: 'percent_change_7d', label: 'Change 7d' },
]

const CONVERT_OPTIONS = ['USD', 'EUR', 'GBP', 'JPY', 'BTC', 'ETH']

export interface FilterPanelProps {
  value: FilterFormState
  onChange: (next: FilterFormState) => void
  onSearch: () => void | Promise<void>
  loading: boolean
  /** When false, Search is disabled (no API key saved). */
  canSearch: boolean
  collapsed: boolean
  onExpand: () => void
}

export function FilterPanel({
  value,
  onChange,
  onSearch,
  loading,
  canSearch,
  collapsed,
  onExpand,
}: FilterPanelProps) {
  const patch = (partial: Partial<FilterFormState>) =>
    onChange({ ...value, ...partial })

  if (collapsed) {
    return (
      <section
        className="collapsible-bar collapsible-bar--filters"
        aria-label="Search filters (collapsed)"
      >
        <div className="collapsible-bar__summary-wrap">
          <span className="collapsible-bar__label">Filters</span>
          <span className="collapsible-bar__summary" title={formatFilterSummary(value)}>
            {formatFilterSummary(value)}
          </span>
        </div>
        <button type="button" className="btn-secondary" onClick={onExpand}>
          Edit
        </button>
      </section>
    )
  }

  return (
    <section className="filter-panel" aria-label="Search filters">
      <div className="filter-panel__header">
        <h1 className="filter-panel__title">CMC token search</h1>
        <p className="filter-panel__hint">
          Requests use{' '}
          <code>GET /v1/cryptocurrency/listings/latest</code> (
          <a
            href={CMC_LISTINGS_LATEST_DOC_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            official reference
          </a>
          ). Sort, limit, asset type, and min/max market cap &amp; volume are
          sent as query parameters. Name/symbol and listed-after date narrow
          rows in the browser. Link metadata loads in small batches (~30
          requests/minute on Basic).
        </p>
      </div>

      <fieldset className="filter-grid">
        <legend className="filter-grid__legend">API parameters</legend>
        <label className="field">
          <span>Rows per page</span>
          <input
            type="number"
            min={1}
            max={5000}
            value={value.limit}
            onChange={(e) =>
              patch({
                limit: Math.min(5000, Math.max(1, Number(e.target.value) || 1)),
              })
            }
          />
        </label>
        <label className="field">
          <span>Sort by</span>
          <select
            value={value.sort}
            onChange={(e) => patch({ sort: e.target.value as ListingsSort })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Direction</span>
          <select
            value={value.sort_dir}
            onChange={(e) =>
              patch({ sort_dir: e.target.value as 'asc' | 'desc' })
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
        <label className="field">
          <span>Quote currency</span>
          <select
            value={value.convert}
            onChange={(e) => patch({ convert: e.target.value })}
          >
            {CONVERT_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Asset type</span>
          <select
            value={value.cryptocurrency_type}
            onChange={(e) =>
              patch({
                cryptocurrency_type: e.target.value as
                  | 'all'
                  | 'coins'
                  | 'tokens',
              })
            }
          >
            <option value="all">All</option>
            <option value="coins">Coins</option>
            <option value="tokens">Tokens</option>
          </select>
        </label>
        <label className="field">
          <span>Min market cap</span>
          <input
            type="number"
            min={0}
            placeholder="market_cap_min"
            value={value.minMcap}
            onChange={(e) => patch({ minMcap: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Max market cap</span>
          <input
            type="number"
            min={0}
            placeholder="market_cap_max"
            value={value.maxMcap}
            onChange={(e) => patch({ maxMcap: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Min volume 24h (USD)</span>
          <input
            type="number"
            min={0}
            placeholder="volume_24h_min"
            value={value.minVol}
            onChange={(e) => patch({ minVol: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Max volume 24h (USD)</span>
          <input
            type="number"
            min={0}
            placeholder="volume_24h_max"
            value={value.maxVol}
            onChange={(e) => patch({ maxVol: e.target.value })}
          />
        </label>
        <p className="field-hint field--wide">
          Market cap uses the API parameters <code>market_cap_min</code> /{' '}
          <code>market_cap_max</code> (“threshold of minimum/maximum market cap
          to filter results by”). 24h volume uses{' '}
          <code>volume_24h_min</code> / <code>volume_24h_max</code>; the
          reference explicitly describes these as <strong>USD</strong> volume
          thresholds. They are applied by CoinMarketCap before pagination.
        </p>
      </fieldset>

      <fieldset className="filter-grid filter-grid--client">
        <legend className="filter-grid__legend">Client filters</legend>
        <label className="field field--wide">
          <span>Name or symbol contains</span>
          <input
            type="text"
            placeholder="e.g. bit or BTC"
            value={value.text}
            onChange={(e) => patch({ text: e.target.value })}
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span>Listed on or after (UTC day)</span>
          <input
            type="date"
            value={value.minDateAdded}
            onChange={(e) => patch({ minDateAdded: e.target.value })}
          />
        </label>
        <p className="field-hint field--wide">
          Uses <code>date_added</code> from each row (included in the API default{' '}
          <code>aux</code> for listings/latest). While this date is set, Search
          uses CoinMarketCap <code>sort=date_added</code> (newest first when
          sort was not already “Date added”) so the current page contains
          recently listed assets; the date still narrows rows on this page only.
        </p>
      </fieldset>

      <div className="filter-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => void onSearch()}
          disabled={loading || !canSearch}
          title={
            !canSearch ? 'Save your CoinMarketCap API key above first' : undefined
          }
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </section>
  )
}
