import {
  getMenuManageTree,
  insertMenuManage,
  updateMenuManage,
  deleteMenuManage,
  getMenuManageDetail,
  getTenantManageMenuTree,
  updateMenuAssignedAttribute,
  getMenuManageAttributePage,
  getAllAttributeIdByMenuId,
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

export async function updateMenuAssignedAttributeService(id: any) {
  return await updateMenuAssignedAttribute(id);
}

export async function getMenuManageAttributePageService(data: any) {
  return await getMenuManageAttributePage(data);
}

export async function getAllAttributeIdByMenuIdService(id: string) {
  return await getAllAttributeIdByMenuId(id);
}
