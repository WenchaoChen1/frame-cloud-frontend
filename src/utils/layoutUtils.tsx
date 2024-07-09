import { history } from '@umijs/max';
import { fixMenuItemIcon } from './utils'
import { SettingDrawer } from '@ant-design/pro-components';
import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { changeRouteData, isRouteInArray, findRouteByPath } from './routeUtils';

// 【路由白名单】不需要校验的路由名单可添加在此
const routeArray = ['/','/401', '/login', '/user/login'];
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const getLayoutConfig = ({ initialState, setInitialState }) => {
  let userRouters = [];
  if (initialState) {
    const { leftAndTopRoutes } = initialState?.currentUser;
    userRouters = changeRouteData(leftAndTopRoutes);
  }
  
  const layoutConfig = {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      title: <AvatarName />,
      render: (_: any, avatarChildren: any) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.accountName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
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
        const currentPath = window.location.pathname;
        const hasPermission = findRouteByPath(userRouters, currentPath);
        if (isRouteInArray(currentPath, routeArray)) {
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