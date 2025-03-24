<template>
    <div class="container">
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
import {useStore} from 'vuex';

export default {
    setup() {
        const store = useStore();
        const showResult = ref(false);
        const result = ref('');
        const prizeOptions = [
            '恭喜您获得一等奖',
            '恭喜您获得二等奖',
            '恭喜您获得三等奖',
            '很遗憾，您未中奖'
        ];
        const generateResult = () => {
            const randomNum = Math.floor(Math.random() * prizeOptions.length);
            result.value = prizeOptions[randomNum];
            showResult.value = true;
        
        store.commit('addLotteryHistory',{
            time: new Date().toLocaleString(),
            award: result.value
        });
    };
        const goBack = () => {
            window.history.back();
        };
        onMounted(() => { generateResult(); 
        });
        return {
            showResult,
            result, goBack
        };
    }
};


</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #fbfbfc;
}

.result-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 200px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.result-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
}

.back-btn {
    width: 100px;
    height: 40px;
    background: #2f8ae4;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
}

@keyframes popup {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>