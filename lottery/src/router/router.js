import { createRouter, createWebHistory } from 'vue-router';

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
            freeAuth: true
        }
    },
    {
        path: '/ManagersMain',
        name: 'ManagersMain',
        component: () => import('../pages/ManagersMain.vue'),
        meta: {
            title: '管理人页面',
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
