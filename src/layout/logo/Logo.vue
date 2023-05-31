<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="logo" />
    <p
      :class="{
        'p-fold': LayoutSettingStore.fold,
        'p-unfold': !LayoutSettingStore.fold,
      }"
    >
      我的后台的管理平台
    </p>
  </div>
</template>

<script setup lang="ts">
// 引入设置标题与logo的配置文件
import setting from '@/setting'
import useLayoutSettingStore from '@/store/modules/setting'
const LayoutSettingStore = useLayoutSettingStore()
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
