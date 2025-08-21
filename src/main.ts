import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import '@/assets/style/common.css'
import '@/assets/style/modal.css'

// Pinia import
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
