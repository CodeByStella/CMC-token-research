import axios from 'axios'

/** Same-origin path; Vite proxies to CoinMarketCap and injects the API key. */
export const cmcClient = axios.create({
  baseURL: '/cmc-api',
  headers: {
    Accept: 'application/json',
  },
})
