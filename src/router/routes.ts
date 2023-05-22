// 对外暴露配置路由(常量路由)
import { RouteRecordRaw } from 'vue-router'
export const constantRoute: Array<RouteRecordRaw> = [
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    // 登录成功以后展示数据的路由
    path: '/',
    name: 'layout',
    component: () => import('@/views/home/index.vue'),
  },
  {
    // 404
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
  },
  {
    // Any
    path: '/:pathMatch(.*)*',
    name: 'Any',
    redirect: '/404',
  },
]
