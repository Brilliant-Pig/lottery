<!-- 这是倒计时组件 -->
<template>
    <div v-if="!isExpired" class="Timer">
        <span class="time">{{ Hours }}</span><span class="chara">时</span>
        <span class="time">{{ Mins }}</span><span class="chara">分</span>
        <span class="time">{{ Seconds }}</span><span class="chara">秒</span>
    </div>
    <div v-else class="expired">活动已经结束啦~</div>
</template>

<script setup>//全局JavaScript设置
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
    data(){
        return {
            Hours: 0,
            Mins: 0,
            Seconds: 0,
            isExpired: false,
        }
    },

    props: {
        apiUrl: { type: String, required: true },  // 后端接口地址
        interval: { type: Number, default: 30000 }, // 数据更新间隔（默认30秒）
        format: { type: String, default: 'HH:mm:ss' } // 时间格式
    },
    methods:{
        calculate() {//计算函数
            const RTime = new Date().getTime()//获取现在的时间
            const EndTime = this.endTime//从后端获取终止时间

            const RemainTime = EndTime - RTime//计算差值

            if (RemainTime > 0) {
                this.Hours = Math.floor(RemainTime / (1000 * 60 * 60))//算剩余小时数
                this.Mins = Math.floor(RemainTime % (1000 * 60 * 60))//算剩余分数
                this.Seconds = Math.floor(RemainTime % (1000 * 60))//算剩余秒数
            } else {
                this.isExpired = true//要不然就显示活动结束
            }
        },
        async
    }
}
</script>

<style>

</style>