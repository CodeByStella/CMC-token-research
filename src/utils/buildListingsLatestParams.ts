import type { FilterFormState } from '../components/filterTypes.ts'
import type { ListingsLatestParams, ListingsSort } from '../types/cmc'
import { parseOptNumber } from './parseOptNumber'

/**
 * Builds query params for `GET /v1/cryptocurrency/listings/latest` from the
 * filter form. Field names match the CoinMarketCap “Listings Latest” reference.
 *
 * @see https://coinmarketcap.com/api/documentation/pro-api-reference/cryptocurrency#listings-latest
 */
export function buildListingsLatestParams(
  filters: FilterFormState,
  pageNum: number,
): ListingsLatestParams {
  const start = (pageNum - 1) * filters.limit + 1
  const listedAfterUtcDay = filters.minDateAdded.trim() !== ''
  const listingsSort: ListingsSort = listedAfterUtcDay
    ? 'date_added'
    : filters.sort
  const listingsSortDir =
    listedAfterUtcDay && filters.sort !== 'date_added'
      ? 'desc'
      : filters.sort_dir

  const params: ListingsLatestParams = {
    start,
    limit: filters.limit,
    sort: listingsSort,
    sort_dir: listingsSortDir,
    convert: filters.convert,
    cryptocurrency_type: filters.cryptocurrency_type,
  }

  const minMcap = parseOptNumber(filters.minMcap)
  const maxMcap = parseOptNumber(filters.maxMcap)
  const minVol = parseOptNumber(filters.minVol)
  const maxVol = parseOptNumber(filters.maxVol)
  if (minMcap != null) params.market_cap_min = minMcap
  if (maxMcap != null) params.market_cap_max = maxMcap
  if (minVol != null) params.volume_24h_min = minVol
  if (maxVol != null) params.volume_24h_max = maxVol

  return params
}
