<template>
<div class="demo-container">
    <tiny-container
      :pattern="pattern"
      :aside-width="asideWidth"
      :header-height="headerHeight"
    >
      <template #header>
        <tiny-layout class="demo-center" style="margin-top: 2vh;">欢迎来到抽奖系统</tiny-layout>
      </template>
      <template #aside>
        <el-scrollbar >
          <!-- 修改后的循环内容 -->
          <div v-for="(item, index) in customItems" :key="index" class="scrollbar-demo-item">
            <el-button :type="item.type" plain @click="handleClick(item.path)">
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              {{ item.text }}
            </el-button>
          </div>
        </el-scrollbar>
      </template>
      <tiny-layout class="demo-center" ><router-view></router-view></tiny-layout>
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
  color: #5b90af;
  text-align: center;
  font-size: 40px;
  height: 80px;
  width: 100.01vw;
}

.demo-container .tiny-container :deep(.tiny-container__aside) {
  background-color: #ffffff;
  border-right: 2px solid #d5d5d5;
  color: #d27070;
  width: 130vh;
  height:636px;
}

.demo-container .tiny-container :deep(.tiny-container__main) {
  border: 1px solid #ffffff;
  color: #b1a859;
  height: 636px;
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
  margin-bottom: 10px;
  text-align: center;
  border-radius: 7px;
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
</style>