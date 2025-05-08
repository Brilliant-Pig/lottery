<template>
  <div class="container">
      <p style="font-size: 300%; text-align: center;">创建抽奖</p>

      <!-- 抽奖基本信息 -->
      <section class="section-bg">
          <div class="header-bg">
              <h2>活动内容</h2>
          </div>
          <div class="main-bg">
              <label for="lotteryName">抽奖名称*:</label>
              <input type="text" id="lotteryName" v-model="lotteryInfo.name" required class="rounded-input" />
              <br /><br />
              <label for="lotteryDesc">抽奖描述:</label>
              <textarea id="lotteryDesc" v-model="lotteryInfo.description" class="rounded-input"></textarea>
          </div>
      </section>

      <!-- 奖项配置 -->
      <section class="section-bg">
          <div class="header-bg">
              <h2>奖项配置</h2>
          </div>
          <div class="main-bg">
              <div v-for="(prize, index) in prizes" :key="index" class="prize-container">
                  <div class="prize-item">
                      <h3>{{ prize.level }}</h3>
                      <div class="prize-row">
                          <div class="prize-field">
                              <label>奖品等级:</label>
                              <input type="text" v-model="prize.level" disabled class="rounded-input" />
                          </div>
                          <div class="prize-field">
                              <label>奖品名称*:</label>
                              <input type="text" v-model="prize.name" required class="rounded-input" />
                          </div>
                          <div class="prize-field">
                              <label>奖品份数*:</label>
                              <input type="number" v-model="prize.quantity" required class="rounded-input" />
                          </div>
                          <div class="prize-field">
                            <label style="color: white;">奖品权重*:</label>
                            <input type="number" v-model="prize.weight" required class="rounded-input"
                                style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5);" />
                        </div>
                          <div class="prize-field">
                              <label>奖品图片:</label>
                              <div class="image-upload-container">
                                  <div class="image-upload rounded-input" @click="triggerFileInput(index)">
                                      <span v-if="!prize.image" class="upload-icon">+</span>
                                      <img v-else :src="prize.image" class="prize-image" />
                                      <input type="file" ref="fileInput" @change="handlePrizeImageUpload($event, index)" 
                                            accept="image/*" class="upload-btn" />
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="btn-group">
                          <button @click="removePrizeLevel(index)" class="delete-btn smaller-text shadow-effect">删除</button>
                          <button @click="addPrizeLevel" class="add-btn smaller-text shadow-effect">添加</button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <div class="row-sections">
          <!-- 权限设置 -->
          <section class="section-bg">
              <div class="header-bg">
                  <h2>权限设置</h2>
              </div>
              <div class="main-bg">
                  <div class="permission-section">
                      <h3>抽奖名单查看权限</h3>
                      <div class="permission-options">
                          <button @click="setParticipantVisibility('public')" 
                                  :class="{active: participantVisibility === 'public', 'rounded-box': true}">公开</button>
                          <button @click="setParticipantVisibility('admin')" 
                                  :class="{active: participantVisibility === 'admin', 'rounded-box': true}">仅管理员</button>
                      </div>
                  </div>
                  
                  <div class="permission-section">
                      <h3>抽奖结果查看权限</h3>
                      <div class="permission-options">
                          <button @click="setResultVisibility('public')" 
                                  :class="{active: resultVisibility === 'public', 'rounded-box': true}">公开</button>
                          <button @click="setResultVisibility('admin')" 
                                  :class="{active: resultVisibility === 'admin', 'rounded-box': true}">仅管理员</button>
                      </div>
                  </div>
              </div>
          </section>

          <!-- 时间设置 -->
          <section class="section-bg">
              <div class="header-bg">
                  <h2>时间设置</h2>
              </div>
              <div class="main-bg">
                  <label for="startTime">开始时间:</label>
                  <input type="datetime-local" id="startTime" v-model="timeSettings.startTime" class="rounded-input" />
                  <br /><br />
                  <label for="endTime">结束时间:</label>
                  <input type="datetime-local" id="endTime" v-model="timeSettings.endTime" class="rounded-input" />
              </div>
          </section>
      </div>

<!-- 修改后的生成按钮 -->
<div class="button-container">
          <button class="generate-btn rounded-box" @click="launchLottery">生成分享链接</button>
      </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
      return {
          lotteryInfo: { name: '', description: '' },
          prizes: [
              { level: '一等奖', name: '', quantity: 1, weight: 50 }
          ],          manualParticipants: [{ nickname: '', otherField: '' }],
          participantVisibility: 'public',
          resultVisibility: 'public',
          timeSettings: { startTime: '', endTime: '' },
          uploadStatus: null,
          fileType: null
      };
  },
  methods: {
      ordinal(n) { return ["一", "二", "三", "四", "五", "六"][n]; },
      
      triggerFileInput(index) {
          this.$refs.fileInput[index].click();
      },
      
      async handlePrizeImageUpload(event, index) {
          const file = event.target.files[0];
          if (!file) return;
          
          try {
              const formData = new FormData();
              formData.append('image', file);
              
              const response = await axios.post('/api/upload-prize-image', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
              
              this.prizes[index].image = response.data.imageUrl;
          } catch (error) {
              console.error('图片上传失败:', error);
              alert('图片上传失败，请重试');
          }
      },
      
      addPrizeLevel() {
          const lastLevel = this.prizes.length;
          this.prizes.push({ 
              level: `${this.ordinal(lastLevel)}等奖`, 
              name: '', 
              quantity: 1,
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
      launchLottery() {
          // 验证数据
          if (!this.lotteryInfo.name) {
              alert('请填写抽奖名称');
              return;
          }
          
          for (const prize of this.prizes) {
              if (!prize.name || !prize.quantity) {
                  alert('请填写完整的奖品信息');
                  return;
              }
          }
          
          // 生成唯一的抽奖码
          const uniqueCode = 'L' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase();

          // 准备提交数据
          const formData = {
              lotteryInfo: this.lotteryInfo,
              prizes: this.prizes,
              participants: this.manualParticipants,
              permissions: {
                  participantVisibility: this.participantVisibility,
                  resultVisibility: this.resultVisibility,
              },
              timeSettings: this.timeSettings,
              lotteryCode: uniqueCode, // 添加抽奖码
          };

          console.log('提交数据:', formData);

          // 显示成功提示并显示抽奖码
          alert(`抽奖活动创建成功！\n抽奖码: ${uniqueCode}`);

          // 实际应用中这里应该调用API提交数据
          // axios.post('/api/create-lottery', formData).then(...)
      }
  }
};
</script>

<style scoped>
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
  background-color: #3abd92;
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
  background-color: #51c9a1;
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
  background: #51c9a1;
  color: white;
  border-color: #51c9a1;
}

.upload-status {
  margin-top: 10px;
  color: #51c9a1;
  font-size: 0.9em;
}

.upload-btn {
  background: #51c9a1;
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
  background-color: #51c9a1;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.generate-btn:hover {
  background-color: #3fa786;
}

</style>
```vue