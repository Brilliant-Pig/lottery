<template>
    <div class="user-center">
    <!-- 顶部导航 -->
    <header class="header">
        <div class="logo-section">
            <span class="time">{{ currentTime }}</span>
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
            <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            @change="handleAvatarChange"
            style="display: none"
        >
        <button 
            class="avatar-upload-btn" 
            @click="triggerFileInput"
            style="margin-left: 72px; position: relative"
        >
            修改头像
        </button>
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
            <h3>已创建的抽奖({{ createdLottories.length }})</h3>
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
            <h3>已参与的抽奖({{ participatedLottories.length }})</h3>
        </div>
        <div v-for="item in participatedLottories" :key="item.id" class="lottery-item">
            <div class="item-left">
                <h4>{{ item.title }}</h4>
                <p class="time">参与时间：{{ item.joinTime }}</p>
                <p class="status">状态：{{ getStatus(item.status) }}</p>
            </div>
            <div class="item-right">
                <span v-if="item.status === 'ended'" class="result">
                    结果：{{ item.win ? '已中奖' : '未中奖' }}
                </span>
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
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
        </router-view>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';
import emitter from '../event-bus';
const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

export default {
    inject: {
    sharedAvatar: {
    default: () => ({
        url: DEFAULT_AVATAR,
        update: (url) => {
        console.warn('使用默认头像处理器');
        localStorage.setItem('avatarUrl', url);
        }
    })
    }
    },
    computed: {
    avatarUrl() {
        return this.sharedAvatar.url;
    }

    activated() {
        this.loadUserData(); // 每次进入页面时刷新数据

    },
    created(){
        const username = localStorage.getItem('username');
        if (username) {
            this.portrait = username; // 如果存在用户名，显示用户名
        }
        const avatarUrl = localStorage.getItem('circleUrl');
        if (avatarUrl) {
            this.avatarUrl = avatarUrl; // 如果存在用户名，显示用户名
        }
        this.loadUserData();
        this.updateTime();
    },
    data() {
        return {
        portrait: '',
        avatarUrl: DEFAULT_AVATAR,
        currentTime: this.getCurrentTime(),
        userId: localStorage.getItem('userId') || '',
        activeNav: 'created',
        activeTab: 'all',
        resultTab: 'ongoing',
        createdLottories: [], // 初始化为空数组
        participatedLottories: [], // 初始化为空数组
        historyResults: [], // 初始化为空数组
        ongoingResults: [] , // 初始化为空数组
        statusTabs: [
        { value: 'unstarted', label: '未开始' },
        { value: 'ongoing', label: '进行中' },
        { value: 'ended', label: '已结束' }
        ],
        navItems: [
        { id: 'created', title: '已创建', icon: 'icon-created' },
        { id: 'participated', title: '已参与', icon: 'icon-join' },
        { id: 'results', title: '抽奖结果', icon: 'icon-result' }
        ],
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
            unstarted: '未开始',
        };
        return statusMap[status] || status || '未知状态';},
    viewDetail(id) {
        console.log('查看详情:', id)
        this.$router.push('/ResultMan')
    }, 
    switchMainTab(tab) {
        // 处理底部导航切换逻辑
        if (tab === 'service') {
        window.open("https://www.gdmuisat.top")
        } else if (tab === '') {
        this.$router.push('/')
        }
    },

    mounted() {
    this.updateTime()
    },
beforeRouteEnter(to, from, next) {
        if (!localStorage.getItem('username')) {
            next('/login');
        } else {
            next();
        }
    },
    formatDateTime(timestamp) {
    console.log('接收时间戳:', timestamp); // 调试
    
    if (!timestamp) {
        console.warn('时间戳为空');
        return '未知时间';
    }

    try {
        if (typeof timestamp === 'string') {
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
            const [datePart, timePart] = timestamp.split(' ');
            return datePart; 
        }
        return timestamp; 
        }
        
        if (typeof timestamp === 'number') {
        return new Date(timestamp).toISOString().split('T')[0];
        }
        
        return '未知格式';
    } catch (e) {
        console.error('时间格式化异常:', e, '原始值:', timestamp);
        return '无效时间';
    }
},

formatDate(timestamp) {
        if (!timestamp) return '未知时间';
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
    },
    
    calculateRemainingTime(endTime) {
    if (!endTime) return '未知时间';
    
    const now = new Date();
    const endDate = new Date(endTime);
    
    // 如果结束时间早于当前时间
    if (endDate <= now) return '已结束';
    
    // 计算剩余时间
    const diff = endDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // 只显示有值的部分
    let result = [];
    if (days > 0) result.push(`${days}天`);
    if (hours > 0) result.push(`${hours}小时`);
    if (minutes > 0) result.push(`${minutes}分钟`);
    
    return result.length > 0 ? result.join('') : '即将结束';
},
    async loadUserData() {
    try {
        const username = localStorage.getItem('username');
        if (username) {
            // 使用完整的后端URL
            const baseUrl = 'http://127.0.0.1:33001/api/user';
            
            // 获取用户创建的抽奖
            const createdRes = await axios.get(`${baseUrl}/getCreatedActivities`, {
                params: { userName: username }
            });
            
            // 获取用户参与的抽奖
            const participatedRes = await axios.get(`${baseUrl}/getParticipatedActivities`, {
                params: { userName: username }
            });
            
            // 获取中奖结果
            const resultsRes = await axios.get(`${baseUrl}/getWinningResults`, {
                params: { userName: username }
            });
        
            console.log('创建活动响应:', createdRes.data);
            console.log('参与活动响应:', participatedRes.data);
            console.log('中奖结果响应:', resultsRes.data);
            console.log('创建活动原始数据:', JSON.stringify(createdRes.data?.data, null, 2));
            console.log('参与活动原始数据:', JSON.stringify(participatedRes.data?.data, null, 2));
            
            // 处理已创建的抽奖
            this.createdLottories = (createdRes.data?.data || []).map(item => ({
                id: item.id + '_created'|| item.username,
                title: item.title || '未命名活动',
                createTime: this.formatDateTime(item.createTime),
                status: item.status ,
                isCreated: true,
            }));
            
            // 处理已参与的抽奖
            this.participatedLottories = (participatedRes.data?.data || []).map(item => ({
            id: item.id + '_participated',
            title: item.title || '未命名活动',
            joinTime: this.formatDateTime(item.joinTime || item.participation_time),
            endTime: item.endTime || item.end_time,
            status: item.status || 'ongoing'
            }));
            
            // 处理中奖结果
            this.historyResults = (resultsRes.data?.data || []).map(item => ({
                id: item.username || Math.random().toString(36).substr(2, 9),
                prizeName: item.result || '神秘奖品',
                winTime: this.formatDate(item.winTime)
            }));
            
            // 初始化进行中的抽奖
            this.ongoingResults = this.participatedLottories
            .filter(item => item.status === 'ongoing')
            .map(item => ({
                ...item,
                drawTime: this.formatDateTime(item.endTime), // 使用结束时间作为开奖时间
                remainingTime: this.calculateRemainingTime(item.endTime) // 使用结束时间计算
            }));
            }
    } catch (error) {
        console.error('加载数据失败:', error);
        this.createdLottories = [];
        this.participatedLottories = [];
        this.historyResults = [];
        this.ongoingResults = [];
    }
},
    // 获取用户头像
    async fetchUserAvatar() {
        try {
            const username = localStorage.getItem('username');
            if (!username) return;
            
            const response = await fetch(
                `http://127.0.0.1:33001/api/user/getUserAvatar?userName=${encodeURIComponent(username)}`
            );
            const data = await response.json();
            
            if (data.code === 0 && data.data) {
                // 假设返回的data.data就是完整的头像URL
                let avatarUrl = data.data;
                
                // 如果返回的是相对路径，补全为绝对路径
                if (avatarUrl.startsWith('/')) {
                    avatarUrl = `http://127.0.0.1:33001${avatarUrl}`;
                }
                
                this.avatarUrl = avatarUrl;
                localStorage.setItem('avatarUrl', avatarUrl);
            }
        } catch (error) {
            console.error('获取头像失败:', error);
        }
    },

    // 处理头像上传
    async handleAvatarChange(event) {
        if (!localStorage.getItem('username')) {
            ElMessage.error('请先登录');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            ElMessage.error('请选择图片文件');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            ElMessage.error('图片大小不能超过2MB');
            return;
        }

        try {
            // 1. 本地预览
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
            };
            reader.readAsDataURL(file);

            // 2. 上传到服务器
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userName', localStorage.getItem('username'));

            const response = await fetch('http://127.0.0.1:33001/api/user/uploadAvatar', {
                method: 'POST',
                body: formData
            });

                    // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

            // 尝试解析JSON
            let data;
            try {
                data = await response.json();
            } catch (e) {
                throw new Error('服务器返回了无效的JSON响应');
            }

            if (data.code === 0) {
                localStorage.removeItem('avatarBase64');
                localStorage.removeItem('avatarUrl');
                localStorage.removeItem('circleUrl');

                const fullUrl = `http://127.0.0.1:33001${data.data.avatarUrl}?t=${Date.now()}`;
                // 更新三处存储
                localStorage.setItem('avatarUrl', fullUrl);
                this.avatarUrl = fullUrl;  // 更新本地data
                // 触发两种更新机制
                this.sharedAvatar.update(fullUrl);  // provide/inject方式
                emitter.emit('avatar-updated', fullUrl);  // 事件总线方式
                ElMessage.success('头像更新成功');
            } else {
                throw new Error(data.message || '头像上传失败');
            }
        } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error(error.message || '头像上传失败');
        }
    },

    // 初始化头像
    initAvatar() {
        const username = localStorage.getItem('username');
        if (username) {
            this.portrait = username;
            
            // 检查是否有临时存储的头像(上传后尚未刷新)
            const tempAvatar = localStorage.getItem('avatarTempUrl');
            if (tempAvatar) {
                this.avatarUrl = tempAvatar;
                return;
            }
            
            // 检查是否有存储的头像URL
            const savedAvatar = localStorage.getItem('avatarUrl');
            if (savedAvatar) {
                this.avatarUrl = savedAvatar;
                return;
            }
            
            // 都没有则从服务器获取
            this.fetchUserAvatar();
        }
    },
    triggerFileInput() {
    if (!localStorage.getItem('username')) {
      ElMessage.error('请先登录');
      return;
    }
    this.$refs.fileInput.click(); // 触发隐藏的file input
  },
},
created() {
    this.initAvatar();
    this.loadUserData();
    this.updateTime();
}
}
</script>

<style lang="scss" scoped>
/* 总的 */
.user-center {
width: auto;
margin:auto;
.header {
    padding: 15px;
    background: rgba(255, 255, 255, 0.193); ;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.413);

/*         .logo-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
        height: 28px;
    }
*/
    .time {
        color: #ffffff;
        font-size: 20px;
    }
    }
}

.user-card {
    background: linear-gradient(to right,#6565655c ,#6565651a 70%);
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
    margin: 0 15px;
    border-radius: 8px;
    overflow: hidden;
    background:#6565655c;
    box-shadow: 0 -2px 8px rgba(255, 255, 255, 0.123);

    .nav-item {
    box-shadow: 1px -2px 8px rgba(255, 255, 255, 0.123);
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    color: #ffffff;

    span {
        font-size: 14px;
    }
    }
}

.main-content {
    padding: 15px;
    height: 300px;
    }
.lottery-list {
    color: #ffffff;
}

.bottom-nav {

    justify-content: space-around;
    padding: 12px 0;
    background:#6565655c;
    box-shadow: 0 -2px 8px rgba(255, 255, 255, 0.123);

    .nav-item {
    text-align: center;
    color: #ffffff;
    transition: color 0.3s;

    span {
        font-size: 12px;
    }
    }
}
.result-list{
    color: #ffffff;
}
</style>