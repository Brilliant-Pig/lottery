<template>
    <div class="container">

        <!-- 抽奖结果 -->
        <div v-if="showResult" class="result-modal">
            <div class="modal-content">
                <h1 class="result-title">{{ result }}</h1>
                <button @click="goBack" class="back-btn">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    
    setup() {
        const store = useStore();
        const router = useRouter();
        const showResult = ref(false);
        const result = ref('');
        const prizeOptions = [
            '恭喜您获得一等奖',
            '恭喜您获得二等奖',
            '恭喜您获得三等奖',
            '很遗憾，您未中奖'
        ];

        const generateResult = () => {
            setTimeout(() => {
                const randomNum = Math.floor(Math.random() * prizeOptions.length);
                result.value = prizeOptions[randomNum];
                showResult.value = true;

                store.commit('addLotteryHistory', {
                    time: new Date().toLocaleString(),
                    award: result.value,
                });
            }, 1000);
        };

        const goBack = () => {
            router.push({ name: 'ResultMan' })
        };

        onMounted(() => {
            generateResult();
        });

        return {
            showResult,
            result,
            goBack
        };
    }
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    width:100%;
    background: #f5f5f5;
    /* 浅灰色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.result-modal {
    background: white;
    /* 白底 */
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 40%;
    max-width: 300px;
}

.result-title {
    color: #0f0e0e;
    /* 黑色文字 */
    font-size: 25px;
    margin-bottom: 30px;
}

.back-btn {
    background: #2f8ae4;
    /* 蓝色按钮 */
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.1s;
}

.back-btn:hover {
    background: #214566;
    /* 深蓝色悬停效果 */
}
</style>