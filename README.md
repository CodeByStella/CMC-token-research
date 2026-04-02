# CMC token search

Single-page CoinMarketCap token search: advanced filters, table results with sortable columns. Built with Vite, React, TypeScript, Axios, and ESLint.

## Setup

1. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

2. Open the app and paste your [CoinMarketCap Pro API](https://coinmarketcap.com/api/) key in the field at the top, then click **Save**. The key is stored in **localStorage** (`cmc_token_research_api_key`) for this browser only.

The upstream API origin is defined once in `src/config/cmcOrigin.ts` (`CMC_PRO_API_ORIGIN`). The browser always calls **same-origin** `/cmc-api` (see `CMC_PRO_API_PROXY_PATH`) so the key is not blocked by CORS: the **Vite dev/preview server** proxies to CoinMarketCap, and **Vercel** uses `vercel.json` rewrites to the same host. Do not point axios directly at `pro-api.coinmarketcap.com` from the client — CoinMarketCap does not allow browser CORS for that API.

**Other static hosts:** configure a rewrite/proxy from `/cmc-api/*` to `https://pro-api.coinmarketcap.com/*`, or use a small backend. Plain GitHub Pages has no rewrites unless you add Actions or an external worker.

## How search works

- **API parameters** (pagination, limit, sort, quote currency, asset type) are sent to `GET /v1/cryptocurrency/listings/latest`.
- **Client filters** (name/symbol substring, min/max market cap and volume, listed-after date) apply to the returned rows in the browser. They do not search the full CMC universe; they narrow the current result set.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server with HMR      |
| `npm run build`| Typecheck + Vite build   |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint                   |
