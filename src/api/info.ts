import axios from 'axios'
import { cmcClient } from './client'
import type { CmcInfoResponse, CmcUrls } from '../types/cmc'
import { CMC_BASIC_MIN_INTERVAL_MS, sleep } from '../utils/cmcRateLimit'

/** Fewer IDs per request = finer per-row loading; each request still counts toward rate limit. */
const ID_CHUNK = 5

const MAX_RETRIES = 4

async function getInfoChunk(
  chunk: number[],
): Promise<Record<number, CmcUrls | undefined>> {
  const out: Record<number, CmcUrls | undefined> = {}
  let attempt = 0
  while (attempt < MAX_RETRIES) {
    try {
      const { data } = await cmcClient.get<CmcInfoResponse>(
        '/v2/cryptocurrency/info',
        { params: { id: chunk.join(',') } },
      )
      if (data.status.error_code !== 0) return out
      const entries = data.data ?? {}
      for (const [key, entry] of Object.entries(entries)) {
        const id = Number(key)
        if (!Number.isFinite(id)) continue
        out[id] = entry.urls
      }
      return out
    } catch (e: unknown) {
      const status = axios.isAxiosError(e) ? e.response?.status : 0
      attempt += 1
      if (status === 429 && attempt < MAX_RETRIES) {
        await sleep(5000 * attempt)
        continue
      }
      throw e
    }
  }
  return {}
}

export interface FetchUrlsProgressiveOptions {
  signal?: AbortSignal
}

/**
 * Loads v2/info in small chunks, waiting between requests for Basic plan rate limits.
 * Invokes onChunk after each successful chunk (merge in the caller).
 */
export async function fetchUrlsByIdsProgressive(
  ids: number[],
  onChunk: (
    partial: Record<number, CmcUrls | undefined>,
    chunkIds: number[],
  ) => void,
  options?: FetchUrlsProgressiveOptions,
): Promise<void> {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))]
  let lastEnd = 0

  for (let i = 0; i < unique.length; i += ID_CHUNK) {
    if (options?.signal?.aborted) return

    const chunkIds = unique.slice(i, i + ID_CHUNK)
    const elapsed = Date.now() - lastEnd
    const needGap =
      lastEnd === 0
        ? true
        : elapsed < CMC_BASIC_MIN_INTERVAL_MS
    if (needGap) {
      const wait =
        lastEnd === 0
          ? CMC_BASIC_MIN_INTERVAL_MS
          : CMC_BASIC_MIN_INTERVAL_MS - elapsed
      await sleep(wait)
    }
    if (options?.signal?.aborted) return

    const partial = await getInfoChunk(chunkIds)
    lastEnd = Date.now()
    onChunk(partial, chunkIds)
  }
}
