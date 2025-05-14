<template>
<div class="container">
    <p style="font-size: 300%;  font-weight: bold; text-align: center; color: white;">创建抽奖</p>
      <!-- 抽奖基本信息 -->
      <section class="section-bg">
          <div class="header-bg">
              <h2 style="color: white;">活动内容</h2>
          </div>
          <div class="main-bg">
              <label for="lotteryName" color: white >抽奖名称:</label>
              <input type="text" id="lotteryName" v-model="lotteryInfo.name" required class="rounded-input" />
              <br /><br />
              <label for="lotteryDesc" color: white >抽奖描述:</label>
              <textarea id="lotteryDesc" v-model="lotteryInfo.description" class="rounded-input"></textarea>
          </div>
      </section>

<!-- 奖项配置 -->
<section class="section-bg" style="color: white;">
    <div class="header-bg">
        <h2 style="color: white;">奖项配置</h2>
    </div>
    <div class="main-bg" style="color: white;">
        <div v-for="(prize, index) in prizes" :key="index" class="prize-container">
            <div class="prize-item" style="display: flex; gap: 20px; align-items: flex-start;">
                <!-- 左侧表单字段 -->
                <div class="form-fields" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="prize-field">
                        <label style="color: white; display: block; margin-bottom: 5px;">奖品等级:</label>
                        <input type="text" v-model="prize.level" class="rounded-input"
                            style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5); width: 100%; padding: 8px 12px;" />
                    </div>
                    <div class="prize-field">
                        <label style="color: white; display: block; margin-bottom: 5px;">奖品名称:</label>
                        <input type="text" v-model="prize.name" required class="rounded-input"
                            style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5); width: 100%; padding: 8px 12px;" />
                    </div>
                    <div class="prize-field">
                        <label style="color: white; display: block; margin-bottom: 5px;">奖品权重:</label>
                        <input type="number" v-model="prize.weight" required class="rounded-input"
                            style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5); width: 100%; padding: 8px 12px;" />
                    </div>
                    <div class="prize-field">
                        <label style="color: white; display: block; margin-bottom: 5px;">奖品份数:</label>
                        <input type="number" v-model="prize.quantity" required class="rounded-input"
                            style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5); width: 100%; padding: 8px 12px;" />
                    </div>
                </div>
                
<div class="image-upload-section" style="width: 150px;">
  <label style="color: white; display: block; margin-bottom: 5px;">奖品图片:</label>
<div class="image-upload-container">
  <div class="image-upload rounded-input" @click="triggerFileInput(index)"
            style="border-color: rgba(255,255,255,0.5); width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; cursor: pointer;">
    <span v-if="!prize.image" class="upload-icon" style="color: white; font-size: 24px;">+</span>
    <img v-else :src="prize.image" class="prize-image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
  <input 
      type="file" 
      :ref="'prizeFileInput' + index" 
      @change="handlePrizeImageUpload($event, index)" 
      accept="image/*" 
      class="upload-btn" 
      style="display: none"
    />
  </div>
</div>
</div>
</div>
            
            <!-- 按钮组 -->
            <div class="btn-group" style="margin-top: 15px;">
                <button @click="removePrizeLevel(index)" class="delete-btn smaller-text shadow-effect"
                    style="background-color: #ff4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 10px;" 
                    :disabled="prizes.length <= 1">
                    删除
                </button>
                <!-- 只在最后一个奖品显示添加按钮 -->
                <button v-if="index === prizes.length - 1" @click="addPrizeLevel" class="add-btn smaller-text shadow-effect"
                    style="background-color: #3fa786; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                    添加
                </button>
            </div>
        </div>
    </div>
</section>

<div class="row-sections">
    <!-- 权限设置 -->
    <section class="section-bg" style="color: white;">
        <div class="header-bg">
            <h2 style="color: white;">权限设置</h2>
        </div>
        <div class="main-bg">
            <div class="permission-section">
                <h3 style="color: white;">抽奖名单查看权限</h3>
                <div class="permission-options">
                    <button @click="setParticipantVisibility('public')" 
                            :class="{active: participantVisibility === 'public', 'rounded-box': true}"
                            style="color: black;">公开</button>
                    <button @click="setParticipantVisibility('admin')" 
                            :class="{active: participantVisibility === 'admin', 'rounded-box': true}"
                            style="color: black;">仅管理员</button>
                </div>
            </div>
            
            <div class="permission-section">
                <h3 style="color: white;">抽奖结果查看权限</h3>
                <div class="permission-options">
                    <button @click="setResultVisibility('public')" 
                            :class="{active: resultVisibility === 'public', 'rounded-box': true}"
                            style="color: black;">公开</button>
                    <button @click="setResultVisibility('admin')" 
                            :class="{active: resultVisibility === 'admin', 'rounded-box': true}"
                            style="color: black;">仅管理员</button>
                </div>
            </div>
        </div>
    </section>

      <!-- 时间设置 -->
      <section class="section-bg" style="flex: 1;">
        <div class="header-bg">
          <h2 style="color: white;">时间设置</h2>
        </div>
        <div class="main-bg">
          <label for="startTime" style="color: white;">开始时间:</label>
          <input type="datetime-local" id="startTime" v-model="timeSettings.startTime" class="rounded-input" />
          <br /><br />
          <label for="endTime" style="color: white;">结束时间:</label>
          <input type="datetime-local" id="endTime" v-model="timeSettings.endTime" class="rounded-input" />
        </div>
      </section>

<section class="section-bg">
  <div class="header-bg">
    <h2 style="color: white;">活动状态</h2>
  </div>
  <div class="main-bg">
    <p v-if="activityStatus === 'unstarted'" style="color: orange;">活动还未开始</p>
    <p v-else-if="activityStatus === 'ongoing'" style="color: green;">活动进行中</p>
    <p v-else-if="activityStatus === 'ended'" style="color: red;">活动已结束</p>
    <p v-else style="color: grey;">活动状态未知</p>
    </div>
</section>

    </div>
<!-- 修改后的生成按钮 -->
<div class="button-container">
  <button class="generate-btn rounded-box" @click="launchLottery">生成抽奖码</button>
      </div>
  </div>

  <!-- 抽奖码弹窗 -->
<div v-if="showPopup" class="popup-overlay">
  <div class="popup">
    <div class="popup-content">
      <h3>抽奖码已生成</h3>
      <input 
        type="text" 
        v-model="generatedCode" 
        readonly 
        class="code-input"
        ref="codeInput"
      >
      <button @click="copyCode" class="copy-btn">复制</button>
      <button @click="showPopup = false" class="close-btn">关闭</button>
    </div>
  </div>
</div>
</template>


<script>
import axios from 'axios';
import { useUserStore } from '../store/user'; // 导入Pinia store

export default {
  data() {
    return {
      lotteryInfo: { name: '', description: '' },
      prizes: [
        { level: '一等奖', name: '', quantity: 1, weight: 50, image: null }
      ],
      manualParticipants: [{ nickname: '', otherField: '' }],
      participantVisibility: 'public',
      resultVisibility: 'public',
      timeSettings: {
        startTime: new Date().toISOString().slice(0, 16), // 当前时间的 ISO 格式（去掉毫秒部分）
        endTime: new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16) // 当前时间加1小时
      },
      uploadStatus: null,
      fileType: null,
      activityStatus: '', // 添加活动状态变量
      currentStage: 0,
      currentPrize: null,
      winners: {},
      currentWinners: [],
      showResult: false,
      showContinueButton: false,
      currentButtonText: '',
      generatedCode: '',
      showPopup: false,
    };
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  methods: {
    // 触发文件输入框的点击事件
    triggerFileInput(index) {
      const fileInput = this.$refs[`prizeFileInput${index}`];
      if (fileInput) {
        fileInput[0].click(); // 触发点击事件
      } else {
        console.error(`File input for index ${index} not found`);
      }
    },

    // 处理图片上传
    handlePrizeImageUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      // 使用 URL.createObjectURL 直接生成图片的 URL
      const imageUrl = URL.createObjectURL(file);
      this.prizes[index].image = imageUrl;
    },
    
    // 计算活动状态
    calculateActivityStatus() {
      const now = new Date(); // 当前时间
      console.log('当前时间:', now);

      let startTime = new Date(this.timeSettings.startTime);
      let endTime = new Date(this.timeSettings.endTime);

      // 确保时间格式正确
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error('时间格式不正确:', this.timeSettings.startTime, this.timeSettings.endTime);
        this.activityStatus = '';
        return;
      }

      console.log('活动开始时间:', startTime);
      console.log('活动结束时间:', endTime);

      if (now < startTime) {
        this.activityStatus = 'unstarted'; // 活动还未开始
      } else if (now >= startTime && now < endTime) {
        this.activityStatus = 'ongoing'; // 活动进行中
      } else if (now >= endTime) {
        this.activityStatus = 'ended'; // 活动已结束
      }
    },
    
    ordinal(n) { return ["一", "二", "三", "四", "五", "六"][n]; },
    
    addPrizeLevel() {
      const lastLevel = this.prizes.length;
      this.prizes.push({ 
        level: `${this.ordinal(lastLevel)}等奖`, 
        name: '', 
        quantity: 1,
        weight: 50,
        image: null 
      });
    },
    
    removePrizeLevel(index) {
      this.prizes.splice(index, 1);
    },
    
    addManualParticipant() {
      this.manualParticipants.push({ nickname: '', otherField: '' });
    },
    
    removeManualParticipant(index) {
      this.manualParticipants.splice(index, 1);
    },
    
    uploadExcel() {
      this.fileType = 'excel';
      this.$refs.fileUpload.click();
    },
    
    uploadCSV() {
      this.fileType = 'csv';
      this.$refs.fileUpload.click();
    },
    
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.uploadStatus = '上传中...';
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', this.fileType);
        
        const response = await axios.post('/api/upload-participants', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        this.uploadStatus = `上传成功，共导入 ${response.data.count} 条记录`;
      } catch (error) {
        console.error('文件上传失败:', error);
        this.uploadStatus = '上传失败: ' + (error.response?.data?.message || error.message);
      }
    },
    
    setParticipantVisibility(visibility) {
      this.participantVisibility = visibility;
    },
    
    setResultVisibility(visibility) {
      this.resultVisibility = visibility;
    },
    
    generateResult() {
      if (this.currentStage >= this.prizes.length) {
        this.goToResultMan();
        return;
      }
      // 计算总权重
      const totalWeight = this.prizes.reduce((sum, prize) => sum + prize.weight, 0);
      // 根据权重随机选择奖品
      let randomWeight = Math.random() * totalWeight;
      let selectedPrize = null;
      for (const prize of this.prizes) {
        randomWeight -= prize.weight;
        if (randomWeight <= 0) {
          selectedPrize = prize;
          break;
        }
      }
      if (!selectedPrize) {
        console.error('未能根据权重选择奖品');
        return;
      }
      this.currentPrize = selectedPrize;
      // 初始化该奖项的中奖者数组
      this.winners[selectedPrize.level] = [];
      // 复制参与者名单以避免修改原数组
      const availableParticipants = [...this.participantList];
      // 抽奖逻辑 - 确保不会重复中奖
      const drawCount = Math.min(selectedPrize.quantity, availableParticipants.length);
      for (let i = 0; i < drawCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const winner = availableParticipants[randomIndex];
        this.winners[selectedPrize.level].push(winner);
        availableParticipants.splice(randomIndex, 1); // 移除已中奖者
      }
      // 更新当前显示的中奖者
      this.currentWinners = [...this.winners[selectedPrize.level]];
      this.showResult = true;
      // 更新按钮文本
      if (this.currentStage < this.prizes.length - 1) {
        this.currentButtonText = `继续抽取${this.prizes[this.currentStage + 1].level}`;
      } else {
        this.currentButtonText = '查看全部结果';
      }
      this.showContinueButton = true;
    },
    
// 生成抽奖码
launchLottery() {
      if (!this.lotteryInfo.name) {
        alert('请填写抽奖名称');
        return;
      }

      for (const prize of this.prizes) {
        if (!prize.name || !prize.quantity || !prize.weight) {
          alert('请填写完整的奖品信息');
          return;
        }
      }

      // 生成6位随机码（字母+数字）
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      this.generatedCode = result;
      this.showPopup = true;
    },

    // 复制抽奖码
    copyCode() {
      navigator.clipboard.writeText(this.generatedCode)
        .then(() => alert('抽奖码已复制!'))
        .catch(() => {
          // 兼容旧浏览器
          this.$refs.codeInput.select();
          document.execCommand('copy');
          alert('抽奖码已复制!');
        });
        }
  },
  watch: {
    // 监听时间设置的变化，重新计算状态
    'timeSettings.startTime': function() {
      this.calculateActivityStatus();
    },
    'timeSettings.endTime': function() {
      this.calculateActivityStatus();
    }
  },
  mounted() {
    this.calculateActivityStatus(); // 初始化活动状态
    setInterval(this.calculateActivityStatus, 1000); // 每隔1秒更新活动状态
  }
};
</script>

<style scoped>
.section-bg,
.section-bg h2,
.section-bg h3 {
    color: white;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
}

/*容器底色head*/
.header-bg {
  background-color: rgba(154, 153, 153, 0.153);
  padding: 5px 10px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.main-bg {
  padding: 15px;
  border-radius: 0 0 8px 8px;
}

/*容器底色*/
.section-bg {
  background-color: rgba(255, 255, 255, 0.103);
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.input-field,
.rounded-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.upload-btn {
  display: none;
}

/*图片上传*/
.image-upload {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.upload-icon {
  font-size: 2em;
  color: #ccc;
}

.delete-btn,
.add-btn {
  background-color: #ff4d4d;
  color: rgb(255, 255, 255);
  border: none;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 0.8em;
  margin-right: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.add-btn {
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}

.btn-group {
  display: flex;
  justify-content: flex-start;
}

.smaller-text {
  font-size: 0.8em;
}

.generate-btn,
.share-btn {
  display: inline-block;
  margin: 10px auto;
  padding: 10px 20px;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: rgb(255, 255, 255);
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-right: 10px;
}

.button-container {
  text-align: center;
}

/* 新增样式 */
.prize-container {
  margin-bottom: 20px;
}

.prize-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.prize-field {
  flex: 1;
  min-width: 200px;
}

.image-upload-container {
  margin-top: 10px;
}

.prize-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}

.participant-options {
  display: flex;
  gap: 30px;
}

.manual-input, .upload-option {
  flex: 1;
}

.participant-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.participant-row input {
  flex: 1;
}

.small-btn {
  padding: 3px 8px;
  font-size: 0.8em;
}

.permission-section {
  margin-bottom: 20px;
}

.permission-options {
  display: flex;
  gap: 15px;
}

.permission-options button {
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}

.permission-options button.active {
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: white;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}

.upload-status {
  margin-top: 10px;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  font-size: 0.9em;
}

.upload-btn {
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.rounded-box {
  border-radius: 8px;
}

.row-sections {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.row-sections > section {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

/* 调整按钮样式 */
.button-container {
  text-align: center;
  margin-top: 20px;
}

.generate-btn {
  display: inline-block;
  padding: 12px 30px;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.generate-btn:hover {
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}

/* 样式设计 */
.button-container {
  margin: 20px 0;
}

.generate-btn {
  padding: 10px 20px;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.generate-btn:hover {
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.popup-content {
  text-align: center;
}

.code-input {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.copy-btn, .close-btn {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 25px;
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
  color: #ffffff;
  cursor: pointer;
}

.copy-btn:hover, .close-btn:hover {
 background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}
.image-upload-container {
  position: relative;
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-icon {
  font-size: 24px;
  color: white;
}

.prize-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-btn {
  display: none;
}
</style>