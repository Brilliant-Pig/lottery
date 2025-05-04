import { createStore } from "vuex";

export default createStore({
  state: {
    lotteryResult: null,
    lotteryData: null, // 存储抽奖数据
    user: {
      username: 'admin'
    },
  },
  mutations: {
    setLotteryResult(state, payload) {
      state.lotteryResult = payload;
    },
    setLotteryData(state, payload) {
      if (!payload) {
          console.error('setLotteryData: payload 未定义');
          return;
      }
      state.lotteryData = payload; // 存储完整的抽奖数据
    },
    setWinners(state, winners) {
        state.lotteryResult = winners; // 存储抽奖结果
    },
  },
  getters: {
    getLotteryHistory: (state) => state.lotteryHistory,
  },
  actions: {
  },
  modules: {
  },
});
