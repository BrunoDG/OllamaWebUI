/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/base.css'

// Importar a configuração no início da aplicação
import { config } from './config'
console.log(`Configuração carregada: Ollama URL = ${config.ollamaBaseUrl}`)

// Inicializar o tema (apenas tema escuro)
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

  // Definir cores para tema escuro
  document.documentElement.style.setProperty('--text-color', '#ffffff')
  document.documentElement.style.setProperty('--background-color', '#121212')
  document.documentElement.style.setProperty('--chat-bg-color', '#1e1e1e')
  document.documentElement.style.setProperty('--sidebar-bg-color', '#1e1e1e')
  document.documentElement.style.setProperty('--message-agent-bg', '#2d2d2d')
  document.documentElement.style.setProperty('--header-bg-color', '#2d2d2d')
  document.documentElement.style.setProperty('--border-color', '#333333')
  document.documentElement.style.setProperty('--message-text-color', '#ffffff')
  document.documentElement.style.setProperty('--text-secondary-color', '#aaaaaa')
  document.documentElement.style.setProperty('--hover-bg-color', 'rgba(255, 255, 255, 0.1)')
  document.documentElement.style.setProperty('--selected-bg-color', 'rgba(255, 255, 255, 0.15)')
  document.documentElement.style.setProperty('--button-text-color', '#ffffff')

  // Estilos para inputs e dropdowns
  document.documentElement.style.setProperty('--input-bg-color', '#2d2d2d')
  document.documentElement.style.setProperty('--input-text-color', '#ffffff')
  document.documentElement.style.setProperty('--input-border-color', '#444444')
  document.documentElement.style.setProperty('--dropdown-bg-color', '#2d2d2d')
  document.documentElement.style.setProperty('--dropdown-text-color', '#ffffff')
  document.documentElement.style.setProperty('--dropdown-border-color', '#444444')
  document.documentElement.style.setProperty('--dropdown-item-hover-bg', '#3d3d3d')
}

initTheme()

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Avatar from 'primevue/avatar'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(VueQueryPlugin)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('Select', Select)
app.component('ProgressBar', ProgressBar)
app.component('Avatar', Avatar)
app.directive('tooltip', Tooltip)

app.mount('#app')
