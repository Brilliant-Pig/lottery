import { createApp } from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router/router' ;// 修正路径
import './style.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(store);
app.use(router);
app.use(ElementPlus)
app.mount('#app')