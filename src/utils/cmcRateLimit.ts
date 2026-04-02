/**
 * CoinMarketCap Basic (free) plan: 30 requests per minute (see pricing / FAQ).
 * Space calls by at least this interval to stay under the per-minute cap.
 * @see https://coinmarketcap.com/api/pricing/
 */
export const CMC_BASIC_MIN_INTERVAL_MS = 2100

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
