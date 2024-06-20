import {
  getApplicationManagePage,
  getApplicationManageDetail,
  updateApplicationManage,
  deleteApplicationManage,
  insertApplicationManage,
} from "@/services/api/identity-api/applicationApi";

export async function getApplicationListService(params?: any) {
  return await getApplicationManagePage(params);
}

export async function getApplicationManageDetailService(params?: any) {
  return await getApplicationManageDetail(params);
}

export async function updateApplicationManageService(data?: any) {
  return await updateApplicationManage(data);
}

export async function insertApplicationManageService(data?: any) {
  return await insertApplicationManage(data);
}

export async function deleteApplicationService(id: string) {
  return await deleteApplicationManage(id);
}
