import {getLocalStorage, setLocalStorage} from '@/utils/utils';
import {CURRENT_ACCOUNT_ID, USER_ROUTER} from "@/pages/common/constant";
import {getLoginInfoService} from '@/services/base-service/system-service/userService';
import {getUserId} from "@/services/swagger/identity/userController";
import { useModel } from '@@/plugin-model';

// export const fetchUserInfoService = async () => {
//   const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
//   const data = {currentAccountId: currentAccountId || ''};
//   const accountInfoResponse = await getLoginInfoService(data);
//   let currentUser = accountInfoResponse.data;
//
//   if (currentUser) {
//     setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.leftAndTopRoutes));
//     // setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.functionPermissionCode));
//     return currentUser;
//   }
//
//   return undefined;
// };

export const getCurrentLoginInformation = async () => {
  const { initialState } = useModel('@@initialState');
  //TODO 根据当前刷新时间判断是否大于10分钟，如果大于则再次执行updateCurrentLoginInformation，返回数据
 return initialState;
};

export const updateCurrentLoginInformation = async () => {
  const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
  const data = {currentAccountId: currentAccountId || ''};
  const accountInfoResponse = await getLoginInfoService(data);
  //TODO 获取接口返回的所有数据并存入缓存中，同时增加一个当前刷新时间
  // let currentUser = accountInfoResponse.data;
  //
  // if (currentUser) {
  //   setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.leftAndTopRoutes));
  //   // setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.functionPermissionCode));
  //   return currentUser;
  // }

  return undefined;
};
export const getUserId = async () => {
//TODO getCurrentLoginInformation中的数据
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


