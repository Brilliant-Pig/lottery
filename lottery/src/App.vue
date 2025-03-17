    <template>
        <!-- 主容器 -->
        <div class="demo-container">
        <!-- TinyVue布局容器 -->
            <tiny-container
            :pattern="pattern"
            :aside-width="asideWidth"
            :header-height="headerHeight"
            >
    
            <!-- 头部插槽 -->
            <template #header>
                <div class="header-container">
                <!-- 动态粒子背景 -->
                <div class="particles">
                    <tiny-layout class="demo-center" style="margin-top: 1vh;">🎉 欢迎来到魔法抽奖系统 🎉</tiny-layout>
                    <!-- 生成30个例子 -->
                    <div v-for="i in 30" :key="i" class="particle"></div>
                </div>
                </div>
            </template>
    
            <template #aside>
            <div :class="['aside-container', { 'is-collapsed': isCollapsed }]">
                <!-- 侧边栏插槽 -->
                <div class="collapse-button" @click="toggleCollapse">
                <el-icon :class="['arrow-icon', { 'is-collapsed': isCollapsed }]">
                    <arrow-left />
                </el-icon>
                </div>
            <!-- 侧边栏背景图 -->
            <div class="fullscreen-background">
                <img src="https://bpic.588ku.com/back_pic/06/12/54/72624b0dcf20a37.jpg" alt="lottery"/>
            </div>
            <!-- 动态滚条菜单区域 -->
            <el-scrollbar>
                <div v-for="(item, index) in customItems" :key="index" 
                class="scrollbar-demo-item"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = -1">
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
                <arrow-down />
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
            <tiny-layout id="mainP" >
            <!-- 路由视图调整 -->
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
        <div class="sub-title" style="margin-top: 10px">head portrait</div>
        <div class="demo-basic--circle">
            <div class="block">
                <el-avatar :size="60" :src="circleUrl" style="margin-top: 7px;margin-left:-250px;"/>          
            </div>
            </div>
        </el-row>
    </template>
    
    <script>
    import { User, Discount, Document, PieChart, MagicStick, ArrowDown, UploadFilled, Link } from '@element-plus/icons-vue'
    
    export default {
        name: 'MinePage',
        components: {
            User,
            Discount,
            Document,
            PieChart,
            MagicStick,
            ArrowDown,
            UploadFilled,
            Link
        },
        data() {
            return {
                name: '',
                hoverIndex: -1,
                childHover: -1,
                isCollapsed: false,
                pattern: 'default',
                asideWidth: 195,
                headerHeight: 80,
                circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
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
                                text: '模式二: 生成分享URL',
                                type: 'success',
                                icon: 'Link',
                                path: '/ManagersMain'
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
                                text: '进行中抽奖',
                                type: 'danger',
                                icon: 'Document',
                                path: '/ResultCus'
                            },
                            {
                                text: '历史抽奖记录',
                                type: 'danger',
                                icon: 'PieChart',
                                path: '/ResultMan'
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
    
        },
        methods: {
            handleClick(path) {
                this.$router.push(path);
            },
            toggleCollapse() {
                this.isCollapsed = !this.isCollapsed;
                this.asideWidth = this.isCollapsed ? 64 : 195;
            },
            login() {
                this.$router.push('LoginMain');
            }
        }
    };
    </script>
    
    <style scoped>
    /* 全屏背景容器 */
    .fullscreen-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -2;/* 置于底层 */
        overflow: hidden;/* 隐藏溢出内容 */
    }
    
    /* 背景图片样式 */
    .fullscreen-background img {
        width: 100%;
        height: 100%;
        opacity: 0.7;
    }
    
    /* 修复头像定位 */
    .demo-avatar.demo-basic {
        position: relative;
        z-index: 2;
    }
    
    /* 头部容器样式 */
    .demo-container .tiny-container :deep(.tiny-container__header) {
        border-bottom: 1.4px solid #d5d5d5;
        color: #4f4f4f;
        text-align: center;
        font-size: 40px;
        width: 100vw;
        z-index: 2;
        background: transparent;
        box-shadow: 5px 0px 15px -5px rgba(146, 146, 146, 0.477); /* 加粗下侧阴影 */
    
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
    
    /* 伸缩按钮样式 */
    .collapse-button {
        position: absolute;
        right: -12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2000;
        cursor: pointer;
        width: 24px;
        height: 24px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    
    .collapse-button:hover {
        background: #f5f7fa;
        transform: translateY(-50%) scale(1.1);
    }
    
    .arrow-icon {
        transition: transform 0.3s;
        color: #606266;
    }
    
    .arrow-icon.is-collapsed {
        transform: rotateY(180deg);
    }
    
    /* 侧边栏过渡动画 */
    .demo-container .tiny-container :deep(.tiny-container__aside) {
        transition: width 0.3s ease-in-out;
    }
    
    
    /* 主内容区样式 */
    .demo-container .tiny-container :deep(.tiny-container__main) {
        border: 2px solid #ffffff;
        color: #4f4f4f;
        height: auto;
        z-index: 1;
        background: #ffffff5b;
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
        transition: transform 0.5s ease; /* 位移动画 */
        flex-direction: column;     /* 纵向排列 */
    }
    
    /* 菜单项悬停效果 */
    .scrollbar-demo-item:hover {
        transform: translateX(3px);/* 右移3像素 */
        margin-bottom: 90px; /* 为子菜单腾出空间 */
    }
    /* 菜单图标动画 */
    .scrollbar-demo-item:hover .menu-icon {
        transform: rotate(145deg) scale(1.2); /* 组合变换 */
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
        margin-right: 6px;         /* 图标右边距 */
        transition: transform 0.3s; /* 变换动画 */
    }
    
    /* 子菜单悬停时图标效果 */
    .submenu-hover .child-icon {
        transform: rotate(15deg);  /* 旋转15度 */
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); /* 投影效果 */
    }
    
    /* 子菜单动画 */
    /* 子菜单进入动画 */
    .submenu-enter-active {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* 缓动函数 */
    }
    
    /* 子菜单离开动画 */
    .submenu-leave-active {
        transition: all 0.01s cubic-bezier(0.6, -0.3, 0.74, 0.05); /* 快速消失 */
    }
    
    /* 子菜单初始状态 */
    .submenu-enter-from {
        opacity: 0;                /* 完全透明 */
        transform: translateY(-10px) scaleY(0.9); /* 位置和缩放 */
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
    
    /* 调整父级按钮箭头样式 */
    /* 所有涉及第三方组件的样式都需要穿透 */
    :deep(.el-icon.arrow-down) {
        transition: transform 0.3s;
        margin-left: auto;
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
    
    .demo-basic {
        text-align: center;
    }
    .demo-basic .sub-title {
        margin-bottom: 10px;
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-left: 120px;
    }
    
    
    /* 粒子动画样式 */
    .particle {
        width: 7px;               /* 粒子大小 */
        height: 7px;
        background: radial-gradient(circle, #e7e6fb 20%, #95e3ae 100%); /* 渐变粒子 */
        position: absolute;       /* 绝对定位 */
        border-radius: 50%;       /* 圆形 */
        box-shadow: 0 0 15px #d1cdf0; /* 发光效果 */
        animation: float 3.5s infinite ease-in-out; /* 浮动动画 */
    }
    
    /* 粒子动画关键帧 */
    @keyframes float {
        0% { 
        transform: translateY(0) scale(0.8); /* 起始位置 */
        opacity: 0; 
        }
        50% { 
        transform: translateY(-150px) scale(1.2); /* 上升放大 */
        opacity: 1; 
        }
        100% { 
        transform: translateY(-300px) scale(0); /* 消失位置 */
        opacity: 0; 
        }
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
    
    #mainP { 
        height: auto;
        width: auto;
    }
    </style> 