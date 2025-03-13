import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    // Plugin para tratar CORS
    {
      name: 'configure-cors',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Interceptar e tratar preflight requests (OPTIONS)
          if (req.method === 'OPTIONS') {
            console.log('Interceptando preflight request:', req.url)

            res.writeHead(204, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers':
                'Content-Type, Authorization, User-Agent, Accept, Origin, X-Requested-With',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Max-Age': '86400',
              Vary: 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
            })
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.8:11434',
        changeOrigin: true,
        rewrite: (path) => {
          // Log para debug
          console.log(`Reescrevendo caminho: ${path} para ${path.replace(/^\/api/, '')}`)
          return path.replace(/^\/api/, '')
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Erro de proxy:', err)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`Enviando requisição: ${req.method} ${req.url} -> ${proxyReq.path}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`Resposta recebida: ${proxyRes.statusCode} para ${req.url}`)

            // Garantir que todos os headers CORS estejam presentes
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            res.setHeader(
              'Access-Control-Allow-Headers',
              'Content-Type, Authorization, User-Agent, Accept, Origin, X-Requested-With',
            )
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Max-Age', '86400')
            res.setHeader('Vary', 'Origin')
          })
        },
      },
    },
  },
})
