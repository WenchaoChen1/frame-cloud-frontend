import {
  batchDeleteDict,
  createDict,
  deleteDict,
  editDict,
  getDictInfo,
  getDictTree,
  moveDict
} from "@/services/base-service/api/system-api/dictApi";
import {Key} from "react";

export async function getDictTreeService(tenantId: string) {
  return await getDictTree(tenantId);
}

export async function createDictService(data?: any) {
  return await createDict(data);
}

export async function editDictService(data?: any) {
  return await editDict(data);
}

export async function deleteDictService(id: string) {
  return await deleteDict(id);
}

export async function getDictInfoService(id: Key) {
  return await getDictInfo(id);
}

export async function batchDeleteDictService(params: any) {
  return await batchDeleteDict(params);
}

export async function moveDictService(data: APISystem.moveMenuDataType) {
  return await moveDict(data);
}
