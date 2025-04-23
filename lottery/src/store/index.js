import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      username: 'admin'
    },
    lotteryResult: null
  },
  mutations: {
    setLotteryResult(state, payload) {
      state.lotteryResult = payload;
    }
  },
  getters: {
    getLotteryHistory: (state) => state.lotteryHistory,
  },
  actions: {
  },
  modules: {
  },
});
