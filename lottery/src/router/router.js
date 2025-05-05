import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
    {
        path: '/LoginMain',
        name: 'LoginMain',
        component: () => import('../pages/LoginMain.vue'),
        meta: {
            title: '登录页面',
            freeAuth: true
        }
    },
    {
        path: '/LotteryMain',
        name: 'LotteryMain',
        component: () => import('../pages/LotteryMain.vue'),
        meta: {
            title: '抽奖首页',
            freeAuth: true
        }
    },
    {
        path: '/CustomersMain',
        name: 'CustomersMain',
        component: () => import('../pages/CustomersMain.vue'),
        meta: {
            title: '参与抽奖页面',
            freeAuth: false
        }
    },
    {
        path: '/ManagersMain',
        name: 'ManagersMain',
        component: () => import('../pages/ManagersMain.vue'),
        meta: {
            title: '管理人Excel/CSV页面',
            freeAuth: true
        }
    },
    {
        path: '/ManagersURL',
        name: 'ManagersURL',
        component: () => import('../pages/ManagersURL.vue'),
        meta: {
            title: '管理人URL页面',
            freeAuth: true
        }
    },
    {
        path: '/ResultCus',
        name: 'ResultCus',
        component: () => import('../pages/ResultCus.vue'),
        meta: {
            title: '参与人抽奖结果展示',
            freeAuth: true
        }
    },
    {
        path: '/ResultMan',
        name: 'ResultMan',
        component: () => import('../pages/ResultMan.vue'),
        meta: {
            title: '组织人抽奖结果展示',
            freeAuth: true
        }
    },
        {
        path: '/Register',
        name: 'Register',
        component: () => import('../pages/Register.vue'),
        meta: {
            title: '注册页面',
            freeAuth: true
        }
    },
    {
        path: '/mainpages',
        name: 'mainpages',
        component: () => import('../pages/mainpages.vue'),
        meta: {
            title: '主页面',
            freeAuth: true
        }
    },
    {
        path: '/App',
        name: 'App',
        component: () => import('../App.vue'),
        meta: {
            title: '渲染页面',
            freeAuth: false
        }
    },
    {
        path: '/animation',
        name: 'animation',
        component: () => import('../pages/animation.vue'),
        meta: {
            title: '动画页面',
            freeAuth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 升级版导航守卫（兼容原有逻辑，增加 Vuex 状态检查）
router.beforeEach((to, from, next) => {
// 1. 优先从 Vuex 读取 token（保持状态集中管理）
const isAuthenticated = store.getters.isAuthenticated;

// 2. 兼容性回退：如果 Vuex 未启用，则从 localStorage 读取（逐步迁移用）
const fallbackToken = localStorage.getItem('token');

// 3. 判断是否免认证页面
const isFreeAuth = to.matched.some(record => record.meta.freeAuth);

 // 4. 权限判断逻辑（优先级：Vuex > localStorage）
if (!isFreeAuth) {
    if (!isAuthenticated && !fallbackToken) {
    // 情况1：需要认证但未登录 → 跳登录页
        next({ name: 'login' });
        return;
    } else if (to.name === 'login' && (isAuthenticated || fallbackToken)) {
        // 情况2：已登录但访问登录页 → 跳首页
        next('/LotteryMain');
        return;
    }
}

// 5. 其他情况放行
    next();
});

export default router;