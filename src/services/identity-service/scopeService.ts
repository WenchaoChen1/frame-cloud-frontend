import {
  getScopeManagePage,
  updateScopeManage,
  insertScopeManage,
  deleteScopeManage,
  scopeManageAssignedPermission,
  getPermis,
} from "@/services/api/identity-api/scopeApi";

export async function getScopeManagePageService(params?: any) {
  return await getScopeManagePage(params);
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

export async function scopeManageAssignedPermissionService(data?: any) {
  return await scopeManageAssignedPermission(data);
}

export async function getPermisService(params?: any) {
  return await getPermis(params);
}