import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: '',
        redirect: '/demo'
    },
    {
        path: '/login-main',
        name: 'login-main',
        component: () => import('../pages/login-main.vue'),
        meta: {
            title: '登录页面',
            freeAuth: true
        }
    },
    {
        path: '/lottery-main',
        name: 'lottery-main',
        component: () => import('../pages/lottery-main.vue'),
        meta: {
            title: '抽奖首页',
            freeAuth: true
        }
    },
    {
        path: '/customers-main',
        name: 'customers-main',
        component: () => import('../pages/customers-main.vue'),
        meta: {
            title: '参与抽奖页面',
            freeAuth: true
        }
    },
    {
        path: '/managers-main',
        name: 'managers-main',
        component: () => import('../pages/managers-main.vue'),
        meta: {
            title: '管理人页面',
            freeAuth: true
        }
    },
    {
        path: '/result-cus',
        name: 'result-cus',
        component: () => import('../pages/result-cus.vue'),
        meta: {
            title: '参与人抽奖结果展示',
            freeAuth: true
        }
    },
    {
        path: '/result-man',
        name: 'result-man',
        component: () => import('../pages/result-man.vue'),
        meta: {
            title: '组织人抽奖结果展示',
            freeAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 导航守卫
router.beforeEach((to, from, next) => {
    // 从 localStorage 中读取 token
    const token = localStorage.getItem('token');
    // 判断当前页面 meta 信息是否包含免认证标识
    const freeAuthMeta = to.matched.some((record) => record.meta.freeAuth);
    // 如果不是免认证的页面并且没有token，则跳转到登录页
    if (!freeAuthMeta && !token) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
