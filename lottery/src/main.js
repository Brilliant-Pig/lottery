// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import './style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { TinyContainer, TinyLayout } from '@opentiny/vue';


const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.component('TinyContainer', TinyContainer);
app.component('TinyLayout', TinyLayout);

// Vue 3 事件总线（替代 Vue 2 的 EventBus）
/* export const EventBus = {
    emit(event, ...args) {
        app.config.globalProperties.$emit(event, ...args);
    },
    on(event, callback) {
        app.config.globalProperties.$on(event, callback);
    },
    off(event, callback) {
        app.config.globalProperties.$off(event, callback);
    }
}; */

app.mount('#app');