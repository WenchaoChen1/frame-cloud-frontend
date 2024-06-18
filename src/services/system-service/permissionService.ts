import {
  getPermissionList,
  getPermissionType,
  insertPermissionManage,
  updatePermissionManage,
  deletePermissionById,
} from "@/services/api/system-api/permissionApi";

export async function getPermissionListService(params: APIIdentity.Pager) {
  return await getPermissionList(params);
}

export async function getPermissionTypeService() {
  return await getPermissionType();
}

export async function insertPermissionManageService(data: APISystem.PermissionItemDataType) {
  return await insertPermissionManage(data);
}
export async function updatePermissionManageService(data: APISystem.PermissionItemDataType) {
  return await updatePermissionManage(data);
}

export async function deletePermissionByIdService(id: string) {
  return await deletePermissionById(id);
}
