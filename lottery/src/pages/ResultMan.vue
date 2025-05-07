<template>
    <div class="container">
        <div class="blackhole-bg">
            <canvas ref="canvas"></canvas>
        </div>
        
        <div class="result-content">
            <h1 class="result-title">{{ lotteryInfo.name || '抽奖历史记录' }}</h1>
            
            <div class="result-list-container">
                <div v-if="formattedResults.length === 0" class="no-record">
                    <el-icon :size="40" color="rgba(255,255,255,0.7)"><Box /></el-icon>
                    <p>暂无抽奖记录</p>
                </div>
                
                <div v-else class="result-table">
                    <div class="table-header">
                        <div class="header-item">奖项</div>
                        <div class="header-item">奖品</div>
                        <div class="header-item">中奖者</div>
                    </div>
                    
                    <div v-for="(record, index) in formattedResults" :key="index" 
                         class="table-row" :class="{ 'winning': isWin(record.award) }">
                        <div class="table-cell">{{ record.level }}</div>
                        <div class="table-cell">{{ record.name }}</div>
                        <div class="table-cell winners-cell">
                            <div v-for="(winner, i) in record.winners" :key="i" class="winner-item">
                                {{ i + 1 }}. {{ winner }}
                            </div>
                            <div v-if="!record.winners.length" class="no-winner">暂无中奖者</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="button-container">
                <button class="btn-back" @click="goBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Box } from '@element-plus/icons-vue';

const router = useRouter();
const store = useStore();
const canvas = ref(null);

const lotteryInfo = computed(() => store.getters.getLotteryInfo || {});
const lotteryHistory = computed(() => store.getters.getLotteryHistory || []);

const formattedResults = computed(() => {
    try {
        return lotteryHistory.value.flatMap(record => 
            (record.prizes || []).map(prize => ({
                level: prize.level || '未知奖项',
                name: prize.name || '未知奖品',
                winners: record.winners?.[prize.level] || [],
                time: record.time || '',
                award: prize.level || ''
            }))
        );
    } catch (e) {
        console.error('格式化抽奖结果出错:', e);
        return [];
    }
});

const isWin = (award) => {
    return award && !award.includes('未中奖');
};

const goBack = () => {
    router.push({ name: 'ManagersMain' });  // 修改为跳转到 ManagersMain
};

onMounted(() => {
    initCanvas();
    initStarsAnimation();
});

const initCanvas = () => {
    if (!canvas.value) return;
    
    const element = canvas.value;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    element.width = w;
    element.height = h;
};

const initStarsAnimation = () => {
    if (!canvas.value) return;
    
    const ctx = canvas.value.getContext("2d");
    const stars = [];
    const maxStars = 500;
    
    for (let i = 0; i < maxStars; i++) {
        stars.push({
            x: Math.random() * canvas.value.width,
            y: Math.random() * canvas.value.height,
            radius: Math.random() * 1.5,
            vx: Math.floor(Math.random() * 50) - 25,
            vy: Math.floor(Math.random() * 50) - 25
        });
    }
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.fillStyle = 'rgba(25, 25, 25, 0.8)';
        ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            star.x += star.vx / 100;
            star.y += star.vy / 100;
            
            if (star.x < 0 || star.x > canvas.value.width) star.vx = -star.vx;
            if (star.y < 0 || star.y > canvas.value.height) star.vy = -star.vy;
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();
};
</script>

<style scoped>
.container {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: rgba(25, 25, 25, 1);
}

.blackhole-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.blackhole-bg canvas {
    width: 100%;
    height: 100%;
}

.result-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    color: white;
}

.result-title {
    text-align: center;
    margin: 20px 0;
    font-size: 2rem;
    color: #4dc3d7;
    text-shadow: 0 0 10px rgba(77, 195, 215, 0.7);
    flex-shrink: 0;
}

.result-list-container {
    flex: 1;
    overflow-y: auto;
    margin: 0 auto;
    width: 90%;
    max-width: 900px;
    min-height: 0;
    padding: 10px 0;
}

.result-table {
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    overflow: hidden;
}

.table-header {
    display: flex;
    background: rgba(77, 195, 215, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    font-weight: bold;
}

.header-item {
    flex: 1;
    padding: 15px;
    text-align: center;
    font-size: 1.1rem;
}

.table-row {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s;
}

.table-row:last-child {
    border-bottom: none;
}

.table-row:hover {
    background: rgba(255, 255, 255, 0.1);
}

.table-cell {
    flex: 1;
    padding: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.winners-cell {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}

.winner-item {
    margin: 5px 0;
    padding: 5px;
    font-size: 0.9rem;
}

.winning .table-cell:first-child {
    color: #4dc3d7;
    font-weight: bold;
}

.no-winner {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

.no-record {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    gap: 15px;
}

.button-container {
    flex-shrink: 0;
    padding: 20px 0;
    text-align: center;
}

.btn-back {
    margin: 0 auto;
    padding: 12px 40px;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
    width: fit-content;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}

.result-list-container::-webkit-scrollbar {
    width: 8px;
}

.result-list-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
}

.result-list-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}
</style>