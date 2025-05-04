<!-- 🟠 参与者界面 -->
<template>
    <div id="whole">
        <div id="null">
            <tiny-input v-model="input" placeholder="请输入活动专属Url  跳转至相应活动抽奖" clearable>
            </tiny-input>
        </div>
        <h1>{{ activityName }}</h1>
        <p1>抽奖剩余时间：(北京时间)</p1>
        <p2>参与人数：</p2>
        <div id="timer">
            <Timer :activityUrl="input"></Timer>
        </div>
        <div id="men">
            <PeopleRemainder :activityUrl="input"></PeopleRemainder>
        </div>
        <tiny-button id="GTlottery" type="info" size="large" @click="goToRC" :disabled="isLoading">
            <span id="BT1">点 我 抽 奖 !</span> 
            <tiny-loading v-if="isLoading" class="loading-spinner"></tiny-loading>
        </tiny-button>
        <tiny-button id="GTExcel" size="large" @click="goToEX">
            <span id="BT2">我 有 名 单 ~</span> 
        </tiny-button>
    </div>
</template>

<script setup>
import Timer from '../components/Timer.vue';
import PeopleRemainder from '../components/PeopleRemainder.vue';
import { useRouter } from 'vue-router';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import user from '../api/user';
import { useUserStore } from '../store/user'; // 修改为您的实际路径

const userStore = useUserStore();
const userName = userStore.username;
const router = useRouter();
const input = ref('');
const activityName = ref("暂时未填写活动url哦~");
const isLoading = ref(false);
let dataTimer = null;

// 获取活动信息
const getActive = async () => {
    if (!input.value) {
        activityName.value = "未填写活动URl";
        return;
    }
    
    try {
        const response = await user.getActivityActiveByUrl({
            activityUrl: input.value.trim()
        });
        
        console.log('API响应:', response); // 调试日志
        
        if (response && response.activityName) {
            activityName.value = response.activityName;
        } else {
            activityName.value = `未找到活动: ${input.value}`;
            console.warn('未找到活动，返回数据:', response);
        }
    } catch (error) {
        console.error('获取活动失败:', {
            error,
            url: input.value
        });
        activityName.value = "获取活动信息出错";
        ElMessage.error('获取活动信息失败');
    }
};

// 抽奖逻辑
const goToRC = async () => {
    if (isLoading.value) return;
    
    if (!input.value.trim()) {
        return ElMessage.error('请输入正确活动URL哦~');
    }
    // 明确检查登录状态
    if (!userStore.token || !userStore.username) {
        ElMessage.warning('请先登录');
        return router.push('/LoginMain');
    }

    isLoading.value = true;
    
    try {
        const response = await user.drawLotteryByUser({
            activityUrl: input.value,
            userName: userStore.username // 使用 Pinia 中的用户名
        });

        if (response.code !== 0) {
            throw new Error(response.message || '抽奖失败');
        }

        userStore.setLotteryResult(response.data); // 使用 Pinia 存储结果
        await router.push('/animation');
    } catch (error) {
        ElMessage.error(error.message);
    } finally {
        isLoading.value = false;
    }
};

const goToEX = () => {
    router.push({ path: '/ManagersMain' });
};

// 监听输入变化(修改后的)
watch(input, async (newVal) => {
    if (!newVal.trim()) {
        activityName.value = "暂时未填写活动url哦~";
        return;
    }
    
    try {
        // 使用正确的API方法名
        const response = await user.getActivityActiveByUrl({
            activityUrl: newVal.trim()
        });
        
        console.log('活动状态响应:', response); // 调试日志
        
        if (response && response.activityStatus) {
            activityName.value = response.activityName;
            
            // 检查活动状态
            if (response.activityStatus !== 'ongoing') {
                const statusMap = {
                    'unstarted': '未开始',
                    'ended': '已结束',
                    'draft': '未发布'
                };
                ElMessage.warning(`活动当前状态: ${statusMap[response.activityStatus] || response.activityStatus}`);
            }
        } else {
            activityName.value = `未找到活动: ${newVal}`;
        }
    } catch (error) {
        console.error('活动检查失败:', error);
        activityName.value = "获取活动信息出错";
        ElMessage.error('活动信息获取失败');
    }
}, { immediate: true });

// 生命周期钩子
onMounted(() => {
    dataTimer = setInterval(() => {
        if (input.value) getActive();
    }, 5000);
});

onBeforeUnmount(() => {
    clearInterval(dataTimer);
});
</script>

<style>
#whole {
    height: 100%;
    width: 100%;
}

#null {
    width: 25%;
    margin-left: 10px;
    margin-top: 0px;
    color: rgb(0, 0, 0);
}

h1 {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 80px;
    text-align: center;
    color: rgb(107, 252, 216);
}

#timer {
    margin-top: 20px;
    width: 60%;
    text-align: center;
}

#men {
    position: absolute;
    width: 20%;
    top: 240px;
    left: 70%;
    font-size: 125px;
}

.p1.p2 {
    font-size: 30px;
    color: white;
}

.p1 {
    margin-left: 5%;
}

.p2 {
    margin-left: 40%;
}

.tiny-button {
    border: 2.5px solid;
}

#BT1 {
    font-size: 20px;
    color: rgb(255, 255, 255);
    font-weight: bold;
}

#BT2 {
    font-size: 20px;
    color: rgb(0, 0, 0);
    font-weight: bold;
}

#GTlottery {
    margin-top: 8%;
    margin-left: 25%;
    position: relative;
}

#GTExcel {
    margin-top: 8%;
    margin-left: 19%;
}

.loading-spinner {
    position: absolute;
    right: 10px;
}
</style>