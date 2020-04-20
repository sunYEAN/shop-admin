import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主面板', icon: 'dashboard' }
    }]
  },

  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/cate',
    name: 'Shop',
    meta: { title: '商城管理', icon: 'example' },
    children: [
      {
        path: 'goods-cate',
        name: 'GoodsCate',
        component: () => import('@/views/shopGoodsCate/index'),
        meta: { title: '商品类别', icon: 'table' }
      },
      {
        path: 'goods-manage',
        name: 'GoodsManage',
        component: () => import('@/views/shopGoodsManage/index'),
        meta: { title: '商品管理', icon: 'tree' }
      },
      {
        path: 'edit',
        name: 'GoodsEdit',
        hidden: true,
        component: () => import('@/views/shopGoodsEdit/index'),
        meta: { title: '编辑商品', icon: 'tree' }
      },
      {
        path: 'update',
        name: 'GoodsUpdate',
        hidden: true,
        component: () => import('@/views/shopGoodsUpdate/index'),
        meta: { title: '修改商品', icon: 'tree' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/shopOrder/index'),
        meta: { title: '订单管理', icon: 'table' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/shopCollection/index'),
        meta: { title: '收藏列表', icon: 'table' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/shopCart/index'),
        meta: { title: '购物车', icon: 'tree' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user-table',
    name: 'System',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'user-table',
        name: 'UserTable',
        component: () => import('@/views/sysUserTable/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'user-auth',
        name: 'UserAuth',
        component: () => import('@/views/sysUserAuth/index'),
        meta: { title: '角色管理', icon: 'tree' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/sysMenu/index'),
        meta: { title: '菜单管理', icon: 'table' }
      },
      {
        path: 'logistics',
        name: 'Logistics',
        component: () => import('@/views/sysLogistics/index'),
        meta: { title: '物流管理', icon: 'table' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '消息管理',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '商城装扮', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
