// 小仓库：layout组件相关的配置仓库
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用于菜单折叠还是收起的控制
      refsh: false, // 用于刷新效果
    }
  },
})

export default useLayoutSettingStore
