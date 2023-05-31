<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()

// 控制当前组件是否销毁重建
const flag = ref(true)

// 监听仓库内部数据是否发生改变,如果发生变化，说明用户点击过刷新按钮
watch(
  () => layoutSettingStore.refsh,
  () => {
    // 点击刷新按钮：路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
