<!-- 这是倒计时组件 -->
<template>
    <div v-if="!ifExpired" class="Timer">
        <span class="time">{{ Hours }}</span><span class="chara">时</span>
        <span class="time">{{ Mins }}</span><span class="chara">分</span>
        <span class="time">{{ Seconds }}</span><span class="chara">秒</span>
    </div>
    <div v-else class="expired">活动已经结束啦~</div>
</template>

<script setup>
import request from '../utils/request';

// 获取用户列表
request.get('http://0.0.0.0:33001', { params: { page: 1, size: 10 } })
    .then(response => {
    console.log('响应数据:', response.data);
    })
    .catch(error => {
    console.error('请求失败:', error);
    });

</script>

<script>
export default {
    props: {
    apiUrl: { type: String, required: true },  // 后端接口地址
    interval: { type: Number, default: 30000 }, // 数据更新间隔（默认30秒）
    format: { type: String, default: 'HH:mm:ss' } // 时间格式
    }
}
</script>

<style>

</style>