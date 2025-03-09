/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Avatar from 'primevue/avatar'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
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
app.component('ProgressBar', ProgressBar)
app.component('Dialog', Dialog)
app.component('InputText', InputText)

app.mount('#app')
