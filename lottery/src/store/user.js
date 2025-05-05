// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    username: null,
    nickName: null,
    token: null,
    lotteryResult: null
  }),
  actions: {
    setUserInfo(userData) {
      this.userId = userData.userId
      this.username = userData.username
      this.nickName = userData.nickName
      this.token = userData.token
    },
    setLotteryResult(payload) {
      if (!payload) {
        console.error('setLotteryResult: payload 未定义');
        return;
      }
      this.lotteryResult = {
        prize: payload.prize || null,
        userName: payload.userName || null,
        activityUrl: payload.activityUrl || null,
        activityName: payload.activityName || null,
      };
    },
  }
})