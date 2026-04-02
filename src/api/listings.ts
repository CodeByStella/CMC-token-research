import { cmcClient } from './client'
import type { CmcListingsResponse, ListingsLatestParams } from '../types/cmc'

export async function fetchListingsLatest(
  params: ListingsLatestParams,
): Promise<CmcListingsResponse> {
  const { data } = await cmcClient.get<CmcListingsResponse>(
    '/v1/cryptocurrency/listings/latest',
    { params },
  )
  return data
}
