<!-- 这是倒计时组件 -->
<!-- 目前是AI写的初版 -->
<template>
    <div class="countdown">
        <div v-if="!isExpired" class="timer">
        <span>{{ days }}天</span>
        <span>{{ hours }}小时</span>
        <span>{{ minutes }}分钟</span>
        <span>{{ seconds }}秒</span>
        </div>
        <div v-else class="expired">倒计时结束！</div>
    </div>
</template>

<script>
export default {
    data() {
    return {
        targetDate: new Date("2025-03-10T00:00:00"), // 修改目标日期
        now: new Date().getTime(),
        timer: null,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false
    };
    },
    mounted() {
    this.calculateTime();
    this.timer = setInterval(() => {
        this.calculateTime();
    }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        calculateTime() {
        this.now = new Date().getTime();
        const distance = this.targetDate - this.now;

        if (distance < 0) {
            this.isExpired = true;
            clearInterval(this.timer);
            return;
        }

        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        }
    }
};
</script>

<style scoped>
.countdown {
    text-align: center;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
}

.timer span {
    display: inline-block;
    margin: 0 10px;
    padding: 8px 12px;
    background: #ffffff;
    color: rgb(45, 45, 45);
    border-radius: 4px;
    font-size: 1.2em;
}

.expired {
    color: #fffefe;
    font-weight: bold;
    font-size: 1.5em;
}
</style>