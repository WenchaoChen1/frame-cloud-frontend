import { fetchUserInfoService } from '@/pages/base/common/baseapp';


//此处继承BaseInitialStateUtils 中的方法
export const fetchUserInfo = async () => {
  return fetchUserInfoService();
};
