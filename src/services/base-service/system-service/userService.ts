import {getLoginInfo} from "@/services/base-service/api/system-api/loginApi";

import {
  deleteUserManage,
  insertUserManage,
  updateUserManage,
  getUserManageDetail,
  getUserManagePage,
  userManageResetPassword,
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

export async function getLoginInfoService(data: APISystem.GetAccountInfoBody) {
  return await getLoginInfo(data);
}

export async function userManageResetPasswordService(data: APISystem.GetAccountInfoBody) {
  return await userManageResetPassword(data);
}