import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import {fixMenuItemIcon, setLocalStorage} from './utils/utils'
import * as allIcons from '@ant-design/icons'
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

import {getLocalStorage} from '@/utils/utils';
import {SITE_TITLE, LOGIN_PATH, CURRENT_ACCOUNT_ID,USER_ROUTER} from "@/pages/common/constant";
import {getLoginInfoService} from '@/services/system-service/user';
import React from "react";
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: APIIdentity.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<APIIdentity.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    // try {
    //   const msg = await queryCurrentUser({
    //     skipErrorHandler: true,
    //   });
    //   return msg.data;
    // } catch (error) {
    //   history.push(loginPath);
    // }
    const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
    const accountInfoResponse = await getLoginInfoService({currentAccountId: currentAccountId || ''});

    let currentUser = accountInfoResponse.data;
    if (currentUser) {
      // clean default redirect page
      // redirect = '';
      // const dynamicRouteTree = handleRouteTree(accountInfoResponse?.data?.currentLoginAccountUserPermissions || []);
      // dynamicRouteTree.permission = handleAdminPermission(currentUser, dynamicRouteTree.permission);
      // currentUser = {...currentUser, ...dynamicRouteTree};
      setLocalStorage(USER_ROUTER,JSON.stringify(currentUser.currentLoginAccountUserPermissions))
      return currentUser;
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  let userRouters:any = []
  if (initialState){
    const {currentLoginAccountUserPermissions} = initialState?.currentUser
    userRouters = changeRouteData(currentLoginAccountUserPermissions)
  }
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      // src: initialState?.currentUser?.avatar,
      src: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.currentLoginAccount?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
    // menu: {
    //   request: async (params, defaultMenuData) => {
    //     // initialState.currentUser 中包含了所有用户信息
    //     return userRouters;
    //   },
    // },
    // 服务器返回菜单,icon不显示的问题
    menuDataRender:(menuData)=> fixMenuItemIcon(menuData),
    // 二级icon
    // menuItemRender: (menuItemProps, defaultDom) => {
    //   if (menuItemProps.isUrl || !menuItemProps.path) {
    //     return defaultDom;
    //   }
    //   return (
    //     <Link to={menuItemProps.path} className="itemChild" style={{display:'flex'}}>
    //         {menuItemProps.pro_layout_parentKeys &&
    //         menuItemProps.pro_layout_parentKeys.length > 0 &&
    //         menuItemProps.icon}
    //         {defaultDom}
    //     </Link>
    //   );
    // },
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
  // requestInterceptors: [authHeaderInterceptor],
  // responseInterceptors:[]
};

const changeRouteData = (data) =>{
  data.forEach(item=>{
    item.routes = item.children
    if (item.children && item.children.length > 0){
      changeRouteData(item.children)
    }
  })
  return data
}
