import type { ListingsSort } from '../types/cmc.ts'

export interface FilterFormState {
  limit: number
  sort: ListingsSort
  sort_dir: 'asc' | 'desc'
  convert: string
  cryptocurrency_type: 'all' | 'coins' | 'tokens'
  text: string
  minMcap: string
  maxMcap: string
  minVol: string
  maxVol: string
  /** `YYYY-MM-DD` or empty — list only assets with date_added on or after this day (current page). */
  minDateAdded: string
}
