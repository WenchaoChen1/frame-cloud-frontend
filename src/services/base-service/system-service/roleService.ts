import {
  getRoleManageTree,
  getRoleManageDetail,
  deleteRoleManage,
  insertRoleManage,
  updateRoleManage,
  getRoleManageRoleDetailToList,
  getRoleManageTenantMenuTree,
  updateRoleAssignedTenantMenu,
  getAllTenantMenuIdByRoleId,
} from "@/services/base-service/api/system-api/roleApi";

export async function getRoleManageTreeService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageTree(params);
}

export async function getRoleManageRoleDetailToListService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageRoleDetailToList(params);
}

export async function getRoleManageTenantMenuTreeService(tenantId?: any) {
  return await getRoleManageTenantMenuTree(tenantId);
}

export async function getRoleManageDetailService(id: string) {
  return await getRoleManageDetail(id);
}

export async function deleteRoleManageService(id: string) {
  return await deleteRoleManage(id);
}

export async function insertRoleManageService(data?: any) {
  return await insertRoleManage(data);
}

export async function updateRoleManageService(data?: any) {
  return await updateRoleManage(data);
}

export async function updateRoleAssignedTenantMenuService(data?: any) {
  return await updateRoleAssignedTenantMenu(data);
}

export async function getAllTenantMenuIdByRoleIdService(data?: any) {
  return await getAllTenantMenuIdByRoleId(data);
}
