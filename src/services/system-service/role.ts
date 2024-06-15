import {
  batchDeleteRole,
  deleteRole,
  findSelectedMenuByRole,
  getRoleByTenantId,
  getRoleInfo,
  getRoleList, insertAndUpdateRoleManage,
  insertRole,
  moveRole,
  onSaveMenuInRole,
  updateRole,
} from "@/services/api/system-api/roleApi";

// Role - list
export async function getRoleListService(params: APISystem.RoleTableSearchParams) {
  return await getRoleList(params);
}

export async function insertRoleService(data?: any) {
  return await insertAndUpdateRoleManage(data);
}

export async function updateRoleService(data?: any) {
  return await insertAndUpdateRoleManage(data);
}

export async function deleteRoleService(id: string) {
  return await deleteRole(id);
}

export async function getRoleInfoService(id: string) {
  return await getRoleInfo(id);
}

export async function batchDeleteRoleService(params: any) {
  return await batchDeleteRole(params);
}

export async function moveRoleService(data: APISystem.moveMenuDataType) {
  return await moveRole(data);
}

// role - relation menu - get Selected Menu By Role
export async function findSelectedMenuByRoleService(roleId: string) {
  return await findSelectedMenuByRole(roleId);
}

// role - relation menu - save Selected Menu By Role
export async function onSaveMenuInRoleService(data: APISystem.onSaveMenuInRoleDataType) {
  return await onSaveMenuInRole(data);
}

//  get role By tenantId
export async function getRoleByTenantIdService(tenantId: string) {
  return await getRoleByTenantId(tenantId);
}
