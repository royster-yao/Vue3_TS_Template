<template>
  <!-- 顶部左侧的静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>

  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字和标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="vertical-align: bottom">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由标题 -->
      <span style="margin: 0 4px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

const LayoutSettingStore = useLayoutSettingStore()
const route = useRoute()
// 点击图标的方法
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>

<style scoped lang="scss"></style>
