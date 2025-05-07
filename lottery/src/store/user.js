// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    username: null,
    nickName: null,
    token: null,
    lotteryResult: null,
    // 添加状态用于跟踪加载和错误
    isLoading: false,
    error: null
  }),
  actions: {
    // 设置用户信息并持久化到localStorage
    setUserInfo(userData) {
      this.userId = userData.userId
      this.username = userData.username
      this.nickName = userData.nickName
      this.token = userData.token
      // 持久化到localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData))
    },
    
    // 更健壮的抽奖结果设置方法
    setLotteryResult(payload) {
      if (!payload) {
        console.error('setLotteryResult: payload 未定义')
        this.error = '抽奖结果数据无效'
        return false
      }
      
      this.lotteryResult = {
        prize: payload.prize || '未中奖',
        userName: payload.userName || this.username,
        activityUrl: payload.activityUrl || null,
        activityName: payload.activityName || null,
        timestamp: new Date().toISOString()
      }
      return true
    },
    
    // 添加清除用户信息的方法
    clearUser() {
      this.userId = null
      this.username = null
      this.nickName = null
      this.token = null
      localStorage.removeItem('userInfo')
    },
    
    // 从localStorage初始化用户状态
    initializeFromStorage() {
      const storedUser = localStorage.getItem('userInfo')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          this.setUserInfo(userData)
        } catch (e) {
          console.error('解析存储的用户信息失败:', e)
        }
      }
    }
  },
  
  // 添加getters便于访问
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => ({
      userId: state.userId,
      username: state.username,
      nickName: state.nickName
    })
  }
})