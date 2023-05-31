// 定义小仓库state的类型
import { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

// 定义分类仓库state对象ts类型
export interface CategoryState {
  c1Arr: CategoryObj[]
  c1Id: string | number
  c2Arr: CategoryObj[]
  c2Id: string | number
  c3Arr: CategoryObj[]
  c3Id: string | number
}
