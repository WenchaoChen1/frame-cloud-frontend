import {
  insertAccountManage,
  updateAccountManage,
  deleteAccountManage,
  getAccountManageDetail,
  getAccountManagePage,
  getAccountManageTenantDetailToList,
  getAccountManageRoleTree,
  getAllRoleIdByAccountId,
  updateAccountAssignedRole,
  getAccountManageTenantMenuTree,
  getAllTenantMenuIdByAccountId,
  updateAccountAssignedTenantMenu,
  getAccountManageBusinessPermissionTree,
  getAllBusinessPermissionIdByAccountId,
  updateAccountAssignedBusinessPermission
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

export async function getAccountManagePageService(params: any) {
  return await getAccountManagePage(params);
}

export async function getAccountManageTenantDetailToListService(params: any) {
  return await getAccountManageTenantDetailToList(params);
}
export async function getAccountManageRoleTreeService(params: string) {
  return await getAccountManageRoleTree(params);
}
export async function getAllRoleIdByAccountIdService(accountId:string) {
  return await getAllRoleIdByAccountId(accountId);
}
export async function updateAccountAssignedRoleService(accountId:string) {
  return await updateAccountAssignedRole(accountId);
}
export async function getAccountManageTenantMenuTreeService(id: string) {
  return await getAccountManageTenantMenuTree(id);
}
export async function getAllTenantMenuIdByAccountIdService(id: string) {
  return await getAllTenantMenuIdByAccountId(id);
}
export async function updateAccountAssignedTenantMenuService(data: APISystem.onSaveMenuInTenantDataType) {
  return await updateAccountAssignedTenantMenu(data);
}
export async function getAccountManageBusinessPermissionTreeService(id: string) {
  return await getAccountManageBusinessPermissionTree(id);
}
export async function getAllBusinessPermissionIdByAccountIdService(id: string) {
  return await getAllBusinessPermissionIdByAccountId(id);
}
export async function updateAccountAssignedBusinessPermissionService(data: APISystem.onSaveMenuInTenantDataType) {
  return await updateAccountAssignedBusinessPermission(data);
}
