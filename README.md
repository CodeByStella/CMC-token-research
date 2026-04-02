# CMC token search

Single-page CoinMarketCap token search: advanced filters, table results with sortable columns. Built with Vite, React, TypeScript, Axios, and ESLint.

## Setup

1. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

2. Open the app and paste your [CoinMarketCap Pro API](https://coinmarketcap.com/api/) key in the field at the top, then click **Save**. The key is stored in **localStorage** (`cmc_token_research_api_key`) for this browser only.

The app calls the API through a **Vite dev-server proxy** at `/cmc-api`, which forwards the `X-CMC_PRO_API_KEY` header from the client to CoinMarketCap.

**Static hosting note:** plain static hosting (for example GitHub Pages) does not run the Vite proxy. For production you would need a small backend or serverless function that forwards requests with `X-CMC_PRO_API_KEY`.

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
