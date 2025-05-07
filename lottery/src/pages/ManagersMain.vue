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

        <!-- 参与人员名单上传 -->
    <section class="section-bg">
        <div class="header-bg">
        <h2>参与人员名单</h2>
        </div>
        <div class="main-bg">
        <input 
            type="file" 
            ref="fileInput"
            accept=".csv, .xlsx, .xls"
            @change="handleFileUpload"
            style="display: none"
        >
        <button @click="triggerFileInput" class="rounded-box">
            {{ fileData ? '已选择文件: ' + fileData.name : '上传名单文件' }}
        </button>
        
        <div v-if="fileData" class="file-preview">
            <p>已选择文件: {{ fileData.name }}</p>
            <button @click="parseFile" class="parse-btn">解析文件</button>
        </div>
        
        <div v-if="headers.length > 0" class="column-selector">
            <label>选择姓名列:</label>
            <select v-model="selectedNameColumn">
            <option v-for="header in headers" :key="header" :value="header">
                {{ header }}
            </option>
            </select>
            <button @click="confirmImport" class="confirm-btn">确认导入</button>
        </div>
        
        <div v-if="importStatus" class="import-status">
            {{ importStatus }}
        </div>
        </div>
    </section>

        <!-- 奖项配置 -->
        <section class="section-bg">
            <div class="header-bg">
                <h2>奖项配置</h2>
            </div>
            <div class="main-bg">
                <div v-for="(prize, index) in prizes" :key="index" class="prize-item rounded-input">
                    <h3>{{ ordinal(index) }}等奖</h3>
                    <label>奖品等级:</label>
                    <input type="text" v-model="prize.level" disabled />
                    <br />
                    <label>奖品名称*:</label>
                    <input type="text" v-model="prize.name" required />
                    <br />
                    <label>奖品份数*:</label>
                    <input type="number" v-model="prize.quantity" required />
                    <br />
                    <label>奖品比重*:</label>
                    <input type="number" v-model="prize.weight" required />
                    <br />
                    <label>奖品图片:</label>
                    <div class="image-upload">
                        <input type="file" @change="handlePrizeImageUpload($event, index)" accept="image/*"
                            class="upload-btn" />
                        <span class="upload-icon">+</span>
                    </div>
                    <br />
                    <div class="btn-group">
                        <button @click="removePrizeLevel(index)"
                            class="delete-btn smaller-text shadow-effect">删除</button>
                        <button @click="addPrizeLevel" class="add-btn smaller-text shadow-effect">添加</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 权限设置 -->
        <section class="section-bg">
            <div class="header-bg">
                <h2>权限设置</h2>
            </div>
            <div class="main-bg">
                <div v-for="(option, index) in visibilityOptions" :key="index" class="rounded-input">
                    <label>
                        <input type="checkbox" v-model="visibility" :value="option.value" />
                        {{ option.text }}
                    </label>
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

        <!-- 生成和分享按钮 -->
        <div class="button-container">
            <button class="generate-btn rounded-box" @click="launchLottery">生成</button>
            <button class="share-btn rounded-box">分享</button>
        </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
    data() {
        return {
            lotteryInfo: { name: '', description: '' },
            prizes: [
                { level: '一等奖', name: '', quantity: 1, weight: 50 } // 默认比重为 50
            ],
            showUploadOptions: false,
            timeSettings: { startTime: '', endTime: '' },
            visibility: 'public',
            fileData: null,
            headers: [],
            selectedNameColumn: '',
            participantList: [],
            importStatus: null
        };
    },

    setup() {
        const router = useRouter();
        return { router };
    },

    methods: {
        ordinal(n) { return ["一", "二", "三", "四", "五", "六"][n]; },
        handlePrizeImageUpload(event, index) { /* 图片上传逻辑 */ },
        addPrizeLevel() {
            const lastLevel = this.prizes.length;
            this.prizes.push({ level: `${this.ordinal(lastLevel)}等奖`, name: '', quantity: 1, weight: 50 });
        },
        removePrizeLevel(index) {
            this.prizes.splice(index, 1);
        },
        toggleUploadMethod() { this.showUploadOptions = !this.showUploadOptions; },
        uploadFromExcel() { /* Excel上传逻辑 */ },
        uploadFromCSV() { /* CSV上传逻辑 */ },
        async importData() { /* 数据导入逻辑 */ },
        triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      this.fileData = event.target.files[0];
      this.headers = [];
      this.selectedNameColumn = '';
    },
    
    async parseFile() {
  if (!this.fileData) {
    ElMessage.error('请先选择文件');
    return []; // 返回空数组而不是undefined
  }
  
  try {
    let data;
    if (this.fileData.name.endsWith('.csv')) {
      data = await this.parseCSV(this.fileData);
    } else {
      data = await this.parseExcel(this.fileData);
    }
    
    if (data && data.length > 0) {
      this.headers = Object.keys(data[0]);
      this.importStatus = `成功解析 ${data.length} 条记录`;
      return data; // 确保返回解析的数据
    } else {
      ElMessage.error('文件内容为空');
      return [];
    }
  } catch (error) {
    console.error('解析文件失败:', error);
    ElMessage.error('解析文件失败: ' + error.message);
    return []; // 出错时返回空数组
  }
},
    
    parseCSV(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const result = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, i) => {
              obj[header.trim()] = values[i] ? values[i].trim() : '';
              return obj;
            }, {});
          });
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
    
    async parseExcel(file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(firstSheet);
    },
    
    async confirmImport() {
  if (!this.selectedNameColumn) {
    ElMessage.error('请选择姓名列');
    return;
  }
  
  try {
    const data = await this.parseFile();
    if (data && data.length > 0) {
      this.participantList = data
        .map(item => item[this.selectedNameColumn])
        .filter(name => name); // 过滤掉空值
      
      if (this.participantList.length === 0) {
        ElMessage.error('选择的姓名列中没有有效数据');
        return;
      }
      
      this.importStatus = `成功导入 ${this.participantList.length} 个参与者`;
      ElMessage.success('参与者名单导入成功');
    }
  } catch (error) {
    console.error('导入失败:', error);
    ElMessage.error('导入失败: ' + error.message);
  }
},
launchLottery() {
    if (!this.lotteryInfo.name) {
        ElMessage.error('请填写抽奖名称');
        return;
    }
    if (!this.participantList || this.participantList.length === 0) {
        ElMessage.error('请先导入参与者名单');
        return;
    }

    for (const prize of this.prizes) {
        if (!prize.name || !prize.quantity || !prize.weight) {
            ElMessage.error('请填写奖品名称、奖品份数和比重');
            return;
        }
    }

    // 定义 payload 并传递给 Vuex Store
    const payload = {
        lotteryInfo: this.lotteryInfo,
        prizes: this.prizes,
        participantList: this.participantList,
    };

    // 提交到 Vuex Store
    this.$store.commit('setLotteryData', payload);

    // 跳转到动画页面
    this.router.push({ name: 'TotalAnimation' });
},
executeLottery() {
    const totalWeight = this.prizes.reduce((sum, prize) => sum + prize.weight, 0);
    const winners = [];

    for (const participant of this.participantList) {
        const random = Math.random() * totalWeight;
        let cumulativeWeight = 0;

        for (const prize of this.prizes) {
            cumulativeWeight += prize.weight;
            if (random <= cumulativeWeight && prize.quantity > 0) {
                winners.push({ participant, prize: prize.name });
                prize.quantity--; // 减少奖品数量
                break;
            }
        }
    }

    return winners;
}
    },
};
</script>

<style scoped>
.file-preview {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.parse-btn, .confirm-btn {
  margin-top: 10px;
  padding: 5px 10px;
  background: #3abd92;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.column-selector {
  margin-top: 15px;
}

.column-selector select {
  margin: 0 10px;
  padding: 5px;
}

.import-status {
  margin-top: 10px;
  color: #666;
  font-size: 0.9em;
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
    background-color: #3abd92;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    margin-right: 10px;
}

.button-container {
    text-align: center;
}
</style>