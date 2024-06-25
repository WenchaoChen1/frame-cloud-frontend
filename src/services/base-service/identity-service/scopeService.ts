import {
  getScopeManagePage,
  getScopeManageDetail,
  updateScopeManage,
  insertScopeManage,
  deleteScopeManage,
  updateScopeManageAssignedPermission,
  getScopePermissionIdByScopeId,
} from "@/services/base-service/api/identity-api/scopeApi";

export async function getScopeManagePageService(params?: any) {
  return await getScopeManagePage(params);
}

export async function getScopeManageDetailService(params?: any) {
  return await getScopeManageDetail(params);
}

export async function insertScopeManageService(data?: any) {
  return await insertScopeManage(data);
}

export async function updateScopeManageService(data?: any) {
  return await updateScopeManage(data);
}

export async function deleteScopeManageService(id: string) {
  return await deleteScopeManage(id);
}

export async function updateScopeManageAssignedPermissionService(data?: any) {
  return await updateScopeManageAssignedPermission(data);
}

export async function getScopePermissionIdByScopeIdService(data?: any) {
  return await getScopePermissionIdByScopeId(data);
}
