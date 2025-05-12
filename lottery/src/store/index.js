import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null ,// 新增：完整用户信息
      username: localStorage.getItem('username') || 'admin' // 从 localStorage 初始化
    },
    lotteryResult: null,
    lotteryData: null, // 存储抽奖数据
    // 新增 JWT 状态
    token: localStorage.getItem('jwt_token') || null
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
    // 新增 JWT 相关 mutations
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('jwt_token', token); // 持久化存储
    },
    clearToken(state) {
      state.token = null;
      state.user.username = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('username');
    },
        clearToken(state) {
      state.token = null;
      state.user = {
        username: null,
        userInfo: null
      };
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('username');
      localStorage.removeItem('userInfo');
    },
    setUser(state, username) {
      state.user.username = username;
      localStorage.setItem('username', username);
    },
    setUser(state, userData) {
      state.user.username = userData.username;
      state.user.userInfo = userData; // 存储完整用户信息
      localStorage.setItem('username', userData.username);
      localStorage.setItem('userInfo', JSON.stringify(userData));
    },
  },
  getters: {
    getLotteryHistory: (state) => state.lotteryHistory,
    // 新增认证状态 getter
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user.userInfo || { username: state.user.username },

  },
  actions: {
    // 新增登录 Action（使用 fetch）
    async login({ commit }, { username, password }) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userName: username, 
            passWord: password 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `登录失败，状态码：${response.status}`);
        }

        const { code, message, data } = await response.json();

        if (code !== 0) {
          throw new Error(message || '登录凭证错误');
        }

        // 修改：存储完整的用户信息
        commit('setToken', data.token);
        commit('setUser', {
          username: username,
          token: data.token,
          // 其他从后端返回的用户信息
          ...data.user
        });
        return true;

      } catch (error) {
        console.error('登录过程出错:', error);
        commit('clearToken');
        throw new Error(error.message || '登录过程发生未知错误');
      }
    },

    async register({ commit }, { username, password }) {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: username, // 根据后端字段名调整
          passWord: password
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '注册失败');
      }
  
      return await response.json();
    },
    
    // 新增退出 Action
    logout({ commit }) {
      commit('clearToken');
    }
  },
  modules: {
  }
});