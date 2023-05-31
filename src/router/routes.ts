// 对外暴露配置路由(常量路由)
import { RouteRecordRaw } from 'vue-router'
export const constantRoute: Array<RouteRecordRaw> = [
  {
    // 登录
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hidden: true, // 路由标题再菜单中是否隐藏： true；隐藏 false：不隐藏
      icon: 'Promotion', // 菜单文字左侧的图标
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    // 登录成功以后展示数据的路由
    path: '/',
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: '/home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  {
    path: '/screen',
    name: 'Screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: 'Platform',
    },
    component: () => import('@/views/screen/index.vue'),
  },
  {
    path: '/acl',
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: '/acl/user',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
        name: 'Acl',
        component: () => import('@/views/acl/user/index.vue'),
      },
      {
        path: '/acl/role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
      },
      {
        path: '/acl/permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Menu',
        },
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
      },
    ],
  },
  {
    path: '/product',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
      hidden: false,
    },
    redirect: '/product/trademark',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          icon: 'ShoppingCart',
        },
        component: () => import('@/views/product/trademark/index.vue'),
      },
      {
        path: '/product/attr',
        name: 'Attr',
        meta: {
          title: '属性管理',
          icon: 'ChromeFilled',
        },
        component: () => import('@/views/product/attr/index.vue'),
      },
      {
        path: '/product/spu',
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          icon: 'Cpu',
        },
        component: () => import('@/views/product/spu/index.vue'),
      },
      {
        path: '/product/sku',
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          icon: 'Orange',
        },
        component: () => import('@/views/product/sku/index.vue'),
      },
    ],
  },
  {
    // 404
    path: '/404',
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'Lock',
    },
    component: () => import('@/views/404/index.vue'),
  },
  {
    // Any
    path: '/:pathMatch(.*)*',
    name: 'Any',
    redirect: '/404',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'Hide',
    },
  },
]
