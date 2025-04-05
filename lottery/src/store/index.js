import { createStore } from "vuex";

export default createStore({
  state: {
    lotteryHistory: [],
  },
  mutations: {
    addLotteryHistory(state, payload) {
      state.lotteryHistory.push(payload);
    },
  },
  getters: {
    getLotteryHistory: (state) => state.lotteryHistory,
  },
});
