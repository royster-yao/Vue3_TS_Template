<template>
  <div>
    <h1>我是一次路由，登录成功后展示数据 {{ count }}</h1>
    <el-button
      style="margin-top: 10px"
      type="primary"
      size="big"
      @click="count++"
    >
      start count
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
<style scoped lang="scss"></style>
