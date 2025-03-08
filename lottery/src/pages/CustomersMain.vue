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
        <div id="null">space</div><!-- 用于垫个盒子调整布局 -->
        <h1>抽奖活动{{正在进行/已结束}}</h1>
        <div id="timer">
            XX<span>小时</span>XX<span>分</span>XX<span>秒</span>
        </div><!-- 此处为倒计时Timer组件的初设计预留位置 -->
    </div>
</template>

<script>
export default {  }
</script>

<style>
#whole {
    height: 100%;
    width: 100%;
}

#null {
    width: 100%;
    margin-top: 0px;
    color:white;
}

h1 {
    width:90%;
    margin-top: 5px;
    text-align: center;
}

#timer {
    width: 90%;
    text-align: center;
}
</style>