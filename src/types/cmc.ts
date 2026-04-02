/** CoinMarketCap Pro API — cryptocurrency/listings/latest (subset). */

export interface CmcStatus {
  timestamp: string
  error_code: number
  error_message: string | null
}

export interface CmcQuoteEntry {
  price: number
  volume_24h: number
  market_cap: number
  percent_change_1h?: number
  percent_change_24h?: number
  percent_change_7d?: number
}

export type CmcQuoteMap = Record<string, CmcQuoteEntry>

export interface CmcListing {
  id: number
  name: string
  symbol: string
  slug: string
  cmc_rank: number
  /** ISO 8601 — used for client-side "listed after" filter. */
  date_added?: string
  quote: CmcQuoteMap
}

export interface CmcListingsResponse {
  data: CmcListing[]
  status: CmcStatus
}

/** v2/cryptocurrency/info — urls (arrays are common; some entries may be empty). */
export interface CmcUrls {
  website?: string[]
  twitter?: string[]
  chat?: string[]
  facebook?: string[]
  reddit?: string[]
  technical_doc?: string[]
  source_code?: string[]
  explorer?: string[]
  announcement?: string[]
  message_board?: string[]
}

export interface CmcInfoEntry {
  id: number
  urls?: CmcUrls
}

export interface CmcInfoResponse {
  data: Record<string, CmcInfoEntry>
  status: CmcStatus
}

export type ListingsSort =
  | 'market_cap'
  | 'name'
  | 'symbol'
  | 'volume_24h'
  | 'percent_change_24h'
  | 'percent_change_7d'
  | 'price'
  | 'circulating_supply'
  | 'date_added'

export interface ListingsLatestParams {
  start?: number
  limit?: number
  sort?: ListingsSort
  sort_dir?: 'asc' | 'desc'
  convert?: string
  cryptocurrency_type?: 'all' | 'coins' | 'tokens'
}
