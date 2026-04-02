/**
 * CoinMarketCap Pro API origin (hard-coded).
 *
 * Do not set axios `baseURL` to this URL in the browser — CMC does not allow
 * cross-origin requests from web apps (no CORS for client-side calls).
 *
 * The app always requests same-origin {@link CMC_PRO_API_PROXY_PATH}; the Vite
 * dev server and production host (e.g. `vercel.json` rewrites) proxy to this URL.
 */
export const CMC_PRO_API_ORIGIN = 'https://pro-api.coinmarketcap.com' as const

/** Same-origin path proxied to {@link CMC_PRO_API_ORIGIN}. Keep in sync with `vercel.json`. */
export const CMC_PRO_API_PROXY_PATH = '/cmc-api' as const
