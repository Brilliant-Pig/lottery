<template>
<div class="container">
    <div v-if="showResult" class="result-modal">
        <div class="modal-content">
            <h1 class="result-title">{{result}}</h1>
            <button @click="goBack" class="back-btn">返回</button>
    </div>
</div>
</div>
</template>

<script>
import { ref,computed } from 'vue';
export default {
    name: 'result-cus',
    setup() {
        const number = ref('');
        const remainTimes = ref(1);
        const showResult = ref(false);
        const isDrawing = ref(false);
        const prizeLevel = ref(null);
        const effectBalls = ref([]);
        let animationFrame=null;
        const creatEffectBall = () => {
            const balls = [];
            const colors = ['#ff6b6b', '#4CAF50', '#2196F3', '#9C27B0'];
            for(let i=0;i<15;i++) {
                balls.push({
                    style: {
                        left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                width: Math.random() * 30 + 10 + 'px',
                height: Math.random() * 30 + 10 + 'px',
                background: colors[Math.floor(Math.random() * colors.length)],
                animationDelay: Math.random() * 2 + 's'
                }
            });
            }
            effectBalls.value = balls;
        };

        const startEffect = () => {
            stopEffect();
            creatEffectBalls();
            animationFrame = requestAnimationFrame(animateEffect);
            };
            const stopEffect = () => {
            if(animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            effectBalls.value = [];
        };
const animate = () => {
    effectBalls.value.forEach(ball => {
        const x = parseFloat(ball.style.left) + (Math.random() - 0.5) * 2;
        const y = parseFloat(ball.style.top) + (Math.random() - 0.5) * 2;
        ball.style.left = Math.min(95, Math.max(5, x)) + '%';
        ball.style.top = Math.min(95, Math.max(5, y)) + '%';      
    });
    animationFrame = requestAnimationFrame(animate);
};
        const prizes=[
            {level:  '一等奖',probability: 0.2},
            {level:  '二等奖',probability: 0.3},
            {level:  '三等奖',probability: 0.4},
        ];
        const isWinner = computed(() => prizeLevel.value !== null);
        const resultMessage = computed(() => {
                return isWinner.value
                ? `恭喜您获得${prizeLevel.value}！` 
                : "很遗憾，您本次没有中奖！";
        });
        const resultClass = computed(() => ({
            'win-text': isWinner.value,
            'lose-text': !isWinner.value
        }));
        const buttonText = computed(() => {
            if(isDrawing.value) return '抽奖中...';
            if(remainTimes.value<=0) return '抽奖次数用完';
            return '点击抽奖';
            });
        const start = () => {
            if(!number.value) {
                alert('请输入学号');
                return;
            }
            isDrawing.value=true;
            remainTimes.value--;
            setTimeout(() => {
                const random = Math.random();
                let accumulated=0;
                for(const prize of prizes) {
                    accumulated+=prize.probability;
                    if(random<accumulated) {
                        prizeLevel.value=prize.level;
                        break;
                    }
                }
                showResult.value=true;
                isDrawing.value=false;
            }, 1500);
    } ;
    return {
        effectBalls,
        number,
        remainTimes,
        start,
        showResult,
        isDrawing,
        prizeLevel,
        prizes,
        isWinner,
        resultMessage,
        resultClass,
        buttonText,
        };
    }
};
</script>

<style>
.effect-container { 
    position: relative;
    width: 100%;
    height: 100%;    
    z-index: 99;
}
.effect-ball {
    position: absolute;
    opacity: 0.8;
    width: 50px;
    height: 50px;    
    border-radius: 50%;
    filter:blur(0.5px);
    animation: bounch 2s ease-in-out infinite,colorShift 4s infinite;
    z-index: 100;
}
@keyframes bounch {
    0%, 100% {
        transform: scale(0.5);
    }
    50% {
        transform: scale(1);}
    }
    @keyframes colorShift {
    0% {filter:hue-rotate(0deg);}
    100% {filter:hue-rotate(0deg);}
}
.result-cus {    
    text-align: center;
    margin-top: 50px;
    font-size: 22px;
    color: #232222;
    max-width:500px;
    margin: 50px auto;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(8, 8, 8, 0.1);
}

.result-box{
    margin-top:30px;
    padding: 20px;
    background: #62c196;
    border-radius:20px;
    animation:fade-in 2s ease-in-out;
}
.win-text{
    color: #e7f3ee;
    font-size: 35px;
}
.lose-text{
    color: #fbfbfa;
    font-size: 35px;
}
@keyframes fade-in {
    from {
        opacity: 0;transform:translateY(20px);
    }
    to {
        opacity: 1;transform:translateY(0);
    }
    }
.result-cus button {        
    background-color: #63a890;
    color: rgb(252, 252, 252);
    padding: 15px 25px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.8s ease-in-out;
    margin-top: 20px;
}
.result-cus button:hover:not(:disabled) {
    background-color: #32454d;
    transform: scale(1.4);
    color: #8d9698;
}   
.result-cus button:disabled {
    background-color: #6ccdb5;
    cursor: not-allowed;
    opacity: 0.5;
}
input{
    padding:5px;
    margin:1px 0;
    width:200px;
    border:2px solid #ddd;
    border-radius:8px;
    font-size:16px;
}
input:disabled{
    background-color:#f2f2f2;
    cursor:not-allowed;
}
</style>