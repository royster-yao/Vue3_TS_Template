// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/types'
import type { UserState } from './types/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { constantRoute } from '@/router/routes'
// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户的唯一标识
      menuRoutes: constantRoute, // 仓库存储生产菜单需要的数组
      username: '',
      avatar: '',
    }
  },
  // 异步 | 逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登录请求：成功200 => token
      // 登录请求：失败201 => 登录失败的错误信息
      if (result.code === 200) {
        // pinia仓库存储一下 token
        this.token = result.data as string
        // 本地存储数据持久化
        SET_TOKEN(result.data as string)
        // 能保证当前的async函数返回一个成功的promise
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息进行存储仓库[用户头像，名字]
      const result: userInfoResponseData = await reqUserInfo()
      // 获取用户信息成功
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      }
      return Promise.reject(new Error(result.message))
    },
  },
  getters: {},
})
// 对外暴露获取小仓库的方法
export default useUserStore
