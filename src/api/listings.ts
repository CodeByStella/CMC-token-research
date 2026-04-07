import { cmcClient } from './client'
import type { CmcListingsResponse, ListingsLatestParams } from '../types/cmc'

/**
 * GET /v1/cryptocurrency/listings/latest
 *
 * Per CoinMarketCap Pro API reference (“Listings Latest” › query `aux`):
 * the default `aux` already includes `date_added`, so callers should not pass a
 * narrowed `aux` unless they merge the full default list — otherwise
 * supplemental fields may be dropped.
 *
 * @see https://coinmarketcap.com/api/documentation/pro-api-reference/cryptocurrency#listings-latest
 */
export async function fetchListingsLatest(
  params: ListingsLatestParams,
): Promise<CmcListingsResponse> {
  const { data } = await cmcClient.get<CmcListingsResponse>(
    '/v1/cryptocurrency/listings/latest',
    { params },
  )
  return data
}
