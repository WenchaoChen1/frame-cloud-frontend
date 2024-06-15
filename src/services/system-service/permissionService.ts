import {
  deletePermissionById,
  getPermissionList,
  getPermissionType,
  insertAndUpdatePermissionManage,
  savePermission
} from "@/services/api/system-api/permissionApi";

export async function getPermissionListService(params: APIIdentity.Pager) {
  return await getPermissionList(params);
}

export async function getPermissionTypeService() {
  return await getPermissionType();
}

export async function savePermissionService(data: APISystem.PermissionItemDataType) {
  return await insertAndUpdatePermissionManage(data);
}

export async function deletePermissionByIdService(id: string) {
  return await deletePermissionById(id);
}
