import {
  getBusinessPermissionManageTree,
  getBusinessPermissionManageDetail,
  deleteBusinessPermissionManage,
  insertBusinessPermissionManage,
  updateBusinessPermissionManage,
  getRoleManageRoleDetailToList,
  getBusinessPermissionManageTenantMenuTree,
  getAllTenantMenuIdByBusinessPermissionId,
  updateBusinessPermissionAssignedTenantMenu,
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

export async function getBusinessPermissionManageTenantMenuTreeService(id?: any) {
  return await getBusinessPermissionManageTenantMenuTree(id);
}

export async function getAllTenantMenuIdByBusinessPermissionIdService(id?: any) {
  return await getAllTenantMenuIdByBusinessPermissionId(id);
}

export async function updateBusinessPermissionAssignedTenantMenuService(id?: any) {
  return await updateBusinessPermissionAssignedTenantMenu(id);
}
