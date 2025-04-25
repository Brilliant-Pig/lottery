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
                <button @click="toggleUploadMethod" class="rounded-box">上传</button>
                <div v-if="showUploadOptions" class="upload-options">
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
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
    data() {
        return {
            lotteryInfo: { name: '', description: '' },
            prizes: [{ level: '一等奖', name: '', quantity: 1 }],
            showUploadOptions: false,
            timeSettings: { startTime: '', endTime: '' },
            visibility: 'public',
            fileData: null,
            headers: [],
            importStatus: null,
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
            this.prizes.push({ level: `${this.ordinal(lastLevel)}等奖`, name: '', quantity: 1 });
        },
        removePrizeLevel(index) {
            this.prizes.splice(index, 1);
        },
        toggleUploadMethod() { this.showUploadOptions = !this.showUploadOptions; },
        uploadFromExcel() { /* Excel上传逻辑 */ },
        uploadFromCSV() { /* CSV上传逻辑 */ },
        async importData() { /* 数据导入逻辑 */ },
        launchLottery(){
            if(!this.lotteryInfo.name){
                alert('请填写抽奖名称');
                return;
            }
            for(const prize of this.prizes){
                if(!prize.name || !prize.quantity){
                    alert('请填写奖品名称和奖品份数');
                    return;
                }
            }
            this.router.push({ name: 'TotalAnimation' });
        }
    },
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