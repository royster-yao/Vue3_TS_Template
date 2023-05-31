<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breacrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breacrumb from './breadcrumb/Breadcrumb.vue'
import Setting from './setting/Setting.vue'
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(240, 203, 203),
    rgb(186, 218, 136),
    rgb(240, 218, 218)
  );
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
