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

Parameters map to the official **[Listings Latest](https://coinmarketcap.com/api/documentation/pro-api-reference/cryptocurrency#listings-latest)** reference for `GET /v1/cryptocurrency/listings/latest`:

- **Query parameters:** `start`, `limit`, `sort`, `sort_dir`, `convert`, `cryptocurrency_type`, and optional `market_cap_min` / `market_cap_max`, `volume_24h_min` / `volume_24h_max` (the reference describes the volume thresholds as **24 hour USD volume**).
- **Client-only:** name/symbol substring and listed-after (UTC) date on `date_added` for the current page. With a listed-after date set, Search also sends `sort=date_added` (per the same reference) when your sort was not already “Date added”, so pages are ordered by listing time.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server with HMR      |
| `npm run build`| Typecheck + Vite build   |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint                   |
