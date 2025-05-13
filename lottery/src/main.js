// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store';
import './style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { TinyContainer, TinyLayout } from '@opentiny/vue';
import { ElMessage } from 'element-plus';
import { createPinia } from 'pinia';
import axios from 'axios'

const app = createApp(App);
// 存储原始 body 高度
const originalBodyHeight = document.body.style.height;
// 创建 axios 实例
const http = axios.create({
    baseURL: 'http://127.0.0.1:33001', // 你的后端地址
    timeout: 10000
    })
    // 挂载到 Vue 原型
app.config.globalProperties.$http = http
// 在每次路由跳转后还原 body 高度
router.afterEach(() => {
    document.body.style.height = originalBodyHeight;
});
app.use(createPinia())
app.use(router);
app.use(store);
app.use(ElementPlus);
app.config.globalProperties.$message = ElMessage;
app.component('TinyContainer', TinyContainer);
app.component('TinyLayout', TinyLayout);

app.mount('#app');