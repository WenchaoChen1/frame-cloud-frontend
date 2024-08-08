import { GridContent } from '@ant-design/pro-components';
import { setLocalStorage, setAccountId} from '@/utils/utils';
import { USER_ROUTER, CURRENT_ACCOUNT_ID} from "@/pages/common/constant";
import React, { useState, useEffect } from 'react';
import useStyles from './style.style';
import { getSwitchUserAccountDetailService, updateLoginInfoService } from '@/services/base-service/system-service/userService'

const Settings: React.FC = () => {
  const { styles } = useStyles();
  const [userList, setUserList] = useState([])

  const initUserList = async () => {
    const response = await getSwitchUserAccountDetailService();
    if (response?.success === true) {
      setUserList(response?.data);
    }
  };

  const SwitchUser = async (accountId: any) => {
    const data = {accountId: accountId || ''};
    const response = await updateLoginInfoService(data);
    if (response?.success === true) {
      setAccountId(response?.data?.accountId)
      setLocalStorage(USER_ROUTER, JSON.stringify(response?.data));
      window.location.reload();
    }
  };

  useEffect(()=>{
    initUserList()
  },[])

  return (
    <GridContent>
      <div className={styles.warpUserinfo}>
        {userList?.map((value: any) => (
        <div className={styles.cardStyle} key={value?.accountId} onClick={()=>{SwitchUser(value?.accountId)}}>
          <span>{value?.accountName}</span>
          {/* <span>{value?.accountId}</span> */}
        </div>))}
      </div>
    </GridContent>
  );
};
export default Settings;
