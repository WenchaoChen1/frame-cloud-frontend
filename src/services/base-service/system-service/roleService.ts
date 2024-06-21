import {
  getRoleManageTree,
  getRoleManageDetail,
  deleteRoleManage,
  insertRoleManage,
  updateRoleManage,
  getRoleManageRoleDetailToList,
  getAllByTenantMenuToTree,
  insertRoleMenu,
  getAllTenantByRoleId,
} from "@/services/base-service/api/system-api/roleApi";

export async function getRoleManageTreeService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageTree(params);
}

export async function getRoleManageRoleDetailToListService(params: APISystem.RoleTableSearchParams) {
  return await getRoleManageRoleDetailToList(params);
}

export async function getAllByTenantMenuToTreeService(tenantId?: any) {
  return await getAllByTenantMenuToTree(tenantId);
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

export async function insertRoleMenuService(data?: any) {
  return await insertRoleMenu(data);
}

export async function getAllTenantByRoleIdService(data?: any) {
  return await getAllTenantByRoleId(data);
}