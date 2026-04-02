/** First http(s) URL from a list (CoinMarketCap often returns arrays). */
export function firstHttp(urls?: string[]): string | undefined {
  return urls?.find((u) => typeof u === 'string' && /^https?:\/\//i.test(u))
}
