// TODO
// import {outLogin} from '@/services/ant-design-pro/api';
// import {stringify} from 'querystring';
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {history, useModel} from '@umijs/max';
import {Spin} from 'antd';
import {createStyles} from 'antd-style';
import React, {useCallback} from 'react';
import HeaderDropdown from '../HeaderDropdown';
import {signOutService} from "@/services/base-service/identity-service/login";
import {getToken, logOut} from "@/utils/utils";
import {useIntl} from "@@/exports";

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState || {};
  console.log(currentUser, 'currentUser')
  return <span className="anticon">{currentUser?.accountName}</span>;
};

const useStyles = createStyles(({token}) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu, children}) => {
  const intl = useIntl();

  const loginOut = async () => { // 退出登录，并且将当前的 url 保存
    await signOutService({accessToken: getToken() ||''});
    logOut();

    const {search, pathname} = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect'); // 跳转到 redirect 参数所在的位置
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        // TODO
        // search: stringify({
        //   redirect: pathname + search,
        // }),
      });
    }
  };
  const {styles} = useStyles();

  const {initialState, setInitialState} = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: any) => {
      const {key} = event;
      if (key === 'logout') {
        // TODO
        // setInitialState((s) => ({...s, currentUser: undefined}));
        loginOut();
        return;
      }
      if (key === 'userInfo') {
        history.push(`/center`);
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
  if (!initialState) {
    return loading;
  }

  const {currentUser} = initialState;
  if (!currentUser || !currentUser.accountName) {
    return loading;
  }

  const menuItems = [
    // ...(menu
    //   ? [
    //     {
    //       key: 'center',
    //       icon: <UserOutlined/>,
    //       label: '个人中心',
    //     },
    //     {
    //       key: 'settings',
    //       icon: <SettingOutlined/>,
    //       label: '个人设置',
    //     },
    //     {
    //       type: 'divider' as const,
    //     },
    //   ]
    //   : []),
    {
      key: 'settings',
      icon: <SettingOutlined/>,
      label: '个人设置',
    },
    {
      key: 'userInfo',
      icon: <UserOutlined/>,
      label: '切换用户',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined/>,
      label: intl.formatMessage({id: 'menu.account.logout'})
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
