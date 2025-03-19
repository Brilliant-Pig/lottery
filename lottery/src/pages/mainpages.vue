    <template>
        <div class="user-center">
        <!-- 顶部导航 -->
        <header class="header">
            <div class="logo-section">
    <!--           <img src="@/assets/logo.png" alt="魔法抽奖系统" class="logo">
    -->          <span class="time">{{ currentTime }}</span>
            </div>
        </header>
    
        <!-- 用户信息卡片 -->
        <div class="user-card">
            <div class="user-profile">
            <div class="avatar-section">
                <img :src="avatarUrl" alt="用户头像" class="avatar">

            </div>
            <div class="user-info">
                <h2 class="username" >{{ portrait }}</h2>
                <div class="wallet">
                </div>
            </div>
            </div>
    
            <div class="activity-stats">
            <div class="stat-item">
                <strong>{{ createdCount }}</strong>
                <span>已创建</span>
            </div>
            <div class="stat-item">
                <strong>{{ participatedCount }}</strong>
                <span>已参与</span>
            </div>
            <div class="stat-item">
                <strong>{{ winningCount }}</strong>
                <span>中奖数</span>
            </div>
            </div>
        </div>
    
        <!-- 功能导航 -->
        <nav class="function-nav">
            <div 
            v-for="item in navItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: activeNav === item.id }"
            @click="switchNav(item.id)"
            >
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
            </div>
        </nav>
    
        <!-- 主体内容 -->
        <main class="main-content">
            <!-- 已创建抽奖 -->
            <div v-if="activeNav === 'created'" class="lottery-list">
            <div class="list-header">
                <h3>已创建的抽奖（{{ createdLottories.length }}）</h3>
            </div>
            <div class="list-content">
                <div v-for="item in createdLottories" :key="item.id" class="lottery-item">
                <div class="item-left">
                    <h4>{{ item.title }}</h4>
                    <p class="time">创建时间：{{ item.createTime }}</p>
                    <p class="status">状态：{{ getStatus(item.status) }}</p>
                </div>
                <div class="item-right">
                    <button class="detail-btn" @click="viewDetail(item.id)">详情</button>
                </div>
                </div>
            </div>
            </div>
    
            <!-- 已参与抽奖 -->
            <div v-if="activeNav === 'participated'" class="lottery-list">
            <div class="list-header">
                <h3>已参与的抽奖（{{ participatedLottories.length }}）</h3>
                <div class="filter-tabs">
                <button 
                    v-for="tab in statusTabs"
                    :key="tab.value"
                    :class="{ active: activeTab === tab.value }"
                    @click="activeTab = tab.value"
                >
                    {{ tab.label }}
                </button>
                </div>
            </div>
            <div class="list-content">
                <div 
                v-for="item in filteredParticipated"
                :key="item.id" 
                class="lottery-item"
                >
                <div class="item-left">
                    <h4>{{ item.title }}</h4>
                    <p class="time">参与时间：{{ item.joinTime }}</p>
                    <p class="status">状态：{{ getStatus(item.status) }}</p>
                </div>
                <div class="item-right">
                    <span v-if="item.status === 'ended'" class="result">
                    结果：{{ item.win ? '已中奖' : '未中奖' }}
                    </span>
                    <button class="detail-btn">详情</button>
                </div>
                </div>
            </div>
            </div>
    
            <!-- 抽奖结果 -->
            <div v-if="activeNav === 'results'" class="result-section">
            <div class="result-tabs">
                <button 
                :class="{ active: resultTab === 'ongoing' }"
                @click="resultTab = 'ongoing'"
                >
                进行中（{{ ongoingResults.length }}）
                </button>
                <button 
                :class="{ active: resultTab === 'history' }"
                @click="resultTab = 'history'"
                >
                历史中奖（{{ historyResults.length }}）
                </button>
            </div>
            
            <!-- 进行中 -->
            <div v-show="resultTab === 'ongoing'" class="result-list">
                <div 
                v-for="item in ongoingResults"
                :key="item.id"
                class="result-item ongoing"
                >
                <div class="prize-info">
                    <h4>{{ item.title }}</h4>
                    <p>开奖时间：{{ item.drawTime }}</p>
                </div>
                <div class="countdown">
                    剩余 {{ item.remainingTime }}
                </div>
                </div>
            </div>
    
            <!-- 历史中奖 -->
            <div v-show="resultTab === 'history'" class="result-list">
                <div 
                v-for="item in historyResults"
                :key="item.id"
                class="result-item history"
                >
                <div class="prize-info">
                    <h4>{{ item.prizeName }}</h4>
                    <p>中奖时间：{{ item.winTime }}</p>
                </div>
                <div class="action">
                    <button class="receive-btn">领取奖品</button>
                </div>
                </div>
            </div>
            </div>
        </main>
        <!-- 底部导航 -->
        <footer class="bottom-nav">
            <div class="nav-item" @click="switchMainTab('service')">
            <i class="icon-service"></i>
            <span>联系客服</span>
            </div>
        </footer>
        </div>
    </template>
    
    <script>
    export default {
        created(){
            console.log(this.$route.query.avater);
            console.log(this.$route.query.username); 
            this.avatarUrl = this.$route.query.avatar || '';
            this.portrait = this.$route.query.username || '';
        },
        data() {
        return {
            portrait: '',
            avatarUrl: '',
            currentTime: this.getCurrentTime(),
            activeNav: 'created',
            activeTab: 'all',
            resultTab: 'ongoing',
            statusTabs: [
            { value: 'all', label: '全部' },
            { value: 'ongoing', label: '进行中' },
            { value: 'ended', label: '已结束' }
            ],
            navItems: [
            { id: 'created', title: '已创建', icon: 'icon-created' },
            { id: 'participated', title: '已参与', icon: 'icon-join' },
            { id: 'results', title: '抽奖结果', icon: 'icon-result' }
            ],
            // 模拟数据
            createdLottories: [
            {
                id: 1,
                title: '周年庆大抽奖',
                createTime: '2024-03-15',
                status: 'ongoing',
                participants: 142
            }
            ],
            participatedLottories: [
            {
                id: 2,
                title: '每日幸运抽奖',
                joinTime: '2024-03-20',
                status: 'ongoing',
                win: false
            }
            ],
            ongoingResults: [
            {
                id: 3,
                title: '春日限定抽奖',
                drawTime: '2024-03-25 20:00',
                remainingTime: '2天3小时'
            }
            ],
            historyResults: [
            {
                id: 4,
                prizeName: '神秘大礼包',
                winTime: '2024-02-10',
                status: 'received'
            }
            ]
        }
        },
        computed: {
        createdCount() {
            return this.createdLottories.length
        },
        participatedCount() {
            return this.participatedLottories.length
        },
        winningCount() {
            return this.historyResults.length
        },
        filteredParticipated() {
            if (this.activeTab === 'all') return this.participatedLottories
            return this.participatedLottories.filter(
            item => item.status === this.activeTab
            )
        }
        },
        methods: {
        getCurrentTime() {
            const date = new Date()
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
        },
        updateTime() {
            setInterval(() => {
            this.currentTime = this.getCurrentTime()
            }, 1000)
        },
        switchNav(navId) {
            this.activeNav = navId
        },
        getStatus(status) {
            const statusMap = {
            ongoing: '进行中',
            ended: '已结束',
            preparing: '准备中'
            }
            return statusMap[status] || '未知状态'
        },
/*         viewDetail(id) {
            console.log('查看详情:', id)
        }, */
        switchMainTab(tab) {
            // 处理底部导航切换逻辑
            if (tab === 'service') {
            window.location.href = 'tel:400-123-4567'
            } else if (tab === 'feedback') {
            this.$router.push('/feedback')
            }
        },

        mounted() {
        this.updateTime()
        }
    }}
    </script>
    
    <style lang="scss" scoped>
    /* 总的 */
    .user-center {
    width: auto;
    margin:auto;
    background: #f8f9fa70;

    .header {
        padding: 15px;
        background: #f8f9fa70; ;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);

/*         .logo-section {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo {
            height: 28px;
        }
 */
        .time {
            color: #666;
            font-size: 14px;
        }
        }
    }

    .user-card {
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        margin: 15px;
        border-radius: 12px;
        padding: 20px;
        color: white;

        .user-profile {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .avatar-section {
            position: relative;
            margin-right: 15px;

            .avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.3);
            }
        }

        .user-info {
            .username {
            margin: 0 0 8px;
            font-size: 20px;
            }

            .wallet {
            display: flex;
            gap: 15px;
            font-size: 14px;

            [class^="icon-"] {
                margin-right: 5px;
            }
            }
        }
        }

        .activity-stats {
        display: flex;
        justify-content: space-around;
        border-top: 1px solid rgba(255,255,255,0.2);
        padding-top: 15px;

        .stat-item {
            text-align: center;

            strong {
            display: block;
            font-size: 20px;
            margin-bottom: 5px;
            }

            span {
            font-size: 12px;
            opacity: 0.8;
            }
        }
        }
    }

    .function-nav {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: #eee;
        margin: 0 15px;
        border-radius: 8px;
        overflow: hidden;

        .nav-item {
        background: white;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;

        span {
            font-size: 14px;
        }
        }
    }

    .main-content {
        padding: 15px;
        height: 300px;
    }

    .bottom-nav {

        justify-content: space-around;
        padding: 12px 0;
        background:#f8f9faa7;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.1);

        .nav-item {
        text-align: center;
        color: #666;
        transition: color 0.3s;

        span {
            font-size: 12px;
        }
        }
    }

    </style>