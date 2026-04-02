import type { FilterFormState } from './filterTypes'

export const defaultFilterState: FilterFormState = {
  start: 1,
  limit: 100,
  sort: 'market_cap',
  sort_dir: 'desc',
  convert: 'USD',
  cryptocurrency_type: 'all',
  text: '',
  minMcap: '',
  maxMcap: '',
  minVol: '',
  maxVol: '',
}
