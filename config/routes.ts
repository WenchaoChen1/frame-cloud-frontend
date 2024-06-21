// umi 的路由配置文件
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
    ],
  },
  {
    path: '/',
    redirect: '/system-management/menu-list',
  },
  {
    name: 'system-management',
    path: '/system-management',
    icon: 'table',
    access: 'systemManagement',
    routes: [
      {
        name: 'menu.menu-list',
        icon: 'table',
        path: '/system-management/menu-list',
        component: './base/system/menu',
      },
      {
        name: 'dict.dict-list',
        icon: 'table',
        path: '/system-management/dict',
        component: './base/system/dict',
      },
      {
        name: 'tenant.tenant-list',
        icon: 'table',
        path: '/system-management/tenant',
        component: './base/system/tenant',
      },
      {
        name: 'organize.organize-list',
        icon: 'table',
        path: '/system-management/organize',
        component: './base/system/organize',
      },
      {
        name: 'role.role-list',
        icon: 'table',
        path: '/system-management/role',
        component: './base/system/role',
      },
      {
        name: 'user.user-list',
        icon: 'table',
        path: '/system-management/user-list',
        component: './base/system/user',
      },
      {
        name: 'account.account-list',
        icon: 'table',
        path: '/system-management/account',
        component: './base/system/account',
      },
      {
        name: 'permission.permission-list',
        icon: 'table',
        path: '/system-management/permission',
        component: './base/system/permission',
      }
    ],
  },
  {
    name: 'identity-management',
    path: '/identity-management',
    icon: 'table',
    access: 'systemManagement',
    routes: [
      {
        name: 'authorization.list',
        icon: 'table',
        path: '/identity-management/authorization-list',
        component: './base/identity/authorization',
      },
      {
        name: 'application',
        icon: 'table',
        path: '/identity-management/application',
        component: './base/identity/application',
      },
      {
        name: 'compliance',
        icon: 'table',
        path: '/identity-management/compliance',
        component: './base/identity/compliance',
      },
      {
        name: 'scope.list',
        icon: 'table',
        path: '/identity-management/scope-list',
        component: './base/identity/scopeList',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    access: 'dashboardPermission',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
      {
        name: 'monitor',
        icon: 'smile',
        path: '/dashboard/monitor',
        component: './dashboard/monitor',
      },
      {
        name: 'workplace',
        icon: 'smile',
        path: '/dashboard/workplace',
        component: './dashboard/workplace',
      },
    ],
  },
  {
    path: '/form',
    icon: 'form',
    name: 'form',
    access: 'formPermission',
    routes: [
      {
        path: '/form',
        redirect: '/form/basic-form',
      },
      {
        name: 'basic-form',
        icon: 'smile',
        path: '/form/basic-form',
        component: './form/basic-form',
      },
      {
        name: 'step-form',
        icon: 'smile',
        path: '/form/step-form',
        component: './form/step-form',
      },
      {
        name: 'advanced-form',
        icon: 'smile',
        path: '/form/advanced-form',
        component: './form/advanced-form',
      },
    ],
  },
  {
    path: '/list',
    icon: 'table',
    name: 'list',
    access: 'listPermission',
    routes: [
      {
        path: '/list/search',
        name: 'search-list',
        component: './list/search',
        routes: [
          {
            path: '/list/search',
            redirect: '/list/search/articles',
          },
          {
            name: 'articles',
            icon: 'smile',
            path: '/list/search/articles',
            component: './list/search/articles',
          },
          {
            name: 'projects',
            icon: 'smile',
            path: '/list/search/projects',
            component: './list/search/projects',
          },
          {
            name: 'applications',
            icon: 'smile',
            path: '/list/search/applications',
            component: './list/search/applications',
          },
        ],
      },
      {
        path: '/list',
        redirect: '/list/table-list',
      },
      {
        name: 'table-list',
        icon: 'smile',
        path: '/list/table-list',
        component: './table-list',
      },
      {
        name: 'basic-list',
        icon: 'smile',
        path: '/list/basic-list',
        component: './list/basic-list',
      },
      {
        name: 'card-list',
        icon: 'smile',
        path: '/list/card-list',
        component: './list/card-list',
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    icon: 'profile',
    access: 'profilePermission',
    routes: [
      {
        path: '/profile',
        redirect: '/profile/basic',
      },
      {
        name: 'basic',
        icon: 'smile',
        path: '/profile/basic',
        component: './profile/basic',
      },
      {
        name: 'advanced',
        icon: 'smile',
        path: '/profile/advanced',
        component: './profile/advanced',
      },
    ],
  },
  {
    name: 'result',
    icon: 'CheckCircleOutlined',
    path: '/result',
    access: 'resultPermission',
    routes: [
      {
        path: '/result',
        redirect: '/result/success',
      },
      {
        name: 'success',
        icon: 'smile',
        path: '/result/success',
        component: './result/success',
      },
      {
        name: 'fail',
        icon: 'smile',
        path: '/result/fail',
        component: './result/fail',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    access: 'exceptionPermission',
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    access: 'accountPermission',
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  {
    component: '404',
    path: '/*',
  },
];
