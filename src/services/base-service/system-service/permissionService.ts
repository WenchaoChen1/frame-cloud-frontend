import {
  getPermissionManagePage,
  insertPermissionManage,
  updatePermissionManage,
  deletePermissionManage,
  getPermissionType,
  getPermissionManageDetail,
} from "@/services/base-service/api/system-api/permissionApi";

export async function getPermissionManagePageService(params: any) {
  return await getPermissionManagePage(params);
}

export async function insertPermissionManageService(data: APISystem.PermissionItemDataType) {
  return await insertPermissionManage(data);
}

export async function updatePermissionManageService(data: APISystem.PermissionItemDataType) {
  return await updatePermissionManage(data);
}

export async function deletePermissionManageService(id: string) {
  return await deletePermissionManage(id);
}

export async function getPermissionManageDetailService(id: string) {
  return await getPermissionManageDetail(id);
}

export async function getPermissionTypeService() {
  return await getPermissionType();
}
