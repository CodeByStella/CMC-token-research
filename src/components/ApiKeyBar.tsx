import { useCallback, useState } from 'react'
import {
  CMC_API_KEY_STORAGE,
  getStoredApiKey,
  setStoredApiKey,
} from '../utils/apiKeyStorage'

const DOCS_GET_KEY = 'https://coinmarketcap.com/api/'
const DOCS_QUICK_START =
  'https://coinmarketcap.com/api/documentation/guides/quick-start'

export interface ApiKeyBarProps {
  onKeyChange: (hasKey: boolean) => void
}

export function ApiKeyBar({ onKeyChange }: ApiKeyBarProps) {
  const [value, setValue] = useState(() => getStoredApiKey())
  const [showKey, setShowKey] = useState(false)

  const apply = useCallback(() => {
    setStoredApiKey(value)
    onKeyChange(!!getStoredApiKey())
  }, [value, onKeyChange])

  const clear = useCallback(() => {
    setValue('')
    setStoredApiKey('')
    onKeyChange(false)
  }, [onKeyChange])

  return (
    <section className="api-key-bar" aria-label="CoinMarketCap API key">
      <div className="api-key-bar__row">
        <label className="api-key-bar__label" htmlFor="cmc-api-key">
          CoinMarketCap API key
        </label>
        <div className="api-key-bar__inputs">
          <input
            id="cmc-api-key"
            name="cmc-api-key"
            className="api-key-bar__input"
            type={showKey ? 'text' : 'password'}
            autoComplete="off"
            spellCheck={false}
            placeholder="Paste your Pro API key"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply()
            }}
          />
          <button
            type="button"
            className="btn-secondary btn-secondary--small"
            onClick={() => setShowKey((s) => !s)}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
          <button type="button" className="btn-primary" onClick={apply}>
            Save
          </button>
          {getStoredApiKey() ? (
            <button type="button" className="btn-secondary" onClick={clear}>
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <p className="api-key-bar__links">
        New to the API?{' '}
        <a href={DOCS_GET_KEY} target="_blank" rel="noopener noreferrer">
          Get a free API key
        </a>
        {' · '}
        <a href={DOCS_QUICK_START} target="_blank" rel="noopener noreferrer">
          Quick start guide
        </a>
      </p>
      <p className="api-key-bar__note">
        Saved in this browser only (<code>{CMC_API_KEY_STORAGE}</code>). The dev
        server forwards it to CoinMarketCap; do not share your screen with the key
        visible.
      </p>
    </section>
  )
}
