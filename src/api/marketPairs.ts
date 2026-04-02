import { cmcClient } from './client'
import type { CmcStatus, MarketLink, TokenMarkets } from '../types/cmc'

/** Raw pair from /v2/cryptocurrency/market-pairs/latest (subset). */
interface RawMarketPair {
  market_pair?: string
  market_url?: string
  category?: string
  exchange?: {
    id?: number
    name?: string
    slug?: string
    logo?: string
    category?: string
  }
}

interface MarketPairsPayload {
  id?: number
  market_pairs?: RawMarketPair[]
}

interface MarketPairsResponse {
  data: Record<string, MarketPairsPayload> | MarketPairsPayload
  status: CmcStatus
}

const KNOWN_DEX_SLUG_PARTS = [
  'uniswap',
  'pancakeswap',
  'sushiswap',
  'curve',
  'raydium',
  'orca',
  'balancer',
  'trader-joe',
  'aerodrome',
  'quickswap',
  'camelot',
  'dydx',
  'osmosis',
  'sunswap',
]

const MAX_PER_SIDE = 6
const PAIRS_FETCH_LIMIT = 50
const CONCURRENCY = 5

function isLikelyDex(pair: RawMarketPair): boolean {
  const cat = `${pair.category ?? ''} ${pair.exchange?.category ?? ''}`.toLowerCase()
  if (cat.includes('dex')) return true
  const slug = (pair.exchange?.slug ?? '').toLowerCase()
  if (slug.includes('dex')) return true
  return KNOWN_DEX_SLUG_PARTS.some((p) => slug.includes(p))
}

function toMarketLink(pair: RawMarketPair): MarketLink | null {
  const url =
    typeof pair.market_url === 'string' && /^https?:\/\//i.test(pair.market_url)
      ? pair.market_url
      : undefined
  if (!url) return null
  const name =
    pair.exchange?.name?.trim() ||
    pair.market_pair?.trim() ||
    'Exchange'
  return {
    url,
    exchangeName: name,
    exchangeSlug: pair.exchange?.slug,
    logoUrl:
      typeof pair.exchange?.logo === 'string' ? pair.exchange.logo : undefined,
    pairLabel: pair.market_pair,
  }
}

function dedupeByUrl(links: MarketLink[]): MarketLink[] {
  const seen = new Set<string>()
  const out: MarketLink[] = []
  for (const l of links) {
    const k = l.url.split('?')[0] ?? l.url
    if (seen.has(k)) continue
    seen.add(k)
    out.push(l)
  }
  return out
}

function parsePayload(payload: MarketPairsPayload | undefined): TokenMarkets {
  const pairs = payload?.market_pairs ?? []
  const dex: MarketLink[] = []
  const cex: MarketLink[] = []

  for (const p of pairs) {
    const link = toMarketLink(p)
    if (!link) continue
    if (isLikelyDex(p)) dex.push(link)
    else cex.push(link)
  }

  return {
    dex: dedupeByUrl(dex).slice(0, MAX_PER_SIDE),
    cex: dedupeByUrl(cex).slice(0, MAX_PER_SIDE),
  }
}

function extractPayload(
  data: MarketPairsResponse['data'],
): MarketPairsPayload | undefined {
  if (!data || typeof data !== 'object') return undefined
  if (
    'market_pairs' in data &&
    Array.isArray((data as MarketPairsPayload).market_pairs)
  ) {
    return data as MarketPairsPayload
  }
  const values = Object.values(data as Record<string, MarketPairsPayload>)
  return values.find(
    (v) =>
      v &&
      typeof v === 'object' &&
      Array.isArray((v as MarketPairsPayload).market_pairs),
  ) as MarketPairsPayload | undefined
}

async function fetchMarketPairsForOneId(id: number): Promise<TokenMarkets | undefined> {
  const { data } = await cmcClient.get<MarketPairsResponse>(
    '/v2/cryptocurrency/market-pairs/latest',
    { params: { id, limit: PAIRS_FETCH_LIMIT } },
  )
  if (data.status.error_code !== 0) return undefined
  const payload = extractPayload(data.data)
  return parsePayload(payload)
}

/**
 * Loads CEX / DEX market links per asset (one request per id, throttled).
 */
export async function fetchMarketPairsForIds(
  ids: number[],
): Promise<Record<number, TokenMarkets | undefined>> {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))]
  const out: Record<number, TokenMarkets | undefined> = {}

  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const chunk = unique.slice(i, i + CONCURRENCY)
    await Promise.all(
      chunk.map(async (id) => {
        try {
          const parsed = await fetchMarketPairsForOneId(id)
          if (parsed) out[id] = parsed
        } catch {
          /* skip */
        }
      }),
    )
  }

  return out
}
