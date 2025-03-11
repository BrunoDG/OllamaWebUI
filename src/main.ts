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
