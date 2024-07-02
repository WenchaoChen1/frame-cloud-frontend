// umi 的路由配置文件
export default [
  {
    path: '/Welcome',
    name: 'index',
    access: 'welcomePermission',
    component: './Welcome',
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
        name: 'metadata.metadata-list',
        icon: 'table',
        path: '/system-management/metadata',
        component: './base/system/metadata',
      },
      {
        name: 'permission.permission-list',
        icon: 'table',
        path: '/system-management/permission',
        component: './base/system/permission',
      },
      {
        name: 'businessPermission.businessPermission-list',
        icon: 'table',
        path: '/system-management/businessPermission',
        component: './base/system/businessPermission',
      },
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
    name: 'account',
    icon: 'user',
    path: '/account',
    // access: 'accountPermission',
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