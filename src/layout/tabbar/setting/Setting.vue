<template>
  <el-button
    size="default"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="default"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="default" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    alt="logo"
    style="width: 33px; height: 33px; margin: 0 10px; border-radius: 50%"
  />
  <el-dropdown style="margin-right: 10px">
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取骨架的小仓库
import useUserStore from '@/store/modules/user'
// 获取用户相关的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { useRouter, useRoute } from 'vue-router'
const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
// 刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

// 全屏按钮点击回调
const fullScreen = () => {
  // DOM 对象的一个属性：可以用来判断当前是不是全屏[全屏：true,不是全屏：false]
  const full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 利用文档根节点的方法 requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录点击的回调
const logout = async () => {
  // 第一件事：需要向服务器发请求[退出登录接口]
  // 第二件事：仓库当中关于用户相关的数据清空
  await userStore.userLogout()
  // 第三件事：跳转到登录界面
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<style scoped lang="scss"></style>
