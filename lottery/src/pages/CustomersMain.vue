<!-- 🟠 参与者界面
├─ 通过链接访问 ➡️ 实时参与页
│    ├─ 🎰 点击抽奖按钮
│    ├─ 👥 实时显示参与人数
│    └─ 🕒 倒计时组件
└─ 名单用户 ➡️ 自动进入奖池 -->

<template>
    <div id="whole">
        <div id="null">
            <tiny-input v-model="input" placeholder="请输入活动专属Url  跳转至相应活动抽奖" clearable>
            </tiny-input>
        </div>
        <h1>{{Activity}}</h1>
        <p1>抽奖剩余时间：(北京时间)</p1>
        <p2>参与人数：</p2>
        <div id="timer">
            <Timer :activityUrl="input"></Timer>
        </div><!-- 此处为倒计时Timer组件的初设计预留位置 -->
        <div id="men">
            <PeopleRemainder :activityUrl="input"></PeopleRemainder>
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
import { TinyInput } from '@opentiny/vue'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import user from '../api/user';

//data return层，用于存放默认值
const router =useRouter();
const input = ref('')
const Activity = ref("暂时未选中活动哦~");
const activityUrl = ref('');
let dataTimer = null;

// methods层，用于存放函数方法
    const getActive = async () => {
        try {
            const response = await user.getActivityActiveByUrl({
                activityUrl: input.value
            });
            if (response?.length > 0) {
                Activity.value = response[0].activityName;
            }
            } catch (error) {
                console.error('获取数据失败:', error);
        }
    };

    const goToRC = () => { 
        router.push({ path: '/ResultCus'});
    };

    const goToEX = () => {
        router.push({ path: '/ManagersMain'});
    };

//watch层，用于监测事件
    watch(input, (newVal) => {
        router.replace({
            query: { ...router.query, activityUrl: newVal }
        })
    });//向组件传值

    watch(input, (newVal) => {
        activityUrl.value = newVal; 
    });// 实现双向同步

    watch(activityUrl, (newVal) => {
    if (newVal) getActive(); 
    });// 仅在有效值时触发请求

// Mounted层，预载层，生命周期钩子
    onMounted(() => {
        // 初始化请求（根据业务需求决定是否保留）
        user.getActivityActiveByUrl({ activityUrl: '' });

        // 定时器逻辑优化：使用具名函数避免闭包问题
        dataTimer = setInterval(() => {
            if (activityUrl.value) getActive(); // 避免空参数请求
        }, 5000);
    });

//BeforeOnMount层，用于卸载事件。
    onBeforeUnmount(() => {
        clearInterval(dataTimer); // 清理定时器
    });
</script>

<style>
#whole {                /*页面整体的尺寸 */
    height: 100%;
    width: 100%;
}

#null {                 /*垫了个盒子协调整体布局 */
    width: 25%;
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
    color: rgb(107, 252, 216);
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
    color: white;
}

p2 {                     
    margin-left: 40%;
    font-size: 30px;
    color: white;
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


<!-- 老代码option API记录 -->
<!-- <script>
import user from '../api/user';

export default {
    data(){
        return {
            Activity:"暂时未选中活动哦~",
            input:'',
            activityUrl:'',
        };
    },

    emits: ['check'],

    methods:{
        getActivityUrl(){
            const inputUrl = this.input
            this.activityUrl = inputUrl
        },

        async getActive(){//从后端调取相关活动的开展情况    
            console.log("input",this.input);
            
            try{
                const response = await user.getActivityActiveByUrl({
                    activityUrl: this.input//动态获取
                })
                console.log(response);
                
                this.Activity = response[0].activityName;
            } catch(error){
                console.error('获取数据失败了:',error);
            }
           // this.$emit('check',activityUrl);
        }
    },

    watch: {
        input(newVal) { 
            this.activityUrl = newVal;
        }, // 手动同步
        activityUrl(newVal) { 
            this.getActive(newVal); 
            console.log(this.activityUrl);
            
        },
    },

    mounted(){
        //组件运行先抓活动状态
        user.getActivityActiveByUrl({})
        //每30秒重复执行一次抓取校准
        this.dataTimer = setInterval(() =>{
            this.getActive();
        },5000)

    },

    beforeUnmount(){//在卸载完成前要加载的函数，结束倒计时
        clearInterval(this.dataTimer)
    },
}
</script> -->
