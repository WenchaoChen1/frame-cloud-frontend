import { GridContent } from '@ant-design/pro-components';
import { Menu } from 'antd';
import React, { useLayoutEffect, useRef, useState } from 'react';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import Acount from "@/pages/account/settings/components/acount";
import LoginLog from "@/pages/account/settings/components/loginLog";
import useStyles from './style.style';
import FunctionPermission from '@/pages/base/components/functionPermission/index'
type SettingsStateKeys = 'base' | 'security' | 'account' | 'binding' | 'notification' | 'loginLog';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};
const Settings: React.FC = () => {
  const { styles } = useStyles();
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    security: '安全设置',
    account: '账户设置',
    binding: '账号绑定',
    notification: '新消息通知',
    loginLog:'用户在线授权'
  };
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef<HTMLDivElement>();
  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({
        ...initConfig,
        mode: mode as SettingsState['mode'],
      });
    });
  };
  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => ({ key: item, label: menuMap[item] }));
  };
  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <FunctionPermission code="basic-setup"><BaseView /></FunctionPermission>;
      case 'security':
        return <FunctionPermission code="security-settings"><SecurityView /></FunctionPermission>;
      case 'binding':
        return <FunctionPermission code="account-binding"><BindingView /></FunctionPermission>;
      case 'notification':
        return <FunctionPermission code="message-notification"><NotificationView /></FunctionPermission>;
      case 'account':
        return <FunctionPermission code="account-setting"><Acount /></FunctionPermission>;
        case 'loginLog':
        return <FunctionPermission code="loginLog"><LoginLog /></FunctionPermission>;
      default:
        return null;
    }
  };
  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig({
                ...initConfig,
                selectKey: key as SettingsStateKeys,
              });
            }}>
            {
              access.buttonPermission({name:'basic-setup'}) && <Menu.Item key="base">基本设置</Menu.Item>
            }
            {
              access.buttonPermission({name:'security-settings'}) && <Menu.Item key="security">安全设置</Menu.Item>
            }
            {
              access.buttonPermission({name:'account-setting'}) && <Menu.Item key="account">账户设置</Menu.Item>
            }
            {
              access.buttonPermission({name:'account-binding'}) && <Menu.Item key="binding">账号绑定</Menu.Item>
            }
            {
              access.buttonPermission({name:'message-notification'}) && <Menu.Item key="notification">新消息通知</Menu.Item>
            }
            {
              access.buttonPermission({name:'loginLog'}) && <Menu.Item key="loginLog">用户在线授权</Menu.Item>
            }
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
};
export default Settings;
