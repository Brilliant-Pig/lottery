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
      this.lotteryResult = {
        prize: payload.prize,
        userName: payload.userName,
        activityUrl: payload.activityUrl,
        activityName: payload.activityName
      }
    }
  }
})