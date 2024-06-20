import {
  getMenuManageTree,
  insertMenuManage,
  updateMenuManage,
  deleteMenuManage,
  moveMenu,
} from "@/services/api/system-api/menuApi";

export async function getMenuManageTreeService (data?: any) {
  return await getMenuManageTree(data);
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

