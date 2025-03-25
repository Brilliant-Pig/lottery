// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import './style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { TinyContainer, TinyLayout } from '@opentiny/vue';
import { ElMessage } from 'element-plus';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$message = ElMessage;
app.component('TinyContainer', TinyContainer);
app.component('TinyLayout', TinyLayout);


app.mount('#app');