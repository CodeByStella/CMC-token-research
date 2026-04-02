import type { ListingsSort } from '../types/cmc'

export interface FilterFormState {
  start: number
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
}
