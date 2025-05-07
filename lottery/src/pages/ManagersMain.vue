<template>
    <div class="container">
        <p style="font-size: 300%; text-align: center; color: white;">创建抽奖</p>

        <!-- 抽奖基本信息 -->
        <section class="section-bg" style="color: white;">
            <div class="header-bg">
                <h2 style="color: white;">活动内容</h2>
            </div>
            <div class="main-bg" style="color: white;">
                <label for="lotteryName" style="color: white;">抽奖名称*:</label>
                <input type="text" id="lotteryName" v-model="lotteryInfo.name" required class="rounded-input"
                    style="color: white;" />
                <br /><br />
                <label for="lotteryDesc" style="color: white;">抽奖描述:</label>
                <textarea id="lotteryDesc" v-model="lotteryInfo.description" class="rounded-input"
                    style="color: white;"></textarea>
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
            <div class="existing-list-option">
                <h3 style="color: white;">已有名单</h3>
                <button @click="openSavedListsDialog" class="existing-list-btn rounded-box"
                    style="color: white; border-color: white;">
                    我有名单
                </button>
                <div v-if="selectedList" class="selected-list-info" style="color: white; margin-top: 10px;">
                    已选择名单: {{ selectedList.name }} (共 {{ selectedList.count }} 人)
                </div>
            </div>
        </div>
    </div>
    <SavedListsDialog ref="savedListsDialog" :loading="loadingLists" :lists="savedLists"
        @confirm="handleListConfirmed" />
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
                                :class="{ active: participantVisibility === 'public', 'rounded-box': true }">公开</button>
                            <button @click="setParticipantVisibility('admin')"
                                :class="{ active: participantVisibility === 'admin', 'rounded-box': true }">仅管理员</button>
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

                    <div class="permission-section">
                        <h3>抽奖结果查看权限</h3>
                        <div class="permission-options">
                            <button @click="setResultVisibility('public')"
                                :class="{ active: resultVisibility === 'public', 'rounded-box': true }">公开</button>
                            <button @click="setResultVisibility('admin')"
                                :class="{ active: resultVisibility === 'admin', 'rounded-box': true }">仅管理员</button>
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
                    <input type="datetime-local" id="startTime" v-model="timeSettings.startTime"
                        class="rounded-input" />
                    <br /><br />
                    <label for="endTime">结束时间:</label>
                    <input type="datetime-local" id="endTime" v-model="timeSettings.endTime" class="rounded-input" />
                </div>
            </section>
        </div>

        <!-- 修改后的生成按钮 -->
        <div class="button-container">
            <button class="generate-btn rounded-box" @click="launchLottery">生成抽奖</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import SavedListsDialog from '@/components/SavedListsDialog.vue';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
    components: {
        SavedListsDialog
    },
    data() {
        return {
            lotteryInfo: { name: '', description: '' },
            manualParticipants: [{ nickname: '', otherField: '' }],
            participantVisibility: 'public',
            resultVisibility: 'public',
            uploadStatus: null,
            fileType: null,
            savedLists: [],
            selectedList: null,
            loadingLists: false,
            prizes: [
                { level: '一等奖', name: '', quantity: 1, weight: 50, image: null } // 默认比重为 50
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

        async handlePrizeImageUpload(event, index) {
            const file = event.target.files[0];
            if (!file) return;

            // 检查文件类型
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('请上传有效的图片格式 (PNG, JPG, JPEG, GIF)');
                return;
            }

            // 检查文件大小 (限制为5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('图片大小不能超过5MB');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('image', file);
                
                // 添加Content-Type头
                const config = {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                };

                const response = await axios.post('/api/upload-prize-image', formData, config);

                if (response.data && response.data.imageUrl) {
                    this.prizes[index].image = response.data.imageUrl;
                } else {
                    throw new Error('无效的服务器响应');
                }
            } catch (error) {
                console.error('图片上传失败:', error);
                let errorMessage = '图片上传失败，请重试';
                if (error.response) {
                    if (error.response.status === 413) {
                        errorMessage = '文件太大，请上传小于5MB的图片';
                    } else if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }
                alert(errorMessage);
                // 重置文件输入
                event.target.value = '';
            }
        },
        async handleListConfirmed(selectedList) {
            try {
                const response = await axios.get(`/api/saved-participant-lists/${selectedList.id}`);
                this.manualParticipants = response.data.participants.map(p => ({
                    nickname: p.nickname,
                    otherField: p.otherInfo || ''
                }));
                this.selectedList = selectedList;
            } catch (error) {
                console.error('加载名单详情失败:', error);
            }
        },

        setParticipantVisibility(visibility) {
            this.participantVisibility = visibility;
        },

        setResultVisibility(visibility) {
            this.resultVisibility = visibility;
        },
    }

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

.header-bg {
    background-color: rgba(154, 153, 153, 0.153);
    padding: 5px 10px;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: white;
}

.main-bg {
    padding: 15px;
    border-radius: 0 0 8px 8px;
}

.section-bg {
    background-color: rgba(255, 255, 255, 0.103);
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    color: rgb(6, 6, 6);
    border: none;
    cursor: pointer;
    border-radius: 8px;
    margin-right: 10px;
}

.button-container {
    text-align: center;
}

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

.manual-input,
.existing-list-option {
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
    color: rgb(255, 255, 255);
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
    color: white;
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

.existing-list-btn {
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

.row-sections>section {
    flex: 1;
    min-width: 0;
}

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

.selected-list-info {
    font-size: 0.9em;
    padding: 5px;
    background-color: rgba(81, 201, 161, 0.2);
    border-radius: 4px;
}
</style>