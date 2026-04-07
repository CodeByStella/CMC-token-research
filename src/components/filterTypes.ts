import type { ListingsSort } from '../types/cmc.ts'

export interface FilterFormState {
  limit: number
  sort: ListingsSort
  sort_dir: 'asc' | 'desc'
  convert: string
  cryptocurrency_type: 'all' | 'coins' | 'tokens'
  text: string
  /** Maps to API `market_cap_min` / `market_cap_max`. */
  minMcap: string
  maxMcap: string
  /** Maps to API `volume_24h_min` / `volume_24h_max` (USD per CMC reference). */
  minVol: string
  maxVol: string
  /** `YYYY-MM-DD` or empty — list only assets with date_added on or after this day (current page). */
  minDateAdded: string
}
