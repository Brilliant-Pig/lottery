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
        <section class="section-bg" style="color: white;">
            <div class="header-bg">
                <h2 style="color: white;">参与人员名单</h2>
            </div>
            <div class="main-bg" style="color: white;">
                <div class="participant-options">
                    <div class="manual-input">
                        <h3 style="color: white;">手动输入</h3>
                        <div v-for="(participant, index) in manualParticipants" :key="'manual-' + index"
                            class="participant-row">
                            <input type="text" v-model="participant.nickname" placeholder="昵称" class="rounded-input"
                                style="color: white; background: transparent; border-color: rgba(255,255,255,0.5);" />
                            <input type="text" v-model="participant.otherField" placeholder="其他信息" class="rounded-input"
                                style="color: white; background: transparent; border-color: rgba(255,255,255,0.5);" />
                            <button @click="removeManualParticipant(index)" class="small-btn delete-btn"
                                style="color: white; border-color: white;">
                                删除
                            </button>
                        </div>
                        <button @click="addManualParticipant" class="add-btn"
                            style="color: white; border-color: white;">
                            添加人员
                        </button>
                    </div>

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

        <!-- 奖项配置 -->
        <section class="section-bg" style="color: white;">
            <div class="header-bg">
                <h2 style="color: white;">奖项配置</h2>
            </div>
            <div class="main-bg" style="color: white;">
                <div v-for="(prize, index) in prizes" :key="index" class="prize-container">
                    <div class="prize-item">
                        <h3 style="color: white;">{{ prize.level }}</h3>
                        <div class="prize-row">
                            <div class="prize-field">
                                <label style="color: white;">奖品等级:</label>
                                <input type="text" v-model="prize.level" disabled class="rounded-input"
                                    style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5);" />
                            </div>
                            <div class="prize-field">
                                <label style="color: white;">奖品名称*:</label>
                                <input type="text" v-model="prize.name" required class="rounded-input"
                                    style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5);" />
                            </div>
                            <div class="prize-field">
                                <label style="color: white;">奖品份数*:</label>
                                <input type="number" v-model="prize.quantity" required class="rounded-input"
                                    style="color: white; background-color: transparent; border-color: rgba(255,255,255,0.5);" />
                            </div>
                            <div class="prize-field">
                                <label style="color: white;">奖品图片:</label>
                                <div class="image-upload-container">
                                    <div class="image-upload rounded-input" @click="triggerFileInput(index)"
                                        style="border-color: rgba(255,255,255,0.5);">
                                        <span v-if="!prize.image" class="upload-icon" style="color: white;">+</span>
                                        <img v-else :src="prize.image" class="prize-image" />
                                        <input type="file" ref="fileInput"
                                            @change="handlePrizeImageUpload($event, index)" accept="image/*"
                                            class="upload-btn" style="display: none;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="btn-group">
                            <button @click="removePrizeLevel(index)" class="delete-btn smaller-text shadow-effect"
                                style="color: white; border-color: white;">
                                删除
                            </button>
                            <button @click="addPrizeLevel" class="add-btn smaller-text shadow-effect"
                                style="color: white; border-color: white;">
                                添加
                            </button>
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
                                :class="{ active: participantVisibility === 'public', 'rounded-box': true }">公开</button>
                            <button @click="setParticipantVisibility('admin')"
                                :class="{ active: participantVisibility === 'admin', 'rounded-box': true }">仅管理员</button>
                        </div>
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

export default {
    components: {
        SavedListsDialog
    },
    data() {
        return {
            lotteryInfo: { name: '', description: '' },
            prizes: [{ level: '一等奖', name: '', quantity: 1, image: null }],
            manualParticipants: [{ nickname: '', otherField: '' }],
            participantVisibility: 'public',
            resultVisibility: 'public',
            timeSettings: { startTime: '', endTime: '' },
            uploadStatus: null,
            fileType: null,
            savedLists: [],
            selectedList: null,
            loadingLists: false
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

        async openSavedListsDialog() {
            this.loadingLists = true;
            try {
                const response = await axios.get('/api/saved-participant-lists');
                this.savedLists = response.data;
                this.$refs.savedListsDialog.open();
            } catch (error) {
                console.error('获取名单失败:', error);
                alert('无法加载名单列表');
            } finally {
                this.loadingLists = false;
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

        launchLottery() {
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

            const formData = {
                lotteryInfo: this.lotteryInfo,
                prizes: this.prizes,
                participants: this.manualParticipants,
                permissions: {
                    participantVisibility: this.participantVisibility,
                    resultVisibility: this.resultVisibility
                },
                timeSettings: this.timeSettings
            };

            console.log('提交数据:', formData);
            alert('抽奖活动创建成功！');
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