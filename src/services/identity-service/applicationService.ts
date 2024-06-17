import {
  getApplicationManagePage,
  getApplicationManageDetail,
  updateApplicationManage,
  deleteApplicationManage,
} from "@/services/api/identity-api/applicationApi";

export async function getApplicationListService(params?: any) {
  return await getApplicationManagePage(params);
}

export async function getApplicationManageDetailService(params?: any) {
  return await getApplicationManageDetail(params);
}

export async function addApplicationService(data?: any) {
  return await updateApplicationManage(data);
}

export async function deleteApplicationService(id: string) {
  return await deleteApplicationManage(id);
}
