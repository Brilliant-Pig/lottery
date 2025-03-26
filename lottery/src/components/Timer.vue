<!-- 这是倒计时组件 -->
<template>
    <div v-if="!isExpired" class="Timer">
        <span class="time">{{ Hours }}</span><span class="chara">时</span>
        <span class="time">{{ Mins }}</span><span class="chara">分</span>
        <span class="time">{{ Seconds }}</span><span class="chara">秒</span>
    </div>
    <div v-else class="expired"><span class="end">活动已结束</span></div>
</template>

<script>
import request from '../utils/request'

export default {
    data(){
        return {
            Hours: 0,
            Mins: 0,
            Seconds: 0,
            isExpired: false,
            endTime:null,
        }
    },
    props: {
        apiUrl: { 
            type: String, 
            required: true 
        },  // 后端接口地址
        interval: { 
            type: Number, 
            default: 30000 
        }, // 数据更新间隔（默认30秒）
        format: { 
            type: String, 
            default: 'HH:mm:ss' 
        }, // 时间格式
        activityId:{
            type:Number,
            default:1
        }
    },
    methods:{
        calculate() {//计算函数
            const RTime = new Date().getTime()//获取现在的时间
            const EndTime = this.endTime//从后端获取终止时间

            const RemainTime = EndTime - RTime//计算差值
            //最近时间戳：1742578500000，可以以此进行CSS修正

            if (RemainTime > 0) {
                this.Hours = Math.floor(RemainTime / (1000 * 60 * 60))//算剩余小时数
                this.Mins = Math.floor(RemainTime % (1000 * 60 * 60) / (1000 * 60))//算剩余分数
                this.Seconds = Math.floor(RemainTime % (1000 * 60) / 1000)//算剩余秒数
            } else {
                this.isExpired = true//要不然就显示活动结束
            }
        },
        async fetchEndTime(){//从后端抓取终止时间
            try{
                const response = await request.get('/127.0.0.1:33001/api/user/getActivityEndTime',{
                    activityId: this.activityId//动态时内部应该改成this.activityId
                })
                this.endTime = response.data//用apiUrl的地址抓取
            } catch (error){//错误判断
                console.error('获取数据失败了:',error);
            }
        }
    },
    mounted(){//每次组件刚加载时必须完成的代码
        //组件运行先抓终止时间
        this.fetchEndTime()
        
        //每30秒重复执行一次抓取校准
        this.dataTimer = setInterval(() =>{
            this.fetchEndTime()
        },30000)
        this.timer = setInterval(() => {//开始循环计算函数
            this.calculate()
        },1000)
    },

    beforeUnmount(){//在卸载完成前要加载的函数，结束倒计时
        clearInterval(this.timer)
    },
}
</script>

<style>
.chara {                    /*大小字体重点突出的样式 */
    font-size: 45px ;
}

.time {
    font-size: 125px;
}

.end {
    font-size: 125px;
}
</style>