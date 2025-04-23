import { userStore } from '@/stores/user';

// 注入所有 store 模块到 Vue 实例
export default {
    install(app) {
        app.config.globalProperties.$store = {
            user: userStore()
        };
    }
};

export const mutations = {
    setLotteryResult(state, payload) {
        state.lotteryResult = {
            prize: payload.prize,
            userName: payload.userName,
            activityUrl: payload.activityUrl,
            activityName: payload.activityName
        };
    }
};
