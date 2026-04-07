import type { ListingsSort } from '../types/cmc.ts'
import type { FilterFormState } from './filterTypes.ts'

const SORT_LABELS: Record<ListingsSort, string> = {
  market_cap: 'Mcap',
  market_cap_strict: 'Mcap strict',
  market_cap_by_total_supply_strict: 'Mcap by total supply',
  name: 'Name',
  symbol: 'Symbol',
  date_added: 'Added',
  price: 'Price',
  circulating_supply: 'Circ.',
  total_supply: 'Total sup.',
  max_supply: 'Max sup.',
  num_market_pairs: 'Pairs',
  volume_24h: 'Vol 24h',
  volume_7d: 'Vol 7d',
  volume_30d: 'Vol 30d',
  percent_change_1h: 'Δ 1h',
  percent_change_24h: 'Δ 24h',
  percent_change_7d: 'Δ 7d',
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
  if (value.minMcap.trim()) bits.push(`mcap≥${value.minMcap.trim()}`)
  if (value.maxMcap.trim()) bits.push(`mcap≤${value.maxMcap.trim()}`)
  if (value.minVol.trim()) bits.push(`vol≥${value.minVol.trim()} USD`)
  if (value.maxVol.trim()) bits.push(`vol≤${value.maxVol.trim()} USD`)
  if (value.text.trim()) bits.push(`name/symbol “${value.text.trim()}”`)
  if (value.minDateAdded.trim()) bits.push(`from ${value.minDateAdded}`)
  return bits.join(' · ')
}
