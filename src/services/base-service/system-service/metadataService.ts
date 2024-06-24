import {
  getAttributeManagePage,
  getAttributeManageDetail,
  updateAttributeManage,
  updateAttributeManageAssignedPermission,
  getAttributePermissionIdByAttributeId,
} from "@/services/base-service/api/system-api/metadataApi";

export async function getAttributeManagePageService(params?: any) {
  return await getAttributeManagePage(params);
}

export async function getAttributeManageDetailService(params?: any) {
  return await getAttributeManageDetail(params);
}

export async function updateAttributeManageService(data?: any) {
  return await updateAttributeManage(data);
}

export async function attributeManageAssignedPermissionService(data?: any) {
  return await updateAttributeManageAssignedPermission(data);
}

export async function getAttributePermissionIdByAttributeIdService(id?: any) {
  return await getAttributePermissionIdByAttributeId(id);
}