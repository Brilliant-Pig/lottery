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

                <!-- 历史记录部分 -->
                <div class="history-section">
                    <div class="section-header">
                        <h2 class="section-title">创建的抽奖活动结果</h2>
                        <button @click="refreshHistory" class="refresh-btn" :disabled="loading">
                            <span class="refresh-icon" :class="{ 'refreshing': loading }">↻</span>
                            刷新
                        </button>
                    </div>

                    <div v-if="creatorHistory.length" class="history-list">
                        <div v-for="(records, activityName) in groupByActivity(creatorHistory)" 
                            :key="activityName" class="activity-group">
                            <div class="activity-header" @click="toggleActivity(activityName)">
                                <h3 class="activity-title">{{ activityName }}</h3>
                                <span class="toggle-icon">
                                    {{ expandedActivities.includes(activityName) ? '▼' : '►' }}
                                </span>
                                <button class="export-btn" @click.stop="exportToExcel(records, activityName)">
                                    <span class="export-icon">📊</span> 导出
                                </button>
                            </div>
                            <div v-if="expandedActivities.includes(activityName)" class="activity-records">
                                <div v-for="(record, index) in records" 
                                    :key="index" class="history-item">
                                    <div class="record-time">{{ formatTime(record.win_time) }}</div>
                                    <div class="record-prize">{{ record.activity_result }}</div>
                                    <div class="record-winner">获奖用户: {{ record.winner_name || '无' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-history">
                        <p v-if="!loading">暂无创建的抽奖活动记录</p>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <button @click="handleBack" class="custom-btn back-btn">
                        <span class="btn-icon">←</span> 返回
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

export default {
    name: 'ResultMan',
    data() {
        return {
            canvas: null,
            loading: false,
            creatorHistory: [], // 存储创建者的抽奖历史记录
            expandedActivities: [], // 存储展开的活动名称
        };
    },

    computed: {
        groupByActivity() {
            return (records) => {
                const grouped = {};
                records.forEach(record => {
                    const key = record.activity_name || '未命名活动';
                    if (!grouped[key]) {
                        grouped[key] = [];
                    }
                    grouped[key].push(record);
                });
                return grouped;
            };
        }
    },
    methods: {
        formatTime(time) {
            if (!time) return '无记录';
            // 处理字符串格式的时间
            if (typeof time === 'string') {
                return time.split('T')[0]; // 处理ISO格式
            }
            // 处理Date对象
            const date = new Date(time);
            return date.toLocaleDateString();
        },
        
        async fetchCreatorHistory() {
            this.loading = true;
            try {
                const username = this.$store.state.user.username;
                if (!username) {
                    console.warn('用户名不存在');
                    return;
                }
                
                const response = await this.$http.get('/api/user/getCreatorLotteryHistory', {
                    params: {
                        userName: username
                    }
                });

                if (response.data?.code === 0) {
                    this.creatorHistory = response.data.data || [];
                } else {
                    console.error('获取数据失败:', response.data?.message);
                    this.creatorHistory = [];
                }
            } catch (error) {
                console.error('请求失败:', error);
                this.creatorHistory = [];
            } finally {
                this.loading = false;
            }
        },
        
        refreshHistory() {
            this.fetchCreatorHistory();
        },
        
        handleBack() {
            this.$router.push({ name: 'mainpages' });
        },
        
        toggleActivity(activityName) {
            const index = this.expandedActivities.indexOf(activityName);
            if (index >= 0) {
                this.expandedActivities.splice(index, 1);
            } else {
                this.expandedActivities.push(activityName);
            }
        },
        
        exportToExcel(records, activityName) {
            try {
                // 准备数据
                const data = records.map(record => ({
                    '活动名称': record.activity_name || '未命名活动',
                    '获奖时间': this.formatTime(record.win_time),
                    '奖项': record.activity_result,
                    '获奖用户': record.winner_name || '无'
                }));
                
                // 创建工作表
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖结果');
                
                // 生成文件名
                const fileName = `${activityName || '抽奖活动'}_结果_${new Date().toISOString().slice(0, 10)}.xlsx`;
                
                // 导出文件
                XLSX.writeFile(workbook, fileName);
            } catch (error) {
                console.error('导出Excel失败:', error);
                alert('导出失败，请重试');
            }
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
        this.fetchCreatorHistory();
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
    to {
        transform: rotate(360deg);
    }
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

.activity-group {
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
}

.activity-title {
    color: #61dafb;
    margin-bottom: 15px;
    font-size: 18px;
    padding-left: 10px;
    border-left: 3px solid #646cff;
}

.record-winner {
    font-size: 16px;
    color: #ffffffcb;
    margin-top: 5px;
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
.activity-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.activity-header:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.activity-title {
    color: #61dafb;
    margin: 0;
    font-size: 18px;
    padding-left: 10px;
    border-left: 3px solid #646cff;
    flex-grow: 1;
}

.toggle-icon {
    margin: 0 15px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.export-btn {
    background: rgba(100, 108, 255, 0.2);
    border: 1px solid rgba(100, 108, 255, 0.5);
    color: #646cff;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 13px;
    transition: all 0.3s ease;
    margin-left: 10px;
}

.export-btn:hover {
    background: rgba(100, 108, 255, 0.3);
}

.export-icon {
    margin-right: 5px;
}

.activity-records {
    margin-top: 15px;
    padding-left: 20px;
    border-left: 2px dashed rgba(255, 255, 255, 0.1);
}

/* 响应式设计调整 */
@media (max-width: 768px) {
    .activity-header {
        flex-wrap: wrap;
    }
    
    .export-btn {
        margin-top: 8px;
        margin-left: 0;
        width: 100%;
        justify-content: center;
    }
}
</style>