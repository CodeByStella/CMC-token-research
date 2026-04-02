import type { ListingsSort } from '../types/cmc'
import type { FilterFormState } from './filterTypes.ts'

const SORT_OPTIONS: { value: ListingsSort; label: string }[] = [
  { value: 'market_cap', label: 'Market cap' },
  { value: 'volume_24h', label: 'Volume 24h' },
  { value: 'name', label: 'Name' },
  { value: 'symbol', label: 'Symbol' },
  { value: 'date_added', label: 'Date added' },
  { value: 'price', label: 'Price' },
  { value: 'percent_change_24h', label: 'Change 24h' },
  { value: 'percent_change_7d', label: 'Change 7d' },
  { value: 'circulating_supply', label: 'Circulating supply' },
]

const CONVERT_OPTIONS = ['USD', 'EUR', 'GBP', 'JPY', 'BTC', 'ETH']

export interface FilterPanelProps {
  value: FilterFormState
  onChange: (next: FilterFormState) => void
  onSearch: () => void
  loading: boolean
  /** When false, Search is disabled (no API key saved). */
  canSearch: boolean
}

export function FilterPanel({
  value,
  onChange,
  onSearch,
  loading,
  canSearch,
}: FilterPanelProps) {
  const patch = (partial: Partial<FilterFormState>) =>
    onChange({ ...value, ...partial })

  return (
    <section className="filter-panel" aria-label="Search filters">
      <div className="filter-panel__header">
        <h1 className="filter-panel__title">CMC token search</h1>
        <p className="filter-panel__hint">
          Listings use CoinMarketCap pagination (limit + page at bottom). Name,
          numeric, and date filters apply to the current page in the browser.
          Link metadata loads in small batches (~30 requests/minute on Basic).
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
          Uses <code>date_added</code> from the listing. Only filters assets on
          this page, not the full CMC database.
        </p>
        <label className="field">
          <span>Min market cap</span>
          <input
            type="number"
            min={0}
            placeholder="optional"
            value={value.minMcap}
            onChange={(e) => patch({ minMcap: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Max market cap</span>
          <input
            type="number"
            min={0}
            placeholder="optional"
            value={value.maxMcap}
            onChange={(e) => patch({ maxMcap: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Min volume 24h</span>
          <input
            type="number"
            min={0}
            placeholder="optional"
            value={value.minVol}
            onChange={(e) => patch({ minVol: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Max volume 24h</span>
          <input
            type="number"
            min={0}
            placeholder="optional"
            value={value.maxVol}
            onChange={(e) => patch({ maxVol: e.target.value })}
          />
        </label>
      </fieldset>

      <div className="filter-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onSearch}
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
