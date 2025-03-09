<!-- 🟠 参与者界面
├─ 通过链接访问 ➡️ 实时参与页
│    ├─ 🎰 点击抽奖按钮
│    ├─ 👥 实时显示参与人数
│    └─ 🕒 倒计时组件
└─ 名单用户 ➡️ 自动进入奖池 -->
<script setup>
import Timer from '../components/Timer.vue'
</script>

<!-- 以上为引用组件部分 -->

<template>
    <div id="whole">
        <div id="null">
            <tiny-select v-model="value" placeholder="请选择抽奖活动">
            <tiny-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :icon="item.icon">
            </tiny-option>
            </tiny-select>
        </div>
        <h1>抽奖活动{{正在进行/已结束}}</h1>
        <p1>抽奖剩余时间：</p1>
        <p2>剩余人数：</p2>
        <div id="timer">
            XX<span class="CM">小时</span>XX<span class="CM">分</span>XX<span class="CM">秒</span>
        </div><!-- 此处为倒计时Timer组件的初设计预留位置 -->
        <div id="men">
            XX<span class="CM">人</span>
        </div><!-- 此处为倒计时实时人数组件的初设计预留位置 -->
        <div>
        </div>
    </div>
</template>

<script>
export default {  }
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
    width:90%;
    margin-top: 5px;
    margin-bottom: 80px;
    text-align: center;
}

#timer {                /*计时器的预测样式 */
    margin-top: 20px;
    width: 60%;
    text-align: center;
    font-size: 125px;
}

#men {
    position: absolute;
    width: 20%;
    top: 240px;
    left: 70%;
    font-size: 125px;
}

.CM {
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

</style>