// 路由鉴权
import router from './router'
import pinia from './store'
import setting from './setting'
import useUserStore from './store/modules/user'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import nprogress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  nprogress.start()
  // 根据token，判断用户是否登录
  const token = userStore.token
  const username = userStore.username
  if (token) {
    // 用户已登录
    if (to.path === '/login') {
      next(from.path)
    } else {
      if (username) {
        next()
      } else {
        // 如果没有用户信息
        try {
          // 如果没有用户信息
          await userStore.userInfo()
          next()
        } catch (error) {
          // token 过期或者手动修改了token
          // 退出登录
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done()
})

// 用户未登陆： 只可以访问 login
// 登录成功，不能访问 login，其余的都可以访问
