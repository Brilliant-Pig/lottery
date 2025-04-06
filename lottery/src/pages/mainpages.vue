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
            <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            @change="handleAvatarChange"
            style="display: none"
        >
        <button 
            class="avatar-upload-btn" 
            @click="handleAvatarUploadClick"
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
import emitter from '@/event-bus';
import { ElMessage } from 'element-plus';
import axios from 'axios';
const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

export default {
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
/*         createdLottories: [
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
        ] */
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
        };
        return statusMap[status] || status || '未知状态';},
    viewDetail(id) {
        console.log('查看详情:', id)
    }, 
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
    },
/*         loadUserData() {
    this.portrait = localStorage.getItem('username') || '';
    const savedAvatar = localStorage.getItem('avatarUrl');
    this.avatarUrl = savedAvatar || DEFAULT_AVATAR;
    },

    handleAvatarChange(event) {
        if (!localStorage.getItem('username')) {
        ElMessage.error('请先登录');
        event.preventDefault(); // 阻止默认行为
        return; // 直接返回
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

const reader = new FileReader();
reader.onload = (e) => {
    try {
        this.avatarUrl = e.target.result;
        localStorage.setItem('avatarUrl', this.avatarUrl);
        ElMessage.success('头像更新成功');
        
        // 触发事件，通知其他组件
        emitter.emit('avatar-updated', this.avatarUrl); // 确保 emitter 已导入
    } catch (error) {
        ElMessage.error('头像更新失败');
        console.error(error);
    }
};
reader.onerror = () => {
    ElMessage.error('图片读取失败');
};
reader.readAsDataURL(file);
},
handleAvatarUploadClick() {
    if (!localStorage.getItem('username')) {
        ElMessage.error('请先登录');
        return; // 直接返回，不触发文件选择
    }
    this.$refs.fileInput.click(); // 只有已登录时才触发文件选择
},    */
// 在methods中添加或修改以下方法
beforeRouteEnter(to, from, next) {
        if (!localStorage.getItem('username')) {
            next('/login');
        } else {
            next();
        }
    },
    formatDateTime(timestamp) {
    try {
        // 1. 检查空值
        if (!timestamp) {
            console.warn('时间戳为空:', timestamp);
            return '未知时间';
        }

        // 2. 处理多种时间格式
        let date;
        if (typeof timestamp === 'string') {
            // 处理ISO格式(如"2023-01-01T00:00:00Z")
            if (timestamp.includes('T')) {
                date = new Date(timestamp);
            } 
            // 处理时间戳字符串
            else if (!isNaN(timestamp)) {
                date = new Date(parseInt(timestamp));
            } else {
                console.warn('无法识别的时间字符串:', timestamp);
                return '未知时间';
            }
        } 
        // 处理数字时间戳
        else if (typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else {
            console.warn('不支持的时间格式:', typeof timestamp, timestamp);
            return '未知时间';
        }

        // 3. 验证日期有效性
        if (isNaN(date.getTime())) {
            console.warn('无效的时间戳:', timestamp);
            return '未知时间';
        }

        // 4. 格式化输出
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
        
    } catch (e) {
        console.error('日期格式化异常:', e, '原始时间戳:', timestamp);
        return '未知时间';
    }
},

formatDate(timestamp) {
        if (!timestamp) return '未知时间';
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
    },
    
    calculateRemainingTime(joinTime) {
        if (!joinTime) return '未知时间';
        const now = new Date();
        const joinDate = new Date(joinTime);
        const diff = joinDate - now;
        
        if (diff <= 0) return '已结束';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}天${hours}小时${minutes}分钟`;
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
                id: item.id + '_created',
                title: item.activity_name || '未命名活动',
                createTime: this.formatDateTime(item.createTime),
                status: item.status || 'ongoing',
                isCreated: true,
            }));
            
            // 处理已参与的抽奖
            this.participatedLottories = (participatedRes.data?.data || [])
                .filter(item => !createdRes.data?.data?.some(c => c.id === item.id))
                .map(item => ({
                    id: item.id + '_participated', // 添加后缀区分
                    title: item.title || '未命名活动',
                    joinTime: this.formatDateTime(item.createTime),
                    status: item.status || 'ongoing',
                    win: item.activity_result === 'win',
                    isCreated: false // 标记为参与的活动
                }));
            
            // 处理中奖结果
            this.historyResults = (resultsRes.data?.data || []).map(item => ({
                id: item.id || Math.random().toString(36).substr(2, 9),
                prizeName: item.prize_name || '神秘奖品',
                winTime: this.formatDate(item.win_time)
            }));
            
            // 初始化进行中的抽奖
            this.ongoingResults = this.participatedLottories
                .filter(item => item.status === 'ongoing')
                .map(item => ({
                    ...item,
                    drawTime: this.formatDateTime(item.joinTime),
                    remainingTime: this.calculateRemainingTime(item.joinTime)
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
    // 先本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
      // 本地预览（直接显示图片）
        this.avatarUrl = e.target.result;
        localStorage.setItem('avatarUrl', this.avatarUrl);
        ElMessage.success('头像符合条件');
    };
    reader.onerror = () => {
        ElMessage.error('图片读取失败');
    };
    reader.readAsDataURL(file); // 读取文件为 Data URL

    // 再上传到服务器
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userName', localStorage.getItem('username'));

    const response = await axios.post(
        'http://127.0.0.1:33001/api/user/uploadAvatar',
        formData,
        {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        }
    );

    if (response.data.code === 0) {
        // 更新数据库中的头像 URL
        const serverAvatarUrl = `http://127.0.0.1:33001${response.data.data.avatarUrl}`;
        localStorage.setItem('serverAvatarUrl', serverAvatarUrl); // 可选：存储服务器返回的 URL
        ElMessage.success('上传成功');
        window.location.reload(true);
    } else {
        ElMessage.error(response.data.message || '头像上传失败');
    }
    } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error(error.response?.data?.message || '头像上传失败');
    }
},
handleAvatarUploadClick() {
if (!localStorage.getItem('username')) {
    ElMessage.error('请先登录');
    return;
}
this.$refs.fileInput.click();
}
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
    background: #f8f9fa70; ;
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

</style>