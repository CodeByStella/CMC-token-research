/** localStorage key for CoinMarketCap Pro API key (browser-only). */
export const CMC_API_KEY_STORAGE = 'cmc_token_research_api_key'

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(CMC_API_KEY_STORAGE)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function setStoredApiKey(key: string): void {
  const t = key.trim()
  try {
    if (t) localStorage.setItem(CMC_API_KEY_STORAGE, t)
    else localStorage.removeItem(CMC_API_KEY_STORAGE)
  } catch {
    /* ignore quota / private mode */
  }
}
