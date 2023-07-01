<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="avatar" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
        <p class="sub-title">姚的管理后台</p>
      </div>
    </div>
  </el-card>
  <div class="svgIcon">
    <svg-icon name="welcome" width="500px" height="400px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
</script>
<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .sub-title {
      font-style: italic;
      color: rgb(163, 167, 169);
    }
  }
}
.svgIcon {
  display: flex;
  justify-content: center;
}
</style>
