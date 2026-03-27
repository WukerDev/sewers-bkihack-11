import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import 'unfonts.css'
import { createPinia } from 'pinia'
import './main.css'

const app = createApp(App)

registerPlugins(app)
app.use(createPinia())
app.mount('#app')