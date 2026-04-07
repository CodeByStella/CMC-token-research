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

/**
 * `sort` values for `/v1/cryptocurrency/listings/latest` (see “Listings Latest”
 * › `sort` and the prose list of fields you may sort by).
 *
 * @see https://coinmarketcap.com/api/documentation/pro-api-reference/cryptocurrency#listings-latest
 */
export type ListingsSort =
  | 'market_cap'
  | 'market_cap_strict'
  | 'market_cap_by_total_supply_strict'
  | 'name'
  | 'symbol'
  | 'date_added'
  | 'price'
  | 'circulating_supply'
  | 'total_supply'
  | 'max_supply'
  | 'num_market_pairs'
  | 'volume_24h'
  | 'volume_7d'
  | 'volume_30d'
  | 'percent_change_1h'
  | 'percent_change_24h'
  | 'percent_change_7d'

export interface ListingsLatestParams {
  start?: number
  limit?: number
  /** Doc: “Optionally specify a threshold of minimum market cap to filter results by.” */
  market_cap_min?: number
  /** Doc: “Optionally specify a threshold of maximum market cap to filter results by.” */
  market_cap_max?: number
  /**
   * Doc: “Optionally specify a threshold of minimum **24 hour USD volume** to filter results by.”
   */
  volume_24h_min?: number
  /**
   * Doc: “Optionally specify a threshold of maximum **24 hour USD volume** to filter results by.”
   */
  volume_24h_max?: number
  sort?: ListingsSort
  sort_dir?: 'asc' | 'desc'
  convert?: string
  cryptocurrency_type?: 'all' | 'coins' | 'tokens'
  /** Doc: enum `all` | `defi` | `filesharing`. */
  tag?: 'all' | 'defi' | 'filesharing'
  /** Supplemental fields (comma-separated). Default API behavior already includes `date_added`; omit unless you need a custom set per CMC docs. */
  aux?: string
}
