// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin } from '@/api/user'
import { loginResponseData } from '@/api/user/types'
// 引入数据类型
import type { loginForm } from '@/api/user/types'
import type { UserState } from './types/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户的唯一标识
    }
  },
  // 异步 | 逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginForm) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登录请求：成功200 => token
      // 登录请求：失败201 => 登录失败的错误信息
      if (result.code === 200) {
        // pinia仓库存储一下 token
        this.token = result.data.token as string
        // 本地存储数据持久化
        SET_TOKEN(result.data.token as string)
        // 能保证当前的async函数返回一个成功的promise
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
  },
  getters: {},
})
// 对外暴露获取小仓库的方法
export default useUserStore
