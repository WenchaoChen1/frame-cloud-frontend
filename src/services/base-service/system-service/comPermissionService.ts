import {
  getPermissionManagePage,
  getPermissionType,
} from "@/services/base-service/api/system-api/comPermissionApi";

export async function getPermissionManagePageService(type: any, params: APIIdentity.Pager) {
  return await getPermissionManagePage(type, params);
}

export async function getPermissionTypeService() {
  return await getPermissionType();
}
