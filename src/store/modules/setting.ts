// 小仓库：layout组件相关的配置仓库
import { defineStore } from 'pinia'
import { SETITEM, GETITEM } from '@/utils/dark'
const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用于菜单折叠还是收起的控制
      refsh: false, // 用于刷新效果
      // 主题颜色切换
      color: GETITEM('dark') ? GETITEM('dark') : 'rgba(255, 69, 0, 0.68)',
    }
  },
  actions: {
    changeTheme() {
      SETITEM('dark', this.color)
    },
  },
})

export default useLayoutSettingStore
