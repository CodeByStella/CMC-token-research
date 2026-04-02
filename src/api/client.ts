import axios from 'axios'
import { CMC_PRO_API_PROXY_PATH } from '../config/cmcOrigin'
import { getStoredApiKey } from '../utils/apiKeyStorage'

/** Same-origin path → proxied to CoinMarketCap (Vite dev / host rewrite; key from client or server env). */
export const cmcClient = axios.create({
  baseURL: CMC_PRO_API_PROXY_PATH,
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
