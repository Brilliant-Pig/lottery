<template>
    <div class="container">
        <div class="header">
            <h1>抽奖历史记录</h1>
        </div>
        <div class="list-container">
            <div v-if="lotteryHistory.length === 0" class="no-record">
                您还未参与抽奖
            </div>
            <div v-for="record in lotteryHistory" :key="record.time" class="list-item" :class="{ 'winning':isWin( record.award) }">
                <div class="avatar">prize</div>
                <div class="item-content">
                    <div class="title">{{ record.award }}</div>
                    <div class="time">{{ record.time}}</div>
                </div>
                <div class="preview">{{ record.detail }}</div>
            </div>
            </div>
    <button class="btn-back" @click="goBack">返回</button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import {useStore} from 'vuex';

const store = useStore();

const lotteryHistory = computed(() => store.getters.getlotteryHistory);
const isWin = (award) => {
    return award !== '很遗憾，您未中奖';
};
const goBack = () => {
    window.history.back();
};

</script>

<style scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
}

.header {
    background: #ededed;
    padding: 15px;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header h1 {
    margin: 0;
    color: #000;
    font-size: 18px;
    font-weight: 500;
}

.list-container {
    flex: 1;
    overflow-y: auto;
}

.list-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
}

.list-item:hover {
    background: #f8f8f8;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #07c160;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-right: 12px;
}

.item-content {
    flex: 1;
    min-width: 0;
}

.item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.title {
    font-size: 16px;
    color: #000;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.time {
    font-size: 12px;
    color: #888;
}

.preview {
    font-size: 14px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.winning .title {
    color: #07c160;
}

.btn-back {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 40px;
    background: #07c160;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
    background: #06ad56;
}
.no-record {    
    text-align: center;
    font-size: 16px;
    color: #888;
    padding:20px;
}
</style>