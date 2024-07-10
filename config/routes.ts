// umi 的路由配置文件
export default [
  {
    path: '/Welcome',
    name: 'welcome',
    component: './Welcome',
    access:'routePermission'
  },
  {
    path: '/',
    redirect: '/Welcome',
  },
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
    name: 'system-management',
    path: '/system-management',
    icon: 'table',
    access:'routePermission',
    routes: [
      {
        name: 'menu.menu-list',
        icon: 'table',
        path: '/system-management/menu-list',
        access:'routePermission',
        component: './base/system/menu',
      },
      {
        name: 'dict.dict-list',
        icon: 'table',
        path: '/system-management/dict',
        access:'routePermission',
        component: './base/system/dict',
      },
      {
        name: 'tenant.tenant-list',
        icon: 'table',
        path: '/system-management/tenant',
        access:'routePermission',
        component: './base/system/tenant',
      },
      {
        name: 'organize.organize-list',
        icon: 'table',
        path: '/system-management/organize',
        access:'routePermission',
        component: './base/system/organize',
      },
      {
        name: 'role.role-list',
        icon: 'table',
        path: '/system-management/role',
        access:'routePermission',
        component: './base/system/role',
      },
      {
        name: 'user.user-list',
        icon: 'table',
        path: '/system-management/user-list',
        access:'routePermission',
        component: './base/system/user',
      },
      {
        name: 'account.account-list',
        icon: 'table',
        path: '/system-management/account',
        access:'routePermission',
        component: './base/system/account',
      },
      {
        name: 'metadata.metadata-list',
        icon: 'table',
        path: '/system-management/metadata',
        access:'routePermission',
        component: './base/system/metadata',
      },
      {
        name: 'permission.permission-list',
        icon: 'table',
        path: '/system-management/permission',
        access:'routePermission',
        component: './base/system/permission',
      },
      {
        name: 'businessPermission.businessPermission-list',
        icon: 'table',
        path: '/system-management/businessPermission',
        access:'routePermission',
        component: './base/system/businessPermission',
      },
    ],
  },
  {
    name: 'identity-management',
    path: '/identity-management',
    icon: 'table',
    access:'routePermission',
    routes: [
      {
        name: 'authorization.list',
        icon: 'table',
        path: '/identity-management/authorization-list',
        access:'routePermission',
        component: './base/identity/authorization',
      },
      {
        name: 'application',
        icon: 'table',
        path: '/identity-management/application',
        access:'routePermission',
        component: './base/identity/application',
      },
      {
        name: 'compliance',
        icon: 'table',
        path: '/identity-management/compliance',
        access:'routePermission',
        component: './base/identity/compliance',
      },
      {
        name: 'scope.list',
        icon: 'table',
        path: '/identity-management/scope-list',
        access:'routePermission',
        component: './base/identity/scopeList',
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
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
