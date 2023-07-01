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
  <!-- 切换主题 -->
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="default" icon="Setting" circle></el-button>
    </template>
  </el-popover>
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
import { ref } from 'vue'
const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
// 收集开关的数据
const dark = ref<boolean>(false)
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
const color = ref<string>(layoutSettingStore.color)
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// switch开关的change事件，进行暗黑模式的切换
const changeDark = () => {
  // 获取HTML根节点
  const html = document.documentElement
  // 判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
// 主题颜色的设置
const setColor = (val: string) => {
  layoutSettingStore.color = val
  layoutSettingStore.changeTheme()
  // 通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped lang="scss"></style>
