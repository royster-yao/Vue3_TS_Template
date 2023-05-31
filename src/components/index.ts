// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
// 引入element-plus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { App } from 'vue'
import { isValidKey } from '@/utils/isValidKey'

const allGloablComponent = { SvgIcon, Category }
// 对外暴露一个对象
export default {
  install(app: App<Element>) {
    Object.keys(allGloablComponent).forEach((key) => {
      if (isValidKey(key, allGloablComponent)) {
        app.component(key, allGloablComponent[key])
      }
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
