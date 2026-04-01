import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { yandexCalendarDevPlugin } from './vite-plugin-yandex-calendar'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      yandexCalendarDevPlugin(env),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      proxy: {
        // Клиент вызывает /yandex-llm-api/... — ключ YANDEX_CLOUD_API_KEY подставляет только dev-сервер (Api-Key)
        '/yandex-llm-api': {
          target: 'https://llm.api.cloud.yandex.net',
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/yandex-llm-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.YANDEX_CLOUD_API_KEY || env.VITE_YANDEX_CLOUD_API_KEY
              if (key) proxyReq.setHeader('Authorization', `Api-Key ${key}`)
            })
          },
        },
        /** FastAPI Nylas (uvicorn app.main:app --reload --port 8000) — избегает CORS в dev */
        '/nylas': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
