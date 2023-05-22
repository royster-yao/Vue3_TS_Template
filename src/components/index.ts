// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import { App } from 'vue'
import { isValidKey } from '@/utils/isValidKey'

const allGloablComponent = { SvgIcon, Pagination }
// 对外暴露一个对象
export default {
  install(app: App<Element>) {
    Object.keys(allGloablComponent).forEach((key) => {
      if (isValidKey(key, allGloablComponent)) {
        app.component(key, allGloablComponent[key])
      }
    })
  },
}
