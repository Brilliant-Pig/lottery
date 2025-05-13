<template>
    <div id="blackhole-bg">
        <!-- 星空背景画布 -->
        <canvas ref="canvas" class="star-canvas"></canvas>

        <!-- 主要内容容器 -->
        <div class="page-wrapper">
            <div class="result-cus-container">
                <!-- 加载状态 -->
                <div v-if="loading" class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <p>加载中...</p>
                </div>

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
                                <span class="detail-value">{{ formatTime(currentResult.time) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 历史记录部分 -->
                <!-- <div class="history-section">
                    <div class="section-header">
                        <h2 class="section-title">抽奖历史记录</h2>
                        <button @click="refreshHistory" class="refresh-btn" :disabled="loading">
                            <span class="refresh-icon" :class="{ 'refreshing': loading }">↻</span>
                            刷新
                        </button>
                    </div>

                    <div v-if="filteredHistory.length" class="history-list">
                        <div v-for="(record, index) in filteredHistory" :key="index" class="history-item"
                            :class="{ 'highlight-item': isCurrentResult(record) }">
                            <div class="record-time">{{ formatTime(record.win_time) }}</div>
                            <div class="record-prize">{{ record.activity_result }}</div>
                            <div class="record-activity">活动: {{ record.activity_name || '未知活动' }}</div>
                        </div>
                    </div>

                    <div v-else class="empty-history">
                        <p>暂无历史抽奖记录</p>
                    </div>
                </div> -->
                <!-- 历史记录部分 -->
                <div class="history-section">
                <div class="section-header">
                    <h2 class="section-title">抽奖历史记录</h2>
                    <button @click="refreshHistory" class="refresh-btn" :disabled="loading">
                    <span class="refresh-icon" :class="{ 'refreshing': loading }">↻</span>
                    刷新
                    </button>
                </div>

                <div v-if="filteredHistory.length" class="history-list">
                    <div v-for="(record, index) in filteredHistory" :key="index" class="history-item">
                    <div class="record-time">{{ formatTime(record.win_time) }}</div>
                    <div class="record-prize">{{ record.activity_result }}</div>
                    <div class="record-activity">活动: {{ record.activity_name || '未知活动' }}</div>
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

<!-- <script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import user from '@/api/user'

//const filteredHistory = ref([]);

export default {
    name: 'ResultCus',
    setup() {
        const store = useStore();
        const router = useRouter();
        const canvas = ref(null);
        const loading = ref(false);
        const filteredHistory= ref([]);

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

// 格式化时间显示 - 只显示日期部分
const formatTime = (time) => {
    if (!time) return '无记录';
    
    // 直接处理数据库返回的 "YYYY-MM-DD HH:mm:ss" 格式
    if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return time.split(' ')[0]; // 只取日期部分
    }
    
    // 其他格式的兼容处理
    const date = new Date(time);
    if (isNaN(date.getTime())) return time; // 如果解析失败，返回原始值
    
    // 格式化为 YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
        // 获取用户历史抽奖记录
        const fetchLotteryHistory = async () => {
    try {
        loading.value = true;
        const username = store.state.user.username;
        if (!username) {
            console.warn('用户名不存在');
            return;
        }

        const response = await user.getUserLotteryHistory({ userName: username });
        console.log('完整API响应:', response);
        filteredHistory.value = response;
        console.log('抽奖历史记录:', filteredHistory.value);
        
    //     if (response && response.data) {
    //     if (Array.isArray(response.data)) {
    //         store.commit('setLotteryHistory', response.data);
    //     } else if (response.data.code === 0 && Array.isArray(response.data.data)) {
    //         store.commit('setLotteryHistory', response.data.data);
    //     } else {
    //         console.error('API返回结构异常:', response.data);
    //     }
    // }
    // loading.value = false;
        // // 更健壮的响应检查
        // if (response && response.data) {
        //     if (Array.isArray(response.data)) {
        //         // 情况1：直接返回数组
        //         store.commit('setLotteryHistory', response.data);
        //     } else if (response.data.code === 0 && Array.isArray(response.data.data)) {
        //         // 情况2：标准响应格式 {code, message, data}
        //         store.commit('setLotteryHistory', response.data.data);
        //     } else {
        //         console.error('API返回数据结构异常:', response.data);
        //     }
        // } else {
        //     console.error('API响应无效:', response);
        // }
    } catch (error) {
        console.error('获取历史记录失败:', error);
        // 可以在这里添加用户提示
    } finally {
        loading.value = false;
    }
};

        // 刷新历史记录
        const refreshHistory = async () => {
            await fetchLotteryHistory();
        };

//         // 计算属性
//         const currentResult = computed(() => {
//             const result = store.state.user.lotteryResult;
//             if (result && !result.time) {
//                 return {
//                     ...result,
//                     time: new Date().toLocaleString()
//                 };
//             }
//             return result;
//         });

//         const allHistory = computed(() => store.state.user.lotteryHistory || []);

//         // 过滤掉当前结果的历史记录
//     const filteredHistory = computed(() => {
//     if (!Array.isArray(allHistory.value) || allHistory.value.length === 0) {
//         return [];
//     }
    
//     return allHistory.value.map(item => ({
//         // 保持与后端字段一致
//         activityName: item.activity_name || item.activityName || '未知活动',
//         prize: item.activity_result || item.prize || '无结果',
//         time: item.win_time || item.time || '无记录',
//         // 保留原始数据
//         ...item
//     })).filter(item => 
//         !currentResult.value || 
//         item.win_time !== currentResult.value.time ||
//         item.activity_result !== currentResult.value.prize
//     );
// });

//         // 检查是否是当前结果
//         const isCurrentResult = (record) => {
//             if (!currentResult.value) return false;
//             return (
//                 record.time === currentResult.value.time &&
//                 record.prize === currentResult.value.prize
//             );
//         };

        // 操作方法
        const handleBack = () => {
            store.commit('clearLotteryResult');
            router.push({ name: 'CustomersMain' });
        };

        const handleShare = () => {
            if (!currentResult.value) return;
            const shareText = `我在抽奖活动中获得了: ${currentResult.value.prize}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('结果已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
                // 兼容不支持clipboard API的浏览器
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('结果已复制到剪贴板');
            });
        };

        // 生命周期
        onMounted(() => {
            initStarBackground();
            window.addEventListener('resize', initStarBackground);
            fetchLotteryHistory();
            console.log(filteredHistory);
            
        });

        return {
            canvas,
            
            filteredHistory,
            
            loading,
            formatTime,
            handleBack,
            handleShare,
            refreshHistory
        };
    }
};

</script> -->

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import user from '@/api/user';

export default {
  name: 'ResultCus',
  data() {
    return {
      canvas: null,
      loading: false,
      filteredHistory: [],
    };
  },
  computed: {
    currentResult() {
      return this.$store.state.user.lotteryResult;
    }
  },
  methods: {
    formatTime(time) {
      if (!time) return '无记录';
      if (typeof time === 'string' && time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return time.split(' ')[0];
      }
      const date = new Date(time);
      if (isNaN(date.getTime())) return time;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async fetchLotteryHistory() {
      this.loading = true;
      try {
        const username = this.$store.state.user.username;
        if (!username) return;
        const response = await user.getUserLotteryHistory({ userName: username });
        this.filteredHistory = response;
        console.log('抽奖历史记录:', this.filteredHistory);
      } catch (error) {
        console.error('获取历史记录失败:', error);
      } finally {
        this.loading = false;
      }
    },
    refreshHistory() {
      this.fetchLotteryHistory();
    },
    handleBack() {
      this.$store.commit('clearLotteryResult');
      this.$router.push({ name: 'CustomersMain' });
    },
    handleShare() {
      if (!this.currentResult) return;
      const text = `我在抽奖活动中获得了: ${this.currentResult.prize}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('结果已复制到剪贴板');
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('结果已复制到剪贴板');
      });
    },
    initStarBackground() {
      const canvas = this.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#191919';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.initStarBackground();
    window.addEventListener('resize', this.initStarBackground);
    this.fetchLotteryHistory();
  }
};
</script>


<style scoped>
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

.page-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 0;
    min-height: 120vh;
    box-sizing: border-box;
}

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

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 16px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #646cff;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.current-result-card,
.history-section {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 20px;
    margin: 0;
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

.refresh-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    transition: all 0.3s ease;
}

.refresh-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.refresh-icon {
    margin-right: 5px;
    transition: transform 0.3s ease;
}

.refresh-icon.refreshing {
    animation: spin 1s linear infinite;
}

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
    color: #70c5ef;
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

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .refresh-btn {
        align-self: flex-end;
    }
}
</style>