/** Public CoinMarketCap web URLs (not the Pro API). */

export function cmcCurrencyPageUrl(slug: string): string {
  const s = slug.trim()
  if (!s) return 'https://coinmarketcap.com/'
  return `https://coinmarketcap.com/currencies/${encodeURIComponent(s)}/`
}
