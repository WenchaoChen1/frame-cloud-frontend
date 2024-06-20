import {
  insertAccountManage,
  updateAccountManage,
  deleteAccountManage,
  getAccountManageDetail,
  getAccountManagePage,
  getAccountManageTenantDetailToList,
} from '@/services/base-service/api/system-api/accountApi';

export async function insertAccountManageService(data?: any) {
  return await insertAccountManage(data);
}

export async function updateAccountManageService(data?: any) {
  return await updateAccountManage(data);
}

export async function deleteAccountManageService(id: string) {
  return await deleteAccountManage(id);
}

export async function getAccountManageDetailService(id: string) {
  return await getAccountManageDetail(id);
}

export async function getAccountManagePageService(params: API.PageParams) {
  return await getAccountManagePage(params);
}

export async function getAccountManageTenantDetailToListService(params: API.PageParams) {
  return await getAccountManageTenantDetailToList(params);
}
