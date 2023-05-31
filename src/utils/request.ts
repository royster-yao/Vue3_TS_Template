// 进行 axios 二次封装:使用请求、响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户相关的参数
import useUserStore from '@/store/modules/user'
// 第一步，利用 axios 对象的 create方法，去创建 axios 实例(其他的配置:基础路径、超时的时间)
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带 /api
  timeout: 5000, // 超时的时间设置
})
// 第二部：request 实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // config 配置对象，headers 属性请求头，经常给服务器端携带公共参数
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // 返回配置对象
  return config
})

// 第三步： request 相应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功的回调
    // 简化的数据
    return response.data
  },
  (err) => {
    // 失败的回调
    // 定义一个变量
    let message = ''
    // http 状态码
    const status = err.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(err)
  },
)

// 对外暴露
export default request
