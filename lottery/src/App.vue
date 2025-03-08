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
<!-- 模板部分修改 -->
<template #aside>
  <div class="fullscreen-background">
    <img src="https://bpic.588ku.com/back_pic/06/12/54/72624b0dcf20a37.jpg" alt="lottery"/>
  </div>
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
        <el-icon v-if="item.icon" class="menu-icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="menu-text">{{ item.text }}</span>
        <el-icon v-if="item.children" class="ml-2">
          <arrow-down />
        </el-icon>
      </el-button>

      <!-- 子菜单容器 -->
      <transition name="submenu">
        <div v-if="item.children && hoverIndex === index" 
              class="submenu-container">
          <div v-for="(child, childIndex) in item.children" 
                :key="childIndex"
                class="submenu-item"
                @mouseenter="childHover = childIndex"
                @mouseleave="childHover = -1">
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
</template>
      <tiny-layout id="mainP" >
      <!-- 主体尺寸调整 -->
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
import { reactive, toRefs,markRaw,nextTick } from 'vue'
import { ref } from 'vue'
import { User, Discount, Document, PieChart, MagicStick, ArrowDown, UploadFilled, Link,  } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// 创建图标映射表
const icons = {
  User: markRaw(User),
  Discount: markRaw(Discount),
  Document: markRaw(Document),
  PieChart: markRaw(PieChart),
  MagicStick: markRaw(MagicStick),
  ArrowDown: markRaw(ArrowDown),
  UploadFilled: markRaw(UploadFilled),
  Link: markRaw(Link)
}
const customItems = ref([
  { text: '使用说明', type: 'primary', icon: MagicStick, path: '/LotteryMain' },
  { text: '创建抽奖', type: 'success', icon: Discount, children: [
      { 
        text: '模式一: 上传CSV/Excel',
        type: 'success',
        icon: UploadFilled,
        path: '/ManagersMain'
      },
      {
        text: '模式二: 生成分享URL',
        type: 'success',
        icon: Link,
        path: '/ManagersMain'
      } 
    ]}, 
  { text: '参与名单', type: 'warning', icon: Document, path: '/CustomersMain' },
  { text: '抽奖结果', type: 'danger', icon: PieChart,children:[
    { 
      text: '进行中抽奖',
      type: 'danger',
      icon: Document,
      path: '/ResultMan'
    },
    {
      text: '历史抽奖记录',
      type: 'danger',
      icon: PieChart,
      path: '/ResultMan'
    }
  ]  }, // 或ResultMan根据需求
  { text: '个人中心', type: 'info', icon: User, path: '/LoginMain' }
])

const hoverIndex = ref(-1)
const childHover = ref(-1)
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

.fullscreen-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.fullscreen-background img {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}


/* 修复头像定位 */
.demo-avatar.demo-basic {
  position: relative;
  z-index: 2;
}

.demo-container .tiny-container :deep(.tiny-container__header) {
  background-color: #ffffff;
  border-bottom: 2px solid #d5d5d5;
  color: #4f4f4f;
  text-align: center;
  font-size: 40px;
  width: 100vw;
  z-index: 2;
}

.demo-container .tiny-container :deep(.tiny-container__aside) {
  background-color: #ffffff;
  border-right: 1px solid #a7a7a7;
  box-shadow: 2px 0px 19px -10px rgba(255, 255, 255, 0.3);/*对侧边栏添加了适当阴影，增加视觉效果*/
  color: #d27070;
  width: 130vh;
  height:91%;
  z-index: 1;
  overflow: visible; 
}

.demo-container .tiny-container :deep(.tiny-container__main) {
  border: 1px solid #ffffff;
  color: #4f4f4f;
  height:91.7%;
  z-index: 1;
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
  position: relative; 
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 5px;
  margin-bottom: 5px;
  text-align: center;
  border-radius: 10px;
  transition: transform 0.3s ease;
  flex-direction: column; /* 改为纵向布局 */
}
.scrollbar-demo-item:hover {
  transform: translateX(3px);
  margin-bottom: 90px; /* 为子菜单腾出空间 */
}
.menu-icon {
  transition: transform 0.5s ease;
  margin-right: 8px;
}

.menu-text {
  position: relative;
  transition: color 0.6s ease;
}

/* 新增样式 */
.submenu-container {
  position: absolute;
  left: 0;
  top: 100%; /* 关键修改：定位到父元素底部 */
  width: 100%; /* 保持与父按钮同宽 */
  min-width: auto;
  margin-top: 8px; /* 添加间隔 */
  transform-origin: top center; /* 调整动画基准点 */
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 0 0 8px 8px;
}


@media (max-width: 768px) {
  .submenu-container {
    position: fixed;
    width: 80vw;
    left: 50% !important;
    transform: translateX(-50%);
  }
}

.submenu-item:hover {
  transform: translateX(5px);
}

.child-icon {
  margin-right: 6px;
  transition: transform 0.3s;
}

.submenu-hover .child-icon {
  transform: rotate(15deg);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* 子菜单动画 */
.submenu-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.submenu-leave-active {
  transition: all 0.2s cubic-bezier(0.6, -0.3, 0.74, 0.05);
}
.submenu-enter-from {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.9);
}
.submenu-enter-to {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
.submenu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 调整父级按钮箭头样式 */
/* 所有涉及第三方组件的样式都需要穿透 */
:deep(.el-icon.arrow-down) {
  transition: transform 0.3s;
  margin-left: auto;
}

:deep(.submenu-container .el-button) {
  width: 100%;
  justify-content: start;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
}
:deep(.el-scrollbar__view) {
  overflow: visible !important;
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

.submenu-container::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom-color: rgba(255,255,255,0.95);
  filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.1));
}
/* 按钮默认样式 */
.el-button {
  background: transparent !important;
  border: 1px solid currentColor !important;
  transition: all 0.3s ease !important;
}


/* 按钮悬浮时的渐变效果 */
.el-button:hover {
  border-color: currentColor !important;
  box-shadow: 0 5px 12px rgba(255, 255, 255, 0.1) !important;
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
  width: 7px;
  height: 7px;
background: radial-gradient(circle, #e7e6fb 20%, #95e3ae 100%);
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 15px #d1cdf0;
  animation: float 3.5s infinite ease-in-out;
}

@keyframes float {
  0% { transform: translateY(0) scale(0.8); opacity: 0; }
  50% { transform: translateY(-150px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-300px) scale(0); opacity: 0; }
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

#mainP {
  height: 100%;
  width: 100%;
}
</style> 