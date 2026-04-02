import { useCallback, useMemo, useRef, useState } from 'react'
import { fetchUrlsByIdsProgressive } from './api/info'
import { fetchListingsLatest } from './api/listings'
import { ApiKeyBar } from './components/ApiKeyBar'
import { FilterPanel } from './components/FilterPanel'
import { defaultFilterState } from './components/filterDefaults'
import type { FilterFormState } from './components/filterTypes.ts'
import { TokenTable } from './components/TokenTable'
import type { CmcListing, CmcUrls } from './types/cmc'
import {
  buildCmcListingsCsv,
  defaultCsvFilename,
  downloadCsvFile,
} from './utils/csvExport'
import { getStoredApiKey } from './utils/apiKeyStorage'
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
  const [hasApiKey, setHasApiKey] = useState(
    () => typeof window !== 'undefined' && !!getStoredApiKey(),
  )
  const [filters, setFilters] = useState<FilterFormState>(defaultFilterState)
  const [page, setPage] = useState(1)
  const [rawRows, setRawRows] = useState<CmcListing[]>([])
  const [urlsById, setUrlsById] = useState<Record<number, CmcUrls | undefined>>(
    {},
  )
  const [infoLoadingById, setInfoLoadingById] = useState<
    Record<number, boolean | undefined>
  >({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const infoAbortRef = useRef<AbortController | null>(null)

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
      minDateAdded:
        filters.minDateAdded.trim() === ''
          ? undefined
          : filters.minDateAdded.trim(),
    }),
    [
      filters.text,
      filters.minMcap,
      filters.maxMcap,
      filters.minVol,
      filters.maxVol,
      filters.convert,
      filters.minDateAdded,
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
    const csv = buildCmcListingsCsv(sortedRows, filters.convert, urlsById)
    downloadCsvFile(defaultCsvFilename(), csv)
  }, [sortedRows, filters.convert, urlsById])

  const loadListings = useCallback(
    async (pageNum: number) => {
      if (!getStoredApiKey()) return
      infoAbortRef.current?.abort()
      const ac = new AbortController()
      infoAbortRef.current = ac

      setLoading(true)
      setError(null)
      setUrlsById({})
      setInfoLoadingById({})

      const start = (pageNum - 1) * filters.limit + 1

      try {
        const res = await fetchListingsLatest({
          start,
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
          setLoading(false)
          return
        }
        const rows = res.data ?? []
        setRawRows(rows)
        setPage(pageNum)

        const ids = rows.map((r) => r.id)
        const loadingInit: Record<number, boolean> = {}
        for (const id of ids) loadingInit[id] = true
        setInfoLoadingById(loadingInit)

        setLoading(false)

        try {
          await fetchUrlsByIdsProgressive(
            ids,
            (partial, chunkIds) => {
              if (ac.signal.aborted) return
              setUrlsById((prev) => ({ ...prev, ...partial }))
              setInfoLoadingById((prev) => {
                const next = { ...prev }
                for (const id of chunkIds) next[id] = false
                return next
              })
            },
            { signal: ac.signal },
          )
        } catch {
          if (!ac.signal.aborted) {
            setInfoLoadingById({})
          }
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
        setInfoLoadingById({})
        setLoading(false)
      }
    },
    [filters],
  )

  const handleSearchFromFilters = useCallback(() => {
    void loadListings(1)
  }, [loadListings])

  const handlePrevPage = useCallback(() => {
    if (!hasApiKey || page <= 1 || loading) return
    void loadListings(page - 1)
  }, [hasApiKey, page, loading, loadListings])

  const handleNextPage = useCallback(() => {
    if (!hasApiKey || loading) return
    if (rawRows.length < filters.limit) return
    void loadListings(page + 1)
  }, [hasApiKey, page, loading, loadListings, rawRows.length, filters.limit])

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

  const canGoNext = rawRows.length >= filters.limit
  const canGoPrev = page > 1

  return (
    <div className="app">
      <ApiKeyBar onKeyChange={setHasApiKey} />
      <FilterPanel
        value={filters}
        onChange={setFilters}
        onSearch={handleSearchFromFilters}
        loading={loading}
        canSearch={hasApiKey}
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
          Page {String(page)} · {filteredRows.length} row
          {filteredRows.length === 1 ? '' : 's'} after client filters
          {rawRows.length
            ? ` (${String(rawRows.length)} from API)`
            : ''}
        </p>
        <TokenTable
          rows={sortedRows}
          convert={filters.convert}
          sortKey={tableSort.key}
          sortDir={tableSort.dir}
          onSort={handleTableSort}
          urlsById={urlsById}
          infoLoadingById={infoLoadingById}
        />

        <nav className="pagination" aria-label="Pagination">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrevPage}
            disabled={!hasApiKey || !canGoPrev || loading}
          >
            Previous
          </button>
          <span className="pagination__status">
            Page {String(page)}
            {!canGoNext && rawRows.length > 0 ? ' (last page)' : ''}
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleNextPage}
            disabled={!hasApiKey || !canGoNext || loading}
          >
            Next
          </button>
        </nav>
      </section>
    </div>
  )
}

export default App
