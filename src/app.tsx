import type {RequestConfig, RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {SettingDrawer} from '@ant-design/pro-components';
import defaultSettings from '../config/defaultSettings';
import {requestConfig} from './requestConfig';
import {fetchUserInfo} from './utils/infoInitialStateUtils';
import {fixMenuItemIcon, setAccountId} from './utils/utils'
import {AvatarDropdown, AvatarName, Footer, Question, SelectLang} from '@/components';
import {changeRouteData, findRouteByPath, isDev, isRouteInArray, loginPath, routeArray,} from './utils/AppUtils';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<APIIdentity.CurrentUser | undefined>;
}> {
// export async function getInitialState() {
  // 如果不是登录页面，执行
  const {location} = history;
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    setAccountId(currentUser?.accountId)
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
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  let userRouters = [];
  let pagePathAccessPermissionNow = [];
  if (initialState) {
    // console.log(JSON.parse(initialState?.currentUser), '******')
    const {leftAndTopRoutes,  pagePathAccessPermission} = initialState?.currentUser;
    userRouters = changeRouteData(leftAndTopRoutes);
    pagePathAccessPermissionNow = pagePathAccessPermission
  }

  const layoutConfig = {
    actionsRender: () => [<Question key="doc"/>, <SelectLang key="SelectLang"/>],
    avatarProps: {
      src: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      title: <AvatarName/>,
      render: (_: any, avatarChildren: any) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.accountName,
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
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
    childrenRender: (children: any) => {
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
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
    menu: {
      request: async () => {
        // 地址栏路由拦截
        const currentPath = window.location.pathname;
        let hasPermission = findRouteByPath(userRouters, currentPath);
        console.log('hasPermission:', hasPermission)

        if (isRouteInArray(currentPath, routeArray)) {
          //check pageRouter setting and userInfo
          const setting = pagePathAccessPermissionNow.includes("setting");
          const userInfo = pagePathAccessPermissionNow.includes("userInfo")
          if (setting) {
            hasPermission = true
          }
          if (userInfo) {
            hasPermission = true
          }
          if (!hasPermission) {
            window.location.href = '/401';
          }
        }

        return [...userRouters];
      },
    },
    menuDataRender: (menuData: any) => fixMenuItemIcon(menuData),
  };

  return layoutConfig;
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...requestConfig,
};
