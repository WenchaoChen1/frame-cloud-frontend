import {
  getAttributeManagePage,
  getAttributeManageDetail,
  updateAttributeManage,
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
