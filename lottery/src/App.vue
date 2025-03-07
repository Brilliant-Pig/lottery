<template>
    <div class="demo-container">
        <tiny-container
        :pattern="pattern"
        :aside-width="asideWidth"
        :header-height="headerHeight"
        >
        <template #header>
            <div class="header-container">
            <div class="particles">
                <tiny-layout class="demo-center" style="margin-top: 1vh;">🎉 欢迎来到魔法抽奖系统 🎉</tiny-layout>
                <div v-for="i in 30" :key="i" class="particle"></div>
            </div>
            </div>
        </template>
        <template #aside>
            <el-scrollbar>
            <div v-for="(item, index) in customItems" :key="index" 
                class="scrollbar-demo-item"
                @mouseenter="hoverIndex = index"
                @mouseleave="hoverIndex = -1">
                <el-button :type="item.type" plain 
                :class="{ 'button-hover': hoverIndex === index }"
                @click="handleClick(item.path)">
                <el-icon v-if="item.icon" class="menu-icon">
                <component :is="item.icon" />
                </el-icon>
                <span class="menu-text">{{ item.text }}</span>
                </el-button>
            </div>
            </el-scrollbar>
        </template>
        <tiny-layout class="demo-center" >
        <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
            </transition>
        </router-view>
        </tiny-layout>
        </tiny-container>
    </div>
        <el-row class="demo-avatar demo-basic">
        <div class="sub-title" style="margin-top: 10px">head portrait</div>
        <div class="demo-basic--circle">
            <div class="block">
            <el-avatar :size="60" :src="circleUrl" style="margin-top: 7px;margin-left:-250px;"/>
            </div>
        </div>
    </el-row>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { ref } from 'vue'
import { User, Discount, Document, PieChart } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const icons = {
    User,
    Discount,
    Document,
    PieChart
}
const customItems = ref([
    { text: '活动管理', type: 'success', icon: Discount, path: '/ManagersMain' },
    { text: '参与名单', type: 'warning', icon: Document, path: '/CustomersMain' },
    { text: '抽奖结果', type: 'danger', icon: PieChart, path: '/ResultMan' }, // 或ResultMan根据需求
    { text: '个人中心', type: 'info', icon: User, path: '/LotteryMain' }
])

const hoverIndex = ref(-1)
const pattern = ref('legend')
const asideWidth = ref(200)
const headerHeight = ref(80)

const state = reactive({
    circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl} = toRefs(state)


const router = useRouter()

const handleClick = (path: string) => {
    router.push(path)
}

</script>

<style scoped>


.demo-container .tiny-container :deep(.tiny-container__header) {
    background-color: #ffffff;
    border-bottom: 2px solid #d5d5d5;
    color: #4f4f4f;
    text-align: center;
    font-size: 40px;
    width: 100vw;
}

.demo-container .tiny-container :deep(.tiny-container__aside) {
    background-color: #ffffff;
    border-right: 1px solid #fcf6f6;
    box-shadow: 2px 0px 19px -10px rgba(0, 0, 0, 0.3);/*对侧边栏添加了适当阴影，增加视觉效果*/
    color: #d27070;
    width: 130vh;
    height:91%;/*对左侧栏高进行了修改 */
}

.demo-container .tiny-container :deep(.tiny-container__main) {
    border: 1px solid #ffffff;
    color: #4f4f4f;
    height:91%;/*对主体高进行了修改 */
}

.demo-container .tiny-container :deep(.main .changePattern .tiny-radio) {
    color: #a3a355;
    font-size: 16px;
    margin: 0 7px;
}
.demo-container .tiny-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 5px;
    margin-bottom: 5px;
    text-align: center;
    border-radius: 10px;
    transition: transform 0.3s ease;
}
.scrollbar-demo-item:hover {
    transform: translateX(10px);
}
.menu-icon {
    transition: transform 0.5s ease;
    margin-right: 8px;
}

.menu-text {
    position: relative;
    transition: color 0.6s ease;
}
.button-hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    background: linear-gradient(45deg, rgba(204, 0, 255, 0.1), transparent) !important;
}

.el-button {/*调整了按钮大小视觉效果*/
    width: 180px;
    height: 35px;
    border-radius: 5px;
}

.button-hover .menu-icon {
    transform: rotate(360deg);
    filter: drop-shadow(0 0 4px currentColor);
}

.button-hover .menu-text {
    color: #ffffff;
    text-shadow: 0 0 8px currentColor;
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
/* 修改header容器样式 */
.header-container {
    position: relative;
    overflow: visible; /* 改为visible允许溢出 */
    background: linear-gradient(
    #00af8c 20%,  /* 主色到30%位置 */
    #a0ffd4 70%,  /* 主色延伸到60%位置 */
    #ffffff 100%,  /* 过渡色到80% */
    transparent 100% /* 完全透明到100% */
    );
  padding-top: 5px; /* 增加底部间距 */
  padding-bottom: 5px; /* 增加底部间距 */
}

.particle {
    width: 6px;
    height: 6px;
    background: rgb(237, 151, 204);
    position: absolute;
    animation: float 2s infinite;
}

@keyframes float {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    50% { transform: translateY(-100px) scale(1.5); opacity: 1; }
    100% { transform: translateY(-200px) scale(0); opacity: 0; }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style> 