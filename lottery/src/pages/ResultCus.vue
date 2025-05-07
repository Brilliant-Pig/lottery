<template>
    <div id="blackhole-bg">
        <!-- 星空背景画布 -->
        <canvas ref="canvas" class="star-canvas"></canvas>

        <!-- 主要内容容器 - 添加了外层flex容器实现垂直居中 -->
        <div class="page-wrapper">
            <div class="result-cus-container">
                <!-- 当前抽奖结果卡片 -->
                <div v-if="currentResult" class="current-result-card">
                    <h2 class="section-title">本次抽奖结果</h2>
                    <div class="prize-display">
                        <div class="prize-text">{{ currentResult.prize }}</div>
                        <div class="result-details">
                            <div class="detail-item">
                                <span class="detail-label">用户:</span>
                                <span class="detail-value">{{ currentResult.userName || '匿名用户' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">活动:</span>
                                <span class="detail-value">{{ currentResult.activityName || '未知活动' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">时间:</span>
                                <span class="detail-value">{{ currentResult.time }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 历史记录部分 -->
                <div class="history-section">
                    <h2 class="section-title">抽奖历史记录</h2>

                    <div v-if="filteredHistory.length > 0" class="history-list">
                        <div v-for="(record, index) in filteredHistory" :key="index" class="history-item"
                            :class="{ 'highlight-item': isCurrentResult(record) }">
                            <div class="record-time">{{ record.time }}</div>
                            <div class="record-prize">{{ record.prize }}</div>
                            <div class="record-activity">活动: {{ record.activityName || '未知活动' }}</div>
                        </div>
                    </div>

                    <div v-else class="empty-history">
                        <p>暂无历史抽奖记录</p>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <button @click="handleBack" class="custom-btn back-btn">
                        <span class="btn-icon">←</span> 返回
                    </button>
                    <button v-if="currentResult" @click="handleShare" class="custom-btn share-btn">
                        <span class="btn-icon">↗</span> 分享结果
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'ResultCus',
    setup() {
        const store = useStore();
        const router = useRouter();
        const canvas = ref(null);

        // 初始化星空背景
        const initStarBackground = () => {
            const ctx = canvas.value.getContext('2d');
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.value.width = width;
            canvas.value.height = height;

            // 绘制星空效果
            ctx.fillStyle = '#191919';
            ctx.fillRect(0, 0, width, height);

            // 绘制星星
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 1.5;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // 计算属性
        const currentResult = computed(() => store.state.lotteryResult);
        const allHistory = computed(() => store.state.lotteryHistory || []);

        // 过滤掉当前结果的历史记录
        const filteredHistory = computed(() => {
            if (!currentResult.value) return allHistory.value;
            return allHistory.value.filter(item =>
                item.time !== currentResult.value.time ||
                item.prize !== currentResult.value.prize
            );
        });

        // 检查是否是当前结果
        const isCurrentResult = (record) => {
            if (!currentResult.value) return false;
            return (
                record.time === currentResult.value.time &&
                record.prize === currentResult.value.prize
            );
        };

        // 操作方法
        const handleBack = () => {
            store.commit('clearLotteryResult');
            router.push({ name: 'CustomersMain' }); // 明确跳转到CustomersMain页面
        };

        const handleShare = () => {
            if (!currentResult.value) return;
            const shareText = `我在抽奖活动中获得了: ${currentResult.value.prize}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('结果已复制到剪贴板');
            });
        };

        // 生命周期
        onMounted(() => {
            initStarBackground();
            window.addEventListener('resize', initStarBackground);
        });

        return {
            canvas,
            currentResult,
            filteredHistory,
            isCurrentResult,
            handleBack,
            handleShare
        };
    }
};
</script>

<style scoped>
/* 基础样式 */
#blackhole-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    color: white;
    display: flex;
    flex-direction: column;
}

.star-canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
}

/* 新增的页面包裹层 - 实现垂直居中 */
.page-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* 垂直居中 */
    padding: 40px 0;
    /* 上下留白 */
    min-height: 120vh;
    box-sizing: border-box;
}

/* 调整主容器样式 */
.result-cus-container {
    position: relative;
    z-index: 2;
    max-width: 700px;
    width: 90%;
    margin: 0 auto;
    padding: 50px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transform: translateY(0);
    /* 初始位置 */
    animation: floatUp 0.5s ease-out forwards;
}

@keyframes floatUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 卡片样式 */
.current-result-card,
.history-section {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.section-title {
    font-size: 20px;
    margin-bottom: 20px;
    color: #ffffff;
    position: relative;
    padding-bottom: 10px;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #646cff, #61dafb);
}

/* 奖品显示样式 */
.prize-display {
    padding: 15px 0;
}

.prize-text {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #61dafb;
    text-shadow: 0 0 10px rgba(97, 218, 251, 0.3);
}

.result-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.detail-item {
    display: flex;
    align-items: center;
}

.detail-label {
    opacity: 0.8;
    margin-right: 8px;
}

.detail-value {
    font-weight: 500;
}

/* 历史记录样式 */
.history-list {
    display: grid;
    gap: 15px;
}

.history-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.history-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.highlight-item {
    border-left: 4px solid #646cff;
    background-color: rgba(100, 108, 255, 0.1);
}

.record-time {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 5px;
}

.record-prize {
    font-size: 18px;
    margin: 8px 0;
    color: #4caf50;
}

.record-activity {
    font-size: 14px;
    opacity: 0.8;
}

.empty-history {
    text-align: center;
    padding: 40px 0;
    opacity: 0.6;
}

/* 按钮样式 */
.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
}

.custom-btn {
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
}

.back-btn {
    background-color: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}

.share-btn {
    background-color: rgba(100, 108, 255, 0.2);
    color: #646cff;
    border: 2px solid rgba(100, 108, 255, 0.5);
}

.share-btn:hover {
    background-color: rgba(100, 108, 255, 0.3);
}

.btn-icon {
    margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .page-wrapper {
        padding: 20px 0;
    }

    .result-cus-container {
        padding: 25px;
        width: 95%;
    }

    .current-result-card,
    .history-section {
        padding: 20px;
    }

    .prize-text {
        font-size: 24px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 15px;
    }

    .custom-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>