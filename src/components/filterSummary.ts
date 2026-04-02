import type { ListingsSort } from '../types/cmc.ts'
import type { FilterFormState } from './filterTypes.ts'

const SORT_LABELS: Record<ListingsSort, string> = {
  market_cap: 'Market cap',
  volume_24h: 'Vol 24h',
  name: 'Name',
  symbol: 'Symbol',
  date_added: 'Date added',
  price: 'Price',
  percent_change_24h: 'Δ 24h',
  percent_change_7d: 'Δ 7d',
  circulating_supply: 'Circ. supply',
}

export function formatFilterSummary(value: FilterFormState): string {
  const sort = SORT_LABELS[value.sort] ?? value.sort
  const dir = value.sort_dir === 'desc' ? '↓' : '↑'
  const type =
    value.cryptocurrency_type === 'all'
      ? 'all types'
      : value.cryptocurrency_type
  const bits = [
    `${String(value.limit)} rows/page`,
    `${sort} ${dir}`,
    value.convert,
    type,
  ]
  if (value.text.trim()) bits.push(`name/symbol “${value.text.trim()}”`)
  if (value.minDateAdded.trim()) bits.push(`from ${value.minDateAdded}`)
  return bits.join(' · ')
}
