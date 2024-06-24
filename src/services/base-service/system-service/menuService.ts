import {
  getMenuManageTree,
  insertMenuManage,
  updateMenuManage,
  deleteMenuManage,
  getMenuManageDetail,
  getTenantManageMenuTree,
} from "@/services/base-service/api/system-api/menuApi";

export async function getMenuManageTreeService (data?: any) {
  return await getMenuManageTree(data);
}

export async function getMenuManageDetailService (data?: any) {
  return await getMenuManageDetail(data);
}

export async function insertMenuManageService(data?: any) {
  return await insertMenuManage(data);
}

export async function updateMenuManageService(data?: any) {
  return await updateMenuManage(data);
}

export async function deleteMenuManageService(id: string) {
  return await deleteMenuManage(id);
}

export async function getTenantManageMenuTreeService(id: string) {
  return await getTenantManageMenuTree(id);
}