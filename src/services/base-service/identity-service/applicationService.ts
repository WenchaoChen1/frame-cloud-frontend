import {
  getApplicationManagePage,
  getApplicationManageDetail,
  updateApplicationManage,
  deleteApplicationManage,
  insertApplicationManage,
  updateApplicationManageAssignedScope,
  getApplicationScopeIdByApplicationId,
} from "@/services/base-service/api/identity-api/applicationApi";

export async function getApplicationListService(params?: any) {
  return await getApplicationManagePage(params);
}

export async function getApplicationManageDetailService(params?: any) {
  return await getApplicationManageDetail(params);
}

export async function updateApplicationManageService(data?: any) {
  return await updateApplicationManage(data);
}

export async function insertApplicationManageService(data?: any) {
  return await insertApplicationManage(data);
}

export async function deleteApplicationService(id: string) {
  return await deleteApplicationManage(id);
}

export async function updateApplicationManageAssignedScopeScopeService(data?: any) {
  return await updateApplicationManageAssignedScope(data);
}

export async function getApplicationScopeIdByApplicationIdScopeService(data?: any) {
  return await getApplicationScopeIdByApplicationId(data);
}