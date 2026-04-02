import { defineConfig, loadEnv } from 'vite'
import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import {
  CMC_PRO_API_ORIGIN,
  CMC_PRO_API_PROXY_PATH,
} from './src/config/cmcOrigin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.CMC_API_KEY ?? ''

  const cmcProxy: ProxyOptions = {
    target: CMC_PRO_API_ORIGIN,
    changeOrigin: true,
    rewrite: (path: string) =>
      path.startsWith(CMC_PRO_API_PROXY_PATH)
        ? path.slice(CMC_PRO_API_PROXY_PATH.length) || '/'
        : path,
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        // Browser cookies for localhost are forwarded by default; CMC rejects
        // oversized Cookie headers (nginx/Tengine: "Request Header Or Cookie Too Large").
        proxyReq.removeHeader('cookie')
        const raw = req.headers['x-cmc-pro-api-key']
        const fromClient =
          typeof raw === 'string'
            ? raw
            : Array.isArray(raw)
              ? raw[0]
              : ''
        const key = (fromClient?.trim() || apiKey) as string
        if (key) {
          proxyReq.setHeader('X-CMC_PRO_API_KEY', key)
        }
      })
    },
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        [CMC_PRO_API_PROXY_PATH]: cmcProxy,
      },
      host: true,
    },
    preview: {
      proxy: {
        [CMC_PRO_API_PROXY_PATH]: cmcProxy,
      },
    },
  }
})
