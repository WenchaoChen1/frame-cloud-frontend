import {getLoginInfo, updateAccountCurrentLoginInformation } from "@/services/base-service/api/system-api/loginApi";

import {
  deleteUserManage,
  insertUserManage,
  updateUserManage,
  getUserManageDetail,
  getUserManagePage,
  userManageResetPassword,
  getUserSettingsDetail,
  getAccountSettingsDetail,
  updateUserSettingsDetail,
  resetPassword,
  updateAccountSettingsDetail,
} from "@/services/base-service/api/system-api/userApi";

export async function getUserManagePageService(params: any) {
  return await getUserManagePage(params);
}

export async function getUserManageDetailService(id: string) {
  return await getUserManageDetail(id);
}

export async function updateUserManageService(data?: any) {
  return await updateUserManage(data);
}

export async function insertUserManageService(data?: any) {
  return await insertUserManage(data);
}

export async function deleteUserManageService(id: string) {
  return await deleteUserManage(id);
}

export async function getLoginInfoService(data: any) {
  return await getLoginInfo(data);
}

export async function updateLoginInfoService(data: any) {
  return await updateAccountCurrentLoginInformation(data);
}

export async function userManageResetPasswordService(data: APISystem.GetAccountInfoBody) {
  return await userManageResetPassword(data);
}

export async function getUserSettingsDetailService() {
  return await getUserSettingsDetail();
}
export async function getAccountSettingsDetailService() {
  return await getAccountSettingsDetail();
}
export async function updateUserSettingsDetailService(data?: any) {
  return await updateUserSettingsDetail(data);
}
export async function resetPasswordService(data?: any) {
  return await resetPassword(data);
}
export async function updateAccountSettingsDetailService(data?: any) {
  return await updateAccountSettingsDetail(data);
}
