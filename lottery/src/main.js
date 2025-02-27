import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router' // 修正路径
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')