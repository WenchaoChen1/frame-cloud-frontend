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
  updateRoleAssignedBusinessPermission,
  getRoleManageBusinessPermissionTree,
  getAllBusinessPermissionIdByRoleId,
} from "@/services/base-service/api/system-api/roleApi";

export async function getRoleManageTreeService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageTree(params);
}

export async function getRoleManageRoleDetailToListService(params: any) {
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

export async function updateRoleAssignedBusinessPermissionService(data?: any) {
  return await updateRoleAssignedBusinessPermission(data);
}

export async function getRoleManageBusinessPermissionTreeService(tenantId?: any) {
  return await getRoleManageBusinessPermissionTree(tenantId);
}

export async function getAllBusinessPermissionIdByRoleIdService(roleId?: any) {
  return await getAllBusinessPermissionIdByRoleId(roleId);
}
