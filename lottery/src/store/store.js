import { createStore } from 'vuex';

// 定义 user 模块
const userModule = {
  state() {
    return {
      lotteryResult: null,
      username: null,
      lotteryData: null ,
    };
  },
  mutations: {
    setLotteryResult(state, payload) {
      if (!payload) {
        console.error('setLotteryResult: payload 未定义');
        return;
      }
      state.lotteryResult = {
        prize: payload.prize || null,
        userName: payload.userName || null,
        activityUrl: payload.activityUrl || null,
        activityName: payload.activityName || null,
      };
    },
    setUsername(state, username) {
      state.username = username;
    },
    setLotteryData(state, payload) {
      if (!payload) {
          console.error('setLotteryData: payload 未定义');
          return;
      }
      state.lotteryData = payload; // 存储完整的抽奖数据
  },
  },
};

// 创建 store 实例
const store = createStore({
  modules: {
    user: userModule,
  },
});

export default store;