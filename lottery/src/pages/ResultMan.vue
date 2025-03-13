<template>
    <div class="container">
        <div class="header">
            <h1>抽奖历史记录</h1>
        </div>
        <div class="list-container">
            <div v-for="record in records" :key="record.id" class="list-item" :class="{ 'winning': record.isWin }">
                <div class="avatar">prize</div>
                <div class="item-content">
                    <div class="title">{{ record.title }}</div>
                    <div class="time">{{ formatTime(record.time) }}</div>
                </div>
                <div class="preview">{{ record.detail }}</div>
            </div>
            </div>
    </div>
    <button class="btn-back" @click="$router.push('/CustomersMain')">返回</button>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
const records = ref([
    {
        id: 1,
        time: new Date('2024-03-15 09:30'),
        title: '一等奖',
        detail: '获得最新款智能手机',
        isWin: true
    },
    {
        id: 2,
        time: new Date('2024-03-14 15:20'),
        title: '未中奖',
        detail: '谢谢参与',
        isWin: false
    },
    {
        id: 3,
        time: new Date('2024-03-13 11:45'),
        title: '二等奖',
        detail: '获得智能手表',
        isWin: true
    },
])

const formatTime = (time) => {
    return dayjs(time).format(' HH:mm')
}

const goBack = () => {
    window.history.back()
}

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

.back-btn:hover {
    background: #06ad56;
}
</style>