    <template>
        <!-- 主容器 -->
        <div class="demo-container">
            <div class="fullscreen-background">
                    <Particles 
                        :particleColors="['#ffffff', '#fdffe5', '#ffffff']"
                        :particleCount="1000"
                        :speed="0.05"
                        :particleBaseSize="80"
                        :alphaParticles="false"
                    />
            </div>
        <!-- TinyVue布局容器 -->
            <tiny-container
            :pattern="pattern"
            :aside-width="asideWidth"
            :header-height="headerHeight"
            >
    
            <!-- 头部插槽 -->
            <template #header>
                <div class="header-container">
                </div>
            </template>
    
            <template #aside>
            <div :class="['aside-container', { 'is-collapsed': isCollapsed }]">
            <!-- 收缩/展开按钮 -->
            <button class="collapse-button" @click="toggleAside">
                <span v-if="isCollapsed"><i class="el-icon-caret-right" style="color: white; font-size: 26px; right: -12px;top: 50%; z-index: 3;"></i></span>
                <span v-else><i class="el-icon-caret-left" style="color: white; font-size: 26px; right: -12px ; top: 50%; "></i></span>
            </button>
            <!-- 侧边栏插槽 -->
            <div class="aside-logo">
                <img src="./assets/logo.png" alt="Logo" class="logo-img" />
            </div>
            <!-- 动态滚条菜单区域 -->
            <el-scrollbar>
                <div v-for="(item, index) in customItems" :key="index" 
                class="scrollbar-demo-item"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = -1"
                :style="{ marginBottom: item.children && hoverIndex === index ? '90px' : '5px' }"> 
            <!-- 父级按钮 -->
            <el-button :type="item.type" plain 
                        :class="{ 'button-hover': hoverIndex === index }"
                        :data-type="item.type"
                        @click="item.children ? null : item.path && handleClick(item.path)">
                <!-- 菜单图标 -->
                        <el-icon v-if="item.icon" class="menu-icon">
                <component :is="item.icon" />
                </el-icon>
                <span class="menu-text">{{ item.text }}</span>
                <el-icon class="ml-2" v-if="item.children" >
                </el-icon>
            </el-button>
    
            <!-- 子菜单容器 -->
            <transition name="submenu">
            <div v-if="item.children && hoverIndex === index" 
                    class="submenu-container">
                <!-- 子菜单选项 -->
                <div v-for="(child, childIndex) in item.children" 
                    :key="childIndex"
                    class="submenu-item"
                    @mouseenter="childHover = childIndex"
                    @mouseleave="childHover = -1">
                <!-- 子菜单按钮 -->
                <el-button :type="child.type" 
                            plain
                            :class="{ 'submenu-hover': childHover === childIndex }"
                            @click="handleClick(child.path)">
                    <el-icon v-if="child.icon" class="child-icon">
                    <component :is="child.icon" />
                    </el-icon>
                    {{ child.text }}
                </el-button>
                </div>
            </div>
            </transition>
        </div>
        </el-scrollbar> 
        </div> 
    </template>
<tiny-layout
    id="mainP"
    :class="{ 'is-collapsed': isCollapsed }"
    :style="{ width: isCollapsed ? 'calc(100%)' : 'calc(100%)' }"
>
    <!-- 路由视图 -->
    <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</tiny-layout>
    
            </tiny-container>
        </div>
        <!-- 头像区域显示 -->
        <el-row class="demo-avatar demo-basic" @click="login">
        <div class="avatar-container">
            <div class="demo-basic--circle">
            <div class="avatar-wrapper">
                <el-avatar :size="60" :src="circleUrl"/>    
                </div>    
            </div>
        <div class="sub-title" style="margin-top: 10px" >{{ Loginportrait }}</div>
            </div>
        </el-row>
        <el-button 
            v-if="isLoggedIn" 
            @click="logout" 
            style="margin-left: 85vw; margin-top: 20px;padding-left: 2.9%; z-index: 2;color: #fc5185;">
            退出登录
        </el-button>
    </template>
    
    <script>
    import Particles from './components/background.vue';
    import { User, Discount, Document, PieChart, MagicStick, UploadFilled, Link } from '@element-plus/icons-vue'
    import emitter from '@/event-bus';
    const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';


    export default {
        name: 'MinePage',
        components: {
            User,
            Discount,
            Document,
            PieChart,
            MagicStick,
            UploadFilled,
            Link,
            Particles
        },
        data() {
            return {
                isLoggedIn: false,
                Loginportrait: '',
                name: '',
                hoverIndex: -1,
                childHover: -1,
                isCollapsed: false,
                pattern: 'default',
                asideWidth: 195,
                headerHeight: 80,
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                customItems: [
                    { 
                        text: '使用说明', 
                        type: 'primary', 
                        icon: 'MagicStick', 
                        path: '/LotteryMain' 
                    },
                    { 
                        text: '创建抽奖', 
                        type: 'success', 
                        icon: 'Discount', 
                        children: [
                            { 
                                text: '模式一: 上传CSV/Excel',
                                type: 'success',
                                icon: 'UploadFilled',
                                path: '/ManagersMain'
                            },
                            {
                                text: '模式二: 生成抽奖码',
                                type: 'success',
                                icon: 'Link',
                                path: '/ManagersURL'
                            } 
                        ]
                    },
                    { 
                        text: '参与抽奖', 
                        type: 'warning', 
                        icon: 'Document', 
                        path: '/CustomersMain' 
                    },
                    { 
                        text: '抽奖结果', 
                        type: 'danger', 
                        icon: 'PieChart',
                        children: [
                            { 
                                text: '创建的抽奖',
                                type: 'danger',
                                icon: 'Document',
                                path: '/ResultMan'
                            },
                            {
                                text: '参与的抽奖',
                                type: 'danger',
                                icon: 'PieChart',
                                path: '/ResultCus'
                            }
                        ]  
                    },
                    { 
                        text: '个人中心', 
                        type: 'info', 
                        icon: 'User', 
                        path: '/mainpages' 
                    }
                ]
            };
        },
        created() {
        const username = localStorage.getItem('username');
        if (username) {
            this.Loginportrait = username; // 如果存在用户名，显示用户名
            const avatarUrl = localStorage.getItem('avatarUrl');
            if (avatarUrl) {
                this.circleUrl = avatarUrl; 
            }
            this.isLoggedIn = true; 
            this.$router.push('/LotteryMain');
        } else {
            this.Loginportrait = '请点击登录'; 
            this.circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'; // 重置为默认头像
            this.isLoggedIn = false; 
            this.$router.push('/LoginMain');
        }
        const loadData = () => {
            this.Loginportrait = localStorage.getItem('username') || '请点击登录';
            const avatar = localStorage.getItem('avatarUrl') || DEFAULT_AVATAR;
            this.circleUrl = avatar;
            this.isLoggedIn = !!localStorage.getItem('username');
        };
        
        // 初始加载
        loadData();
        this.loadUserData();
        
        // 监听头像更新事件
        emitter.on('avatar-updated', (newAvatar) => {
            this.circleUrl = newAvatar;
            localStorage.setItem('avatarUrl', newAvatar);
        });
    },
    beforeUnmount() {
        emitter.off('avatar-updated');
    },
        methods: {
        toggleAside() {
            this.isCollapsed = !this.isCollapsed;
            this.asideWidth = this.isCollapsed ? 50 : 195; // 动态调整侧边栏宽度
        },
        handleClick(path) {
            this.$router.push(path);
        },
            loadUserData() {
            this.Loginportrait = localStorage.getItem('username') || '请点击登录';
            const avatar = localStorage.getItem('avatarUrl') || DEFAULT_AVATAR;
            this.circleUrl = avatar;
            this.isLoggedIn = !!localStorage.getItem('username');
            
            // 根据登录状态跳转
            if (this.isLoggedIn) {
                this.$router.push('/LotteryMain');
            } else {
                this.$router.push('/LoginMain');
            }
        },
        handleClick(path) {
                localStorage.setItem('circleUrl', this.circleUrl);
                this.$router.push(path);
                },  
    handleAsideEnter() {
        if (this.isCollapsed) {
        this.isCollapsed = false;
        this.asideWidth = 195;
        }
    },
    handleAsideLeave() {
        // 添加延迟，避免频繁触发
    setTimeout(() => {
        if (!this.isCollapsed ) {
            this.isCollapsed = true;
            this.asideWidth = 35;
        }
        }, 900); // 延迟 900ms
    },
    login() {
        const username = localStorage.getItem('username');
        if (username) {
            window.location.href = '/LotteryMain';
        } else {
            // 如果用户未登录，跳转到登录页面
            this.$router.push('/LoginMain');
        }
    },
    logout() {
        // 清除 localStorage 中的用户数据
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('avatarUrl');

        // 重置页面状态
        this.Loginportrait = '请点击登录';
        this.circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'; // 重置为默认头像
        this.isLoggedIn = false; // 用户未登录

        // 跳转到登录页面
        this.$router.push('/LoginMain');
    },
    updateAvatar(newAvatarUrl) {
            this.circleUrl = newAvatarUrl;
            localStorage.setItem('avatarUrl', newAvatarUrl);
        },
}
    };
    </script>
    
    <style scoped>
.fullscreen-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -10;
    background: linear-gradient(135deg, #121224 0%, #000000 100%); /* 添加渐变背景 */
}

    /* 修复头像定位 */
    .demo-avatar.demo-basic {
        position: absolute;
        z-index: 2;
    }
    
    .avatar-upload-btn {
    margin-left: 10px;
    padding: 5px 10px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    }
    .avatar-upload-btn:hover {
    background: #f5f5f5;
    }
    /* 头部容器样式 */
    .demo-container .tiny-container :deep(.tiny-container__header) {
        border-bottom: 1.4px solid #d5d5d5;
        color: #4f4f4f;
        text-align: center;
        position: absolute;
        font-size: 40px;
        width: 100vw;
        z-index: 2;
        background: transparent;
        box-shadow: 5px 0px 15px -5px rgba(200, 200, 200, 0.477); /* 加粗下侧阴影 */
    
    }
    
    /* 侧边栏样式 */
    .demo-container .tiny-container :deep(.tiny-container__aside) {
        border-right: 1.4px solid #a7a7a7;
        box-shadow: 10px 0px 25px -5px rgba(146, 146, 146, 0.754); /* 加粗右侧阴影 */
        height: auto;
        z-index: 1;
        overflow: visible; 
        transition: width 0.3s ease-in-out;/* 侧边栏过渡动画 */
    }
    
    .aside-logo {
    position: absolute;
    left: 50%; 
    transform: translateX(-50%);
    bottom: 40px; 
    height: 100px; 
    display: flex;
    align-items: center; 
    z-index: 1;
}

/* Logo 图片样式 */
.logo-img {
    height: 100%;
    width: auto;
    border-radius: 20%; 
}

    /* 伸缩按钮样式 */
    .collapse-button {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2000;
        cursor: pointer;
        width: 24px;
        height: 24px;
        background: none;
        border: none;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: right 0.3s ease-in-out;
    }
    
    .collapse-button:hover {
        background: rgba(255, 255, 255, 0.1); /* 可选：添加悬停背景效果 */
        transform: translateY(-50%) scale(1.1);
    }
.collapse-button:focus {
    outline: none; /* 移除点击后的默认聚焦边框 */
}
    
.aside-container {
    width: 195px; /* 默认展开状态下的宽度 */
    transition: width 0.3s ease-in-out;
    overflow: hidden;
}

.aside-container.is-collapsed {
    width: 50px; /* 收缩状态下的宽度 */
}

    .aside-container.is-collapsed .el-scrollbar,
    .aside-container.is-collapsed .fullscreen-background,
    .aside-container.is-collapsed .aside-logo {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    /* 展开时的样式 */
    .aside-container:not(.is-collapsed) .el-scrollbar,
    .aside-container:not(.is-collapsed) .fullscreen-background,
    .aside-container:not(.is-collapsed) .aside-logo {
        opacity: 1;
        transition-delay: 0.1s;
    }

    /* 保持箭头始终可见 */
    .collapse-button {
    position: absolute;
    right: -12px; /* 默认位置 */
    top: 50%;
    transform: translateY(-50%);
    z-index: 2000; /* 确保按钮在最上层 */
    cursor: pointer;
    width: 24px;
    height: 24px;
    background: none;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: right 0.3s ease-in-out; /* 添加位置过渡动画 */
    }

    
    /* 主内容区样式 */
    .demo-container .tiny-container :deep(.tiny-container__main) {
        border: 2px solid #ffffff4c;
        color: #4f4f4f;
        height: auto;
        width: auto;
        z-index: 1;
    }
    
    /* 布局模式切换按钮样式 */
    .demo-container .tiny-container :deep(.main .changePattern .tiny-radio) {
        color: #a3a355; /* 特殊文字颜色 */
        font-size: 16px;
        margin: 0 7px;
    }
    /* 主容器布局 */
    .demo-container .tiny-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;     /* 水平居中 */
        align-items: center;         /* 垂直居中 */
    }
    
    /* 菜单项基础样式 */
    .scrollbar-demo-item {
        position: relative; 
        display: flex;
        align-items: center;
        height: 50px;
        margin: 5px;
        margin-bottom: 5px;
        justify-content: center !important;
        padding: 0 5px;
        border-radius: 10px;
        transition: transform 0.5s ease, margin-bottom 0.3s ease; /* 位移动画 */
        flex-direction: column;     /* 纵向排列 */
    }
    
    /* 菜单项悬停效果 */
    .scrollbar-demo-item:hover {
        transform: translateX(3px);/* 右移3像素 */
    }
    /* 菜单图标动画 */
    .scrollbar-demo-item:hover .menu-icon {
        transform: rotate(30deg) scale(1.2); /* 组合变换 */
        transition: transform 0.5s ease;
        margin-right: 8px;
    }
    /* 菜单文字效果 */
    .menu-text {
        position: relative;}
    
    /* 子菜单容器样式 */
    .submenu-container {
        position: absolute;
        left: 0;
        top: 100%; /* 关键修改：定位到父元素底部 */
        width: 100%; /* 保持与父按钮比例长度 */
        min-width: auto;
        margin-top: 8px; /* 添加间隔 */
        transform-origin: top center; /* 调整动画基准点 */
        background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-radius: 0 0 8px 8px;
    
    }
    
    /* 移动端适配 */
    @media (max-width: 768px) {
        .submenu-container {
        position: fixed;
        width: 80vw;
        left: 50% !important;
        transform: translateX(-50%);
        }
    }
    
    
    /* 子菜单图标样式 */
    .child-icon {
        margin-right: 6px;     
        transition: transform 0.3s; 
    }
    
    /* 子菜单悬停时图标效果 */
    .submenu-hover .child-icon {
        transform: rotate(45deg); 
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    /* 子菜单动画 */
    /* 子菜单进入动画 */
    .submenu-enter-active {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
    }
    
    /* 子菜单离开动画 */
    .submenu-leave-active {
        transition: all 0.01s cubic-bezier(0.6, -0.3, 0.74, 0.05); 
    }
    
    /* 子菜单初始状态 */
    .submenu-enter-from {
        opacity: 0;       
        transform: translateY(-10px) scaleY(0.9); 
    }
    
    /* 子菜单最终状态 */
    .submenu-enter-to {
        opacity: 1;                /* 完全不透明 */
        transform: translateY(0) scaleY(1); /* 恢复正常 */
    }
    
    /* 子菜单离开状态 */
    .submenu-leave-to {
        opacity: 0;                /* 完全透明 */
        transform: translateX(-10px); /* 左移消失 */
    }
    
    /* 调整子菜单按钮样式 */
    :deep(.submenu-container .el-button) {
        width: 100%;
        justify-content: start;
        padding: 8px 12px;
        margin: 2px 0;
        border-radius: 6px;
    }
    /* 滚动条视图样式 */
    :deep(.el-scrollbar__view) {
        overflow: visible !important;   /* 允许溢出 */
        position: relative;
    }
    
    /* 调整子菜单按钮样式 */
    .submenu-container .el-button {
        width: 100%;
        justify-content: start;
        padding: 8px 12px;
        margin: 2px 0;
        border-radius: 6px;
    }
    
    /* 子菜单装饰箭头 */
    .submenu-container::before {
        content: '';
        position: absolute;
        bottom: 100%;             /* 定位在容器上方 */
        left: 50%;
        transform: translateX(-50%); /* 水平居中 */
        width: 0;
        height: 0;
        border: 8px solid transparent; /* 透明边框 */
        border-bottom-color: rgba(255,255,255,0.95); /* 下边框颜色 */
        filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.1)); /* 投影效果 */
    }
    /* 按钮默认样式 */
    .el-button {
        background: transparent !important;
        border: 1px solid currentColor !important;
        transition: all 0.3s ease !important;
        padding-left: 41px;
    }
    
    
    /* 按钮悬浮时的渐变效果 */
    .el-button:hover {
        border-color: currentColor !important;
        box-shadow: 0 5px 12px rgba(255, 255, 255, 0.1) !important; /* 发光效果 */
    }
    
    /* 定义各类型按钮的悬浮渐变颜色 */
    .el-button--success:hover {
        background: linear-gradient(
        45deg,
        var(--el-color-success-light-3),
        var(--el-color-success-light-9)
        ) !important;
    }
    
    .el-button--primary:hover {
        background: linear-gradient(
        45deg,
        var(--el-color-primary-light-3),
        var(--el-color-primary-light-9)
        ) !important;
    }
    
    .el-button--danger:hover {
        background: linear-gradient(
        45deg,
        var(--el-color-danger-light-3),
        var(--el-color-danger-light-9)
        ) !important;
    }
    
    .el-button--info:hover {
        background: linear-gradient(
        45deg,
        var(--el-color-info-light-3),
        var(--el-color-info-light-9)
        ) !important;
    }
    
    /* 定义各类型按钮颜色 */
    .el-button--warning:hover {
        background: linear-gradient(
        45deg,
        var(--el-color-warning-light-3),
        var(--el-color-warning-light-9)
        ) !important;
    }
    .el-button--success {
        color: var(--el-color-success) !important;
    }
    .el-button--warning {
        color: var(--el-color-warning) !important;
    }
    .el-button--danger {
        color: var(--el-color-danger) !important;
    }
    .el-button--info {
        color: var(--el-color-info) !important;
    }
    .el-button--primary {
        color: var(--el-color-primary) !important;
    }
    
    .el-button {/*调整了按钮大小视觉效果*/
        width: 170px;
        height: 35px;
        border-radius: 5px;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }
    
    /* 菜单项悬停时文字效果 */
    .button-hover .menu-text {
        color: #ffffff;            /* 文字变灰 */
        text-shadow: 0 0 8px currentColor; /* 文字发光 */
    }
    
    /* 外层容器 */
.demo-basic {
  margin-top: 10px;
  margin-left: 15px;
}

/* Flex 容器，确保头像和文字水平排列 */
.avatar-container {
  display: flex;
  align-items: flex-start;  /* 垂直居中 */
  gap: 15px;  /* 头像和文字之间的固定间距 */
}

/* 头像固定宽度，防止被挤压 */
.avatar-wrapper {
  flex-shrink: 0;  /* 禁止头像被压缩 */
}

    /* 登录文字样式 */
    .sub-title {
        font-size: 17px;
        font-weight: bold;
        color: #a6e3e9;
        white-space: nowrap;  /* 防止文字换行 */
        overflow: hidden;
        max-width: 200px;  /* 限制最大宽度 */
        margin: 0;
        margin-top: -100px;
        line-height: 1;
        text-overflow: ellipsis;
    }
    
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);   /* 贝塞尔曲线 */
    }
    
    .fade-slide-enter-from {
        opacity: 0;
        transform: translateX(30px);
    }
    
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateX(-30px);   /* 左移离开 */
    }
    
/* 主内容区域样式 */    
#mainP {
    transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out; /* 添加平滑过渡效果 */
    margin-left: 0; /* 默认展开状态下没有左边距 */
    width: calc(100% - 195px); /* 默认展开状态下的宽度 */
}

#mainP.is-collapsed {
    margin-left: 0; /* 收缩状态下也没有左边距 */
    width: calc(100% - 50px); /* 收缩状态下的宽度 */
}
    .login-tip {
    font-size: 14px;
    margin-top: 8px;
    }
    </style> 