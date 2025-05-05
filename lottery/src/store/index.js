import { createStore } from "vuex";

export default createStore({
    state: {
      // 原有状态保留
      user: {
        username: localStorage.getItem('username') || 'admin' // 从 localStorage 初始化
      },
      lotteryResult: null,
      // 新增 JWT 状态
      token: localStorage.getItem('jwt_token') || null
    },
    mutations: {
      // 原有 mutation 保留
      setLotteryResult(state, payload) {
        state.lotteryResult = payload;
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
      setUser(state, username) {
        state.user.username = username;
        localStorage.setItem('username', username);
      }
    },
    getters: {
      // 原有 getter 保留
      getLotteryHistory: (state) => state.lotteryHistory,
      // 新增认证状态 getter
      isAuthenticated: (state) => !!state.token
    },
    actions: {
      // 新增登录 Action（使用 fetch）
      async login({ commit }, { username, password }) {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || '登录失败');
  
          commit('setToken', data.token);
          commit('setUser', username);
          return true;
        } catch (error) {
          console.error('登录错误:', error);
          throw error;
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
    }
  });