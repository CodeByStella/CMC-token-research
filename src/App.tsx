import { useCallback, useMemo, useState } from 'react'
import { fetchUrlsByIds } from './api/info'
import { fetchListingsLatest } from './api/listings'
import { fetchMarketPairsForIds } from './api/marketPairs'
import { FilterPanel } from './components/FilterPanel'
import { defaultFilterState } from './components/filterDefaults'
import type { FilterFormState } from './components/filterTypes'
import { TokenTable } from './components/TokenTable'
import type { CmcListing, CmcUrls, TokenMarkets } from './types/cmc'
import {
  buildCmcListingsCsv,
  defaultCsvFilename,
  downloadCsvFile,
} from './utils/csvExport'
import { filterListings } from './utils/filterListings'
import { type TableSortKey, sortCmcListings } from './utils/sortListings'
import './App.css'
import axios from 'axios'

function parseOptNumber(s: string): number | undefined {
  const t = s.trim()
  if (t === '') return undefined
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}

interface TableSortState {
  key: TableSortKey
  dir: 'asc' | 'desc'
}

function App() {
  const [filters, setFilters] = useState<FilterFormState>(defaultFilterState)
  const [rawRows, setRawRows] = useState<CmcListing[]>([])
  const [urlsById, setUrlsById] = useState<Record<number, CmcUrls | undefined>>(
    {},
  )
  const [marketsById, setMarketsById] = useState<
    Record<number, TokenMarkets | undefined>
  >({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tableSort, setTableSort] = useState<TableSortState>({
    key: 'cmc_rank',
    dir: 'asc',
  })

  const clientOpts = useMemo(
    () => ({
      text: filters.text,
      minMcap: parseOptNumber(filters.minMcap),
      maxMcap: parseOptNumber(filters.maxMcap),
      minVol: parseOptNumber(filters.minVol),
      maxVol: parseOptNumber(filters.maxVol),
      convert: filters.convert,
    }),
    [
      filters.text,
      filters.minMcap,
      filters.maxMcap,
      filters.minVol,
      filters.maxVol,
      filters.convert,
    ],
  )

  const filteredRows = useMemo(
    () => filterListings(rawRows, clientOpts),
    [rawRows, clientOpts],
  )

  const sortedRows = useMemo(
    () =>
      sortCmcListings(
        filteredRows,
        tableSort.key,
        tableSort.dir,
        filters.convert,
      ),
    [filteredRows, tableSort.key, tableSort.dir, filters.convert],
  )

  const handleExportCsv = useCallback(() => {
    const csv = buildCmcListingsCsv(
      sortedRows,
      filters.convert,
      urlsById,
      marketsById,
    )
    downloadCsvFile(defaultCsvFilename(), csv)
  }, [sortedRows, filters.convert, urlsById, marketsById])

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchListingsLatest({
        start: filters.start,
        limit: filters.limit,
        sort: filters.sort,
        sort_dir: filters.sort_dir,
        convert: filters.convert,
        cryptocurrency_type: filters.cryptocurrency_type,
      })
      if (res.status.error_code !== 0) {
        setError(
          res.status.error_message ??
            `API error (code ${String(res.status.error_code)})`,
        )
        setRawRows([])
        setUrlsById({})
        setMarketsById({})
        return
      }
      const rows = res.data ?? []
      setRawRows(rows)

      try {
        const ids = rows.map((r) => r.id)
        const [urls, markets] = await Promise.all([
          fetchUrlsByIds(ids),
          fetchMarketPairsForIds(ids),
        ])
        setUrlsById(urls)
        setMarketsById(markets)
      } catch {
        setUrlsById({})
        setMarketsById({})
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as
          | { status?: { error_message?: string } }
          | undefined
        setError(data?.status?.error_message ?? e.message)
      } else {
        setError(e instanceof Error ? e.message : 'Request failed')
      }
      setRawRows([])
      setUrlsById({})
      setMarketsById({})
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleTableSort = useCallback((key: TableSortKey) => {
    setTableSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          dir: prev.dir === 'asc' ? 'desc' : 'asc',
        }
      }
      const isText = key === 'name' || key === 'symbol'
      return {
        key,
        dir: isText ? 'asc' : 'desc',
      }
    })
  }, [])

  return (
    <div className="app">
      <FilterPanel
        value={filters}
        onChange={setFilters}
        onSearch={() => void handleSearch()}
        loading={loading}
      />

      {error ? (
        <div className="banner banner--error" role="alert">
          {error}
        </div>
      ) : null}

      <section className="results" aria-live="polite">
        <div className="results__head">
          <h2 className="results__title">Results</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportCsv}
            disabled={sortedRows.length === 0}
          >
            Export CSV
          </button>
        </div>
        <p className="results__meta">
          Showing {filteredRows.length} row
          {filteredRows.length === 1 ? '' : 's'}
          {rawRows.length ? ` (from ${String(rawRows.length)} fetched)` : ''}
          {Object.keys(urlsById).length > 0 ||
          Object.keys(marketsById).length > 0
            ? ' · Links & markets from CoinMarketCap'
            : null}
        </p>
        <TokenTable
          rows={sortedRows}
          convert={filters.convert}
          sortKey={tableSort.key}
          sortDir={tableSort.dir}
          onSort={handleTableSort}
          urlsById={urlsById}
          marketsById={marketsById}
        />
      </section>
    </div>
  )
}

export default App
