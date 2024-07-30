import {getLocalStorage, setLocalStorage} from '@/utils/utils';
import {CURRENT_ACCOUNT_ID, USER_ROUTER} from "@/pages/common/constant";
import {getLoginInfoService, updateLoginInfoService} from '@/services/base-service/system-service/userService';
// import { useModel } from '@@/plugin-model';

const getModelCurrentLoginInformation = async () => {
  const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
  const data = {currentAccountId: currentAccountId || ''};
  const accountInfoResponse = await getLoginInfoService(data);
  let currentUser = accountInfoResponse.data;

  if (currentUser) {//TODO 时间差 > 30 或 init（初始）
    const timestamp = new Date().getTime(); // 获取当前时间的时间戳
    setLocalStorage('refreshTime', timestamp);
    setLocalStorage(USER_ROUTER, JSON.stringify(currentUser));
    return currentUser;
  }
  return undefined;
};

const updateModelCurrentLoginInformation = async () => {//TODO 时间差大于10小于30
  const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
  const data = {accountId: currentAccountId || ''};
  const accountInfoResponse = await updateLoginInfoService(data);
  let currentUser = accountInfoResponse.data;

  if (currentUser) {
    const timestamp = new Date().getTime(); // 获取当前时间的时间戳
    setLocalStorage('refreshTime', timestamp);
    setLocalStorage(USER_ROUTER, JSON.stringify(currentUser));
    return currentUser;
  }
  return undefined;
};


export const fetchUserInfoService: any = async () => {
  let nowTime = new Date().getTime();
  let lastTime = getLocalStorage('refreshTime')
  let TimeDifference = 0;

  if (lastTime) {
    const timeDifference = Math.abs(nowTime - Number(lastTime));
    TimeDifference = Math.floor(timeDifference / 1000 / 60);
  }

  //TODO 根据当前刷新时间判断(TimeDifference)是否大于10分钟，如果大于updateModelCurrentLoginInformation;
  //TODO 大于30分钟调用更新接口updateCurrentLoginInformation, 小于10分钟获取本地缓存数据
  // if (!lastTime || (TimeDifference > 30)) {
  //   return getModelCurrentLoginInformation();
  // } else if (TimeDifference > 10) {
    return updateModelCurrentLoginInformation();
  // } else {
  //   let list = getLocalStorage(USER_ROUTER);
  //   return JSON.parse(list);
  // }
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const getUserId = async () => {
//TODO getModelCurrentLoginInformation中的数据
  return undefined
};
export const getUserName = async () => {

};
export const getAccountId = async () => {

};
export const getAccountName = async () => {

};
export const getTenantId = async () => {

};
export const getLeftAndTopRoutes = async () => {

};
export const getRightRoutes = async () => {

};
export const getFunctionPermissionCode = async () => {

};
export const getPagePathAccessPermission = async () => {

};


