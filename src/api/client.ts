import axios from 'axios'
import { getStoredApiKey } from '../utils/apiKeyStorage'

/** Same-origin path; Vite proxies to CoinMarketCap (key from header or server env). */
export const cmcClient = axios.create({
  baseURL: '/cmc-api',
  headers: {
    Accept: 'application/json',
  },
})

cmcClient.interceptors.request.use((config) => {
  const key = getStoredApiKey()
  if (key) {
    config.headers.set('X-CMC_PRO_API_KEY', key)
  }
  return config
})
