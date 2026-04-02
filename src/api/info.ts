import { cmcClient } from './client'
import type { CmcInfoResponse, CmcUrls } from '../types/cmc'

/** CMC caps batch size; smaller chunks stay within limits. */
const ID_CHUNK = 80

/**
 * Loads website / social URLs for the given CoinMarketCap asset IDs (v2/info).
 */
export async function fetchUrlsByIds(
  ids: number[],
): Promise<Record<number, CmcUrls | undefined>> {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))]
  const out: Record<number, CmcUrls | undefined> = {}

  for (let i = 0; i < unique.length; i += ID_CHUNK) {
    const chunk = unique.slice(i, i + ID_CHUNK)
    const { data } = await cmcClient.get<CmcInfoResponse>(
      '/v2/cryptocurrency/info',
      { params: { id: chunk.join(',') } },
    )
    if (data.status.error_code !== 0) continue
    const entries = data.data ?? {}
    for (const [key, entry] of Object.entries(entries)) {
      const id = Number(key)
      if (!Number.isFinite(id)) continue
      out[id] = entry.urls
    }
  }
  return out
}
