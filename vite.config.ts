import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import type { Connect } from 'vite'

// Middleware para lidar com solicitações CORS para Firefox
const corsMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  // Para requisições OPTIONS (preflight) retornar 204 imediatamente
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://192.168.1.10:5173',
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
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    // Plugin para adicionar o middleware CORS
    {
      name: 'cors-for-firefox',
      configureServer(server) {
        server.middlewares.use(corsMiddleware)
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
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxy request:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, _req, res) => {
            // Modificar os headers para permitir o acesso do IP específico
            res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.10:5173')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            res.setHeader(
              'Access-Control-Allow-Headers',
              'Content-Type, Authorization, User-Agent, Accept, Origin, X-Requested-With',
            )
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Access-Control-Max-Age', '86400')
            // Adicionar o cabeçalho Vary para caching correto
            res.setHeader('Vary', 'Origin')
          })
        },
      },
    },
  },
})
