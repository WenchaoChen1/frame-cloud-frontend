import {
  getBusinessPermissionManageTree,
  getBusinessPermissionManageDetail,
  deleteBusinessPermissionManage,
  insertBusinessPermissionManage,
  updateBusinessPermissionManage,

  getRoleManageRoleDetailToList,
  getRoleManageTenantMenuTree,
  insertRoleMenu,
  getAllMenuIdByRoleId,
} from "@/services/base-service/api/system-api/businessApi";

export async function getBusinessPermissionManageTreeService(params: APISystem.RoleTableSearchParams) {
  return await getBusinessPermissionManageTree(params);
}

export async function getBusinessPermissionManageDetailService(id?: any) {
  return await getBusinessPermissionManageDetail(id);
}

export async function getRoleManageRoleDetailToListService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageRoleDetailToList(params);
}

export async function deleteBusinessPermissionManageService(id: string) {
  return await deleteBusinessPermissionManage(id);
}

export async function insertBusinessPermissionManageService(data?: any) {
  return await insertBusinessPermissionManage(data);
}

export async function updateBusinessPermissionManageService(data?: any) {
  return await updateBusinessPermissionManage(data);
}

export async function getRoleManageTenantMenuTreeService(tenantId?: any) {
  return await getRoleManageTenantMenuTree(tenantId);
}

export async function getRoleManageDetailService(id: string) {
  return await getRoleManageDetail(id);
}

export async function insertRoleMenuService(data?: any) {
  return await insertRoleMenu(data);
}

export async function getAllMenuIdByRoleIdService(data?: any) {
  return await getAllMenuIdByRoleId(data);
}
