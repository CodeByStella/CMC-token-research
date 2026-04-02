import type { FilterFormState } from './filterTypes.ts'

export const defaultFilterState: FilterFormState = {
  limit: 50,
  sort: 'market_cap',
  sort_dir: 'desc',
  convert: 'USD',
  cryptocurrency_type: 'all',
  text: '',
  minMcap: '',
  maxMcap: '',
  minVol: '',
  maxVol: '',
  minDateAdded: '',
}
