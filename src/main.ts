/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/base.css'

// Importar a configuração no início da aplicação
import { config } from './config'
console.log(`Configuração carregada: Ollama URL = ${config.ollamaBaseUrl}`)

// Inicializar o tema
const initTheme = () => {
  const savedColor = localStorage.getItem('theme_color') || '#9d0505'
  document.documentElement.style.setProperty('--primary-color', savedColor)

  // Calcular uma versão mais escura para hover
  const darkerColor = savedColor.replace(
    /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
    (_, r, g, b) => {
      const darken = (hex: string) => {
        const num = Math.max(0, parseInt(hex, 16) - 32)
        return num.toString(16).padStart(2, '0')
      }
      return `#${darken(r)}${darken(g)}${darken(b)}`
    },
  )
  document.documentElement.style.setProperty('--primary-color-darker', darkerColor)

  // Definir cores secundárias
  document.documentElement.style.setProperty('--secondary-color', '#333333')
  document.documentElement.style.setProperty('--chat-bg-color', '#1e1e1e')
  document.documentElement.style.setProperty('--sidebar-bg-color', '#1e1e1e')
  document.documentElement.style.setProperty('--header-bg-color', '#2d2d2d')
  document.documentElement.style.setProperty('--message-agent-bg', '#2d2d2d')
  document.documentElement.style.setProperty('--border-color', '#333333')
  document.documentElement.style.setProperty('--button-text-color', '#ffffff')

  // Aplicar tema salvo
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme')
  }
}

initTheme()

import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Dropdown from 'primevue/dropdown'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tooltip from 'primevue/tooltip'
import Aura from '@primeuix/themes/aura'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.component('Button', Button)
app.component('Textarea', Textarea)
app.component('Avatar', Avatar)
app.component('Dropdown', Dropdown)
app.component('Select', Select)
app.component('ProgressBar', ProgressBar)
app.component('Dialog', Dialog)
app.component('InputText', InputText)

app.directive('tooltip', Tooltip)

app.mount('#app')
