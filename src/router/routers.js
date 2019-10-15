import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/invoiced_detail',
    name: 'invoiced_detail',
    meta: {
      title: '发票',
      hideInMenu: true
    },
    component: () => import('@/view/company/components/tobeinvoiced_detail.vue')
  },
  {
    path: '/',
    name: '_index',
    redirect: '/login',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/index',
        name: 'index',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          // access:[ 'company']
        },
        component: () => import('@/view/home/home-index.vue')
      }
    ]
  },
  {
    path: '/tables',
    name: 'tables',
    meta: {
      icon: 'md-cog',
      title: '桌台',
    },
    component: Main,
    children: [
      {
        path: 'tables-manage',
        name: 'tables-manage',
        meta: {
          title: '桌台管理',
        },
        component: () => import('@/view/tables/tables-manage.vue')
      },
      {
        path: 'district-manage',
        name: 'district-manage',
        meta: {
          title: '区域管理',
        },
        component: () => import('@/view/tables/district-manage.vue')
      }
  ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-cog',
      title: '菜品',
    },
    component: Main,
    children: [
      {
        path: 'menu-manage',
        name: 'menu-manage',
        meta: {
          title: '菜品管理',
        },
        component: () => import('@/view/menu/menu-manage.vue')
      },
      {
        path: 'category-manage',
        name: 'category-manage',
        meta: {
          title: '分类管理',
        },
        component: () => import('@/view/menu/category-manage.vue')
      },
      {
        path: 'set-meal-manage',
        name: 'set-meal-manage',
        meta: {
          title: '套餐管理',
        },
        component: () => import('@/view/menu/set-meal-manage.vue')
      },
      {
        path: 'sub-shop-menu-manage',
        name: 'sub-shop-menu-manage',
        meta: {
          title: '子店菜品管理',
        },
        component: () => import('@/view/menu/sub-shop-menu-manage.vue')
      },
      // {
      //   path: 'sub-shop-setting',
      //   name: 'sub-shop-setting',
      //   meta: {
      //     title: '子店菜品权限设置',
      //   },
      //   component: () => import('@/view/menu/sub-shop-setting.vue')
      // }
    ]
  },
  // {
  //   path: '/agent-commission',
  //   name: 'agent-commission',
  //   meta: {
  //     icon: 'md-cog',
  //     title: '菜品订单',
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'total-agent-commission',
  //       name: 'total-agent-commission',
  //       meta: {
  //         title: '菜品管理',
  //       },
  //       component: () => import('@/view/order/food-order.vue')
  //     }
      // {
      //   path: 'list-agent-commission',
      //   name: 'list-agent-commission',
      //   meta: {
      //     title: '菜品订单管理',
      //     access:['admin']
      //   },
      //   component: () => import('@/view/order/.vue')
      // }
  //   ]
  // },
  //order-list start 订单列表
  {
    path: '/agent-order',
    name: 'agent-order',
    meta: {
      icon: 'ios-list-box',
      title: '订单',
    },
    component: Main,
    children: [
      {
        path: 'total-agent-allorder',
        name: 'total-agent-allorder',
        meta: {
          title: '全部订单',
        },
        component: () => import('@/view/order-list/allOrder.vue')
      },
      {
        path: 'list-agent-waiter',
        name: 'list-agent-waiter',
        meta: {
          title: '服务员订单',
        },
        component: () => import('@/view/order-list/waiter-order.vue')
      },
      {
        path: 'list-agent-sweep-order',
        name: 'list-agent-sweep-order',
        meta: {
          title: '扫码点餐订单',
        },
        component: () => import('@/view/order-list/sweep-code-order.vue')
      },
      {
        path: 'list-agent-takeout-order',
        name: 'list-agent-takeout-order',
        meta: {
          title: '外卖订单',
        },
        component: () => import('@/view/order-list/takeout-order.vue')
      },
    ]
  },
  //订单列表end
  //会员管理start
  {
    path: '/agent-member',
    name: 'agent-member',
    meta: {
      icon: 'md-person',
      title: '会员',
    },
    component: Main,
    children: [
      {
        path: 'total-agent-memberAdmin',
        name: 'total-agent-memberAdmin',
        meta: {
          title: '会员管理',
        },
        component: () => import('@/view/member/memberAdmin.vue')
      },
      {
        path: 'list-agent-memberPay',
        name: 'list-agent-memberPay',
        meta: {
          title: '会员充值',
        },
        component: () => import('@/view/member/memberPay.vue')
      },
      {
        path: 'list-agent-member-setting',
        name: 'list-agent-member-setting',
        meta: {
          title: '会员配置',
        },
        component: () => import('@/view/member/member-setting.vue')
      }
    ]
  },
  //会员管理end
  //报表start
  {
    path: '/form',
    name: 'form',
    meta: {
      icon: 'ios-pulse',
      title: '报表',
    },
    component: Main,
    children: [
      {
        path: 'food-sale-form',
        name: 'food-sale-form',
        meta: {
          title: '菜品销售统计表',
        },
        component: () => import('@/view/form/food-sale-form.vue')
      },
      {
        path: 'bussines-bill',
        name: 'bussines-bill',
        meta: {
          title: '营业统计对账',
        },
        component: () => import('@/view/form/bussines-bill.vue')
      },
      {
        path: 'whole-bill',
        name: 'whole-bill',
        meta: {
          title: '综合统计对账',
        },
        component: () => import('@/view/form/whole-bill.vue')
      },
      {
        path: 'sales-list',
        name: 'sales-list',
        meta: {
          title: '营业统计表',
        },
        component: () => import('@/view/form/sales-list.vue')
      }
    ]
  },
  {
    path: '/electronic-store',
    name: 'electronic-store',
    meta: {
      icon: 'md-cog',
      title: '门店',
      //access:[ 'admin']
    },
    component: Main,
    children: [
      {
        path: 'electronic-store-list',
        name: 'electronic-store-list',
        meta: {
          title: '门店列表',
          //access:[ 'admin']
        },
        component: () => import('@/view/store/electronic-store-list.vue')
      }
    ]
  },
  {
    path: '/electronic-user',
    name: 'electronic-user',
    meta: {
      icon: 'md-cog',
      title: '员工',
      //access:[ 'admin']
    },
    component: Main,
    children: [
      {
        path: 'user-list',
        name: 'user-list',
        meta: {
          title: '员工列表',
          //access:[ 'admin']
        },
        component: () => import('@/view/user/user-list.vue')
      }
    ]
  },
  {
    path: '/system-configure',
    name: 'system-configure',
    meta: {
      icon: 'md-cog',
      title: '设置',
      //access:[ 'admin']
    },
    component: Main,
    children: [
      {
        path: 'basic-info',
        name: 'basic-info',
        meta: {
          title: '基本信息',
          //access:[ 'admin']
        },
        component: () => import('@/view/system/basic-info.vue')
      },
      {
        path: 'business-model',
        name: 'business-model',
        meta: {
          title: '营业模式',
          //access:[ 'admin']
        },
        component: () => import('@/view/system/business-model.vue')
      },
      {
        path: 'takeout-settings',
        name: 'takeout-settings',
        meta: {
          title: '外卖设置',
          //access:[ 'admin']
        },
        component: () => import('@/view/system/takeout-settings.vue')
      },
      {
        path: 'account-settings',
        name: 'account-settings',
        meta: {
          title: '帐号设置',
          //access:[ 'admin']
        },
        component: () => import('@/view/system/account-settings.vue')
      }
    ]
  },
  // {
  //   path: '/agent-company-manage',
  //   name: 'agent-company-manage',
  //   meta: {
  //     icon: 'md-cog',
  //     title: '企业管理',
  //     //access:[ 'admin']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'list-agent-company-incoming',
  //       name: 'list-agent-company-incoming',
  //       meta: {
  //         title: '企业进件管理',
  //         //access:[ 'admin']
  //       },
  //       component: () => import('@/view/company/list-agent-company-incoming.vue')
  //     },
  //   ]
  // },
  // --------------------------------------------------------大后台-----------------------------------------------------------------
  // {
  //   path: '/take-money',
  //   name: 'take-money',
  //   meta: {
  //     icon: 'md-cog',
  //     title: '提现',
  //     //access:[ 'admin']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'take-money-setting',
  //       name: 'take-money-setting',
  //       meta: {
  //         title: '提现明细',
  //         //access:[ 'admin']
  //       },
  //       component: () => import('@/view/money/take-money.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/agent-personnel',
  //   name: 'agent-personnel',
  //   meta: {
  //     icon: 'md-cog',
  //     title: '员工管理',
  //     //access:[ 'admin']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'list-agent-personnel',
  //       name: 'list-agent-personnel',
  //       meta: {
  //         title: '员工管理',
  //         //access:[ 'admin']
  //       },
  //       component: () => import('@/view/personnel/list-agent-personnel.vue')
  //     },
  //   ]
  // },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: '动态路由',
          notCache: true
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: '带参路由',
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
]
