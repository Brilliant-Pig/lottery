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
      state.lotteryResult = {
        prize: payload.prize,
        userName: payload.userName,
        activityUrl: payload.activityUrl,
        activityName: payload.activityName,
        payload,
      };
    },
    setUsername(state, username) {
      state.username = username;
    },
    setLotteryData(state, lotteryData) {
      state.lotteryData = lotteryData;
    }
  },
};

// 创建 store 实例
const store = createStore({
  modules: {
    user: userModule,
  },
});

export default store;