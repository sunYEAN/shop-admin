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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '主页', icon: 'dashboard'}
    }]
  },

  {
    path: '/customer',
    component: Layout,
    children: [{
      path: 'table',
      name: 'customer',
      component: () => import('@/views/shopGoodsUser/index'),
      meta: {title: '用户管理', icon: 'user'}
    }]
  },

  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'table',
      name: 'order',
      component: () => import('@/views/shopOrder/index'),
      meta: {title: '订单管理', icon: 'order'}
    }]
  },

  {
    path: '/goods',
    component: Layout,
    children: [{
      path: 'table',
      name: 'goods',
      component: () => import('@/views/shopGoodsManage/index'),
      meta: {title: '商品管理', icon: 'goods'}
    }]
  },

  {
    path: '/shop',
    component: Layout,
    name: 'Shop',
    meta: {title: '商城配置', icon: 'shop'},
    children: [
      {
        path: 'goods-cate',
        name: 'GoodsCate',
        component: () => import('@/views/shopGoodsCate/index'),
        meta: {title: '类别管理', icon: 'cate'}
      },
      {
        path: 'goods-attrs',
        name: 'GoodsAttrs',
        component: () => import('@/views/shopGoodsAttrs/index'),
        meta: {title: '参数管理', icon: 'table'}
      },

      {
        path: 'edit',
        name: 'GoodsEdit',
        hidden: true,
        component: () => import('@/views/shopGoodsEdit/index'),
        meta: {title: '编辑商品', icon: 'tree'}
      },
      {
        path: 'update',
        name: 'GoodsUpdate',
        hidden: true,
        component: () => import('@/views/shopGoodsUpdate/index'),
        meta: {title: '修改商品', icon: 'tree'}
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/shopCollection/index'),
        meta: {title: '收藏列表', icon: 'collect'}
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/shopCart/index'),
        meta: {title: '购物车', icon: 'cart'}
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user-table',
    name: 'System',
    meta: {title: '系统管理', icon: 'system'},
    children: [
      {
        path: 'user-auth',
        name: 'UserAuth',
        component: () => import('@/views/sysUsers/index'),
        meta: {title: '角色管理', icon: 'admin'}
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/sysMenu/index'),
        meta: {title: '菜单管理', icon: 'table'}
      },
      {
        path: 'logistics',
        name: 'Logistics',
        component: () => import('@/views/sysLogistics/index'),
        meta: {title: '物流管理', icon: 'logistics'}
      }
    ]
  },

  {
    path: '/program',
    component: Layout,
    redirect: '/program/setting',
    name: 'Program',
    meta: {title: '小程序', icon: 'program'},
    children: [
      {
        path: 'setting',
        name: 'MiniSetting',
        component: () => import('@/views/miniProgram/setting/index'),
        meta: {title: '配置中心', icon: 'setting'}
      },
      {
        path: 'navbar',
        name: 'MiniNavBar',
        component: () => import('@/views/miniProgram/navbar/index'),
        meta: {title: '导航设置', icon: 'nav'}
      },
      {
        path: 'design',
        name: 'MiniDesign',
        component: () => import('@/views/miniProgram/design/index'),
        meta: {title: '页面设计', icon: 'design'}
      },
    ]
  },
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

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router
