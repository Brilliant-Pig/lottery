<!-- 🟠 参与者界面
├─ 通过链接访问 ➡️ 实时参与页
│    ├─ 🎰 点击抽奖按钮
│    ├─ 👥 实时显示参与人数
│    └─ 🕒 倒计时组件
└─ 名单用户 ➡️ 自动进入奖池 -->

<template>
    <div id="whole">
        <div id="null">
            <tiny-select v-model="value" placeholder="请选择抽奖活动">
            <tiny-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :icon="item.icon">
            </tiny-option>
            </tiny-select>
        </div>
        <h1>{{Activity}}</h1>
        <p1>抽奖剩余时间：(北京时间)</p1>
        <p2>参与人数：</p2>
        <div id="timer">
            <Timer></Timer>
        </div><!-- 此处为倒计时Timer组件的初设计预留位置 -->
        <div id="men">
            <PeopleRemainder></PeopleRemainder>
        </div><!-- 此处为倒计时实时人数组件的初设计预留位置 -->
            <tiny-button id="GTlottery" type="info" size="large" @click="goToRC"><!-- 用于跳转抽奖页面的按钮 -->
                <span id="BT1">点 我 抽 奖 !</span> 
            </tiny-button>
            <tiny-button id="GTExcel" size="large" @click="goToEX"><!-- 用于跳转抽奖页面的按钮 -->
                <span id="BT2">我 有 名 单 ~</span> 
            </tiny-button>
            
    </div>
</template>

<script setup>
import Timer from '../components/Timer.vue';
import PeopleRemainder from '../components/PeopleRemainder.vue';
import { useRouter } from 'vue-router';
const router =useRouter();

const goToRC = () => {      //路由跳转
    router.push({ path: '/ResultCus'});
};
const goToEX = () => {
    router.push({ path: '/ManagersMain'});
};
</script>
<!-- 以上为引用组件部分 -->

<script>
import user from '../api/user';

export default {
    data(){
        return {
            Activity:"暂时未选中活动哦~"
        };
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
        activityId:{
            type:Number,
            default:1 //Id格式测试用
        },
    },

    methods:{
        async getActive(){//从后端调取相关活动的开展情况
            try{
                const response = await user.getActivityActiveById({
                    activityId: this.activityId//动态获取
                })
                this.Activity = response[0].activityName;
            } catch(error){
                console.error('获取数据失败了:',error);
            }
        }
    },
    mounted(){
        //组件运行先抓活动状态
        this.getActive()

        //每30秒重复执行一次抓取校准
        this.dataTimer = setInterval(() =>{
            this.getActive()
        },60000)
    },

    beforeUnmount(){//在卸载完成前要加载的函数，结束倒计时
        clearInterval(this.dataTimer)
    },
}
</script>

<style>
#whole {                /*页面整体的尺寸 */
    height: 100%;
    width: 100%;
}

#null {                 /*垫了个盒子协调整体布局 */
    width: auto;
    margin-left: 10px;
    margin-top: 0px;
    color:rgb(0, 0, 0);
}

.tiny-select {
    width: 280px;
}

h1 {                    /*h1的CSS */
    width:100%;
    margin-top: 5px;
    margin-bottom: 80px;
    text-align: center;
}

#timer {                /*计时器的预测样式 */
    margin-top: 20px;
    width: 60%;
    text-align: center;
}

#men {                   /*参与人数组件的预测样式 */
    position: absolute;
    width: 20%;
    top: 240px;
    left: 70%;
    font-size: 125px;
}

.CM {                    /*大小字体重点突出的样式 */
    font-size: 45px ;
}

p1 {                     
    margin-left: 5%;
    font-size: 30px;
}

p2 {                     
    margin-left: 40%;
    font-size: 30px;
}

.tiny-button {           /*抽奖按钮的样式 */
    border: 2.5px solid;
}

#BT1 {                   /*按钮一字体的样式 */
    font-size: 20px;
    color: rgb(255, 255, 255);
    font-weight: bold;
}

#BT2 {                   /*按钮二字体的样式 */
    font-size: 20px;
    color: rgb(0, 0, 0);
    font-weight: bold;
}

#GTlottery {             /*按钮一位置布局*/
    margin-top: 8%;
    margin-left: 25%;
}

#GTExcel {               /*按钮二位置布局*/
    margin-top: 8%;
    margin-left: 19%;
}
</style>