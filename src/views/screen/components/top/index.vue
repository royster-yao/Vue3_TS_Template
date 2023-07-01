<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import moment from 'moment'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const router = useRouter()
// 存储当前的时间
const time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
const timer = ref()
// 点击首页回到首页
const goHome = () => {
  router.push('./home')
}
// 组件挂载完毕更新当前的时间
onMounted(() => {
  setInterval(() => {
    timer.value = time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
  $TextColr: #29fcff;
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1.5;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;
    .lbtn {
      width: 150px;
      height: 40px;
      float: right;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: $TextColr;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: cover;
      text-align: center;
      line-height: 74px;
      color: $TextColr;
      font-size: 30px;
    }
  }
  .right {
    flex: 1.5;
    background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: $TextColr;
      font-size: 20px;
    }
    .time {
      color: $TextColr;
      margin-right: 30px;
      font-size: 20px;
    }
  }
}
</style>
