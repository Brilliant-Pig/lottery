<template>
    <div id="PR">
        <span class="Re">{{Re}}</span><span class="chara">人</span>
    </div>
</template>

<script>
import user from '../api/user';

export default {
    data(){
        return{
            Re:0,
        }
    },
    props: {
        apiUrl: { 
            type: String, 
            required: true 
        },  // 后端接口地址
        interval: { 
            type: Number, 
            default: 10000 
        }, // 数据更新间隔（默认10秒）
        format: { 
            type: String, 
            default: '' 
        },// 时间格式
        activityRemainPeople:{
            type: Number,
            default:''
        }, //人数格式
        activityUrl:{
            type:Number,
            default:1 //Id格式
        }
    },
    methods:{
        async getNewRemainder(){//异步处理获取后端活动剩余人数信息
            try{
                const response = await user.getActivityRemainsByUrl({
                    activityUrl: this.activityUrl//动态时内部应该改成this.activityUrl
                })
                this.Re = response[0].activityRemainPeople//用数组中自己需要的数据
            } catch (error){//错误判断
                console.error('获取数据失败了:',error);
            }
        }
    },
    mounted(){
        this.getNewRemainder()//取用函数先调取目标活动

        this.dataTimer = setInterval(() =>{
            this.getNewRemainder()//使用计时器30秒校准一次
        },30000)
    },
    
    beforeUnMount(){
        clearInterval(this.dataTimer)//离开页面清除调用
    },
}
</script>

<style>
.chara {                    /*大小字体重点突出的样式 */
    font-size: 45px ;
}

.Re {
    font-size: 125px;
}

.end {
    font-size: 125px;
}
</style>