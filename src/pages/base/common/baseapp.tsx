import {getLocalStorage, setLocalStorage} from '@/utils/utils';
import { CURRENT_ACCOUNT_ID,USER_ROUTER } from "@/pages/common/constant";
import {getLoginInfoService} from '@/services/base-service/system-service/userService';

export const fetchUserInfoService = async () => {
  const currentAccountId = getLocalStorage(CURRENT_ACCOUNT_ID);
  const data = { currentAccountId: currentAccountId || '' };
  const accountInfoResponse = await getLoginInfoService(data);
  let currentUser = accountInfoResponse.data;

  if (currentUser) {
    setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.leftAndTopRoutes));
    // setLocalStorage(USER_ROUTER, JSON.stringify(currentUser?.functionPermissionCode));
    return currentUser;
  }

  return undefined;
};