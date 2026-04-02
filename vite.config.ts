import { defineConfig, loadEnv } from 'vite'
import type { ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.CMC_API_KEY ?? ''

  const cmcProxy: ProxyOptions = {
    target: 'https://pro-api.coinmarketcap.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/cmc-api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        // Browser cookies for localhost are forwarded by default; CMC rejects
        // oversized Cookie headers (nginx/Tengine: "Request Header Or Cookie Too Large").
        proxyReq.removeHeader('cookie')
        if (apiKey) {
          proxyReq.setHeader('X-CMC_PRO_API_KEY', apiKey)
        }
      })
    },
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/cmc-api': cmcProxy,
      },
      host: true,
    },
    preview: {
      proxy: {
        '/cmc-api': cmcProxy,
      },
    },
  }
})
