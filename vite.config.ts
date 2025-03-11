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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    cors: true,
    host: true,
    proxy: {
      // Proxy para o Ollama API
      '/api': {
        target: 'http://192.168.1.8:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Erro de proxy:', err)
          })
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Enviando requisição para:', req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Recebendo resposta de:', req.url, 'Status:', proxyRes.statusCode)
          })
        },
      },
    },
  },
})
