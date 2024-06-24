import {
  getTenantManageTree,
  insertTenantManage,
  updateTenantManage,
  deleteTenantManage,
  getTenantManageDetail,
  batchDeleteTenant,
  getAllByTenantId,
  getChildrenByTenantId,
  insertTenantMenu,
} from '@/services/base-service/api/system-api/tenantApi';

export async function getTenantManageTreeService(params:any) {
  return await getTenantManageTree(params);
}

export async function insertTenantManageService(data?: any) {
  return await insertTenantManage(data);
}

export async function updateTenantManageService(data?: any) {
  return await updateTenantManage(data);
}

export async function deleteTenantManageService(id: string) {
  return await deleteTenantManage(id);
}

export async function getTenantManageDetailService(id: string) {
  return await getTenantManageDetail(id);
}

export async function batchDeleteTenantService(params: any) {
  return await batchDeleteTenant(params);
}

export async function getChildrenByTenantIdService(tenantId: string) {
  return await getChildrenByTenantId(tenantId);
}

// export async function findAllMenuTreeByTenantService(tenantId: string) {
//   return await getTenantManageMenuTree(tenantId);
// }

export async function findSelectedMenuByTenantService(tenantId: string) {
  return await getAllByTenantId(tenantId);
}

export async function onSaveMenuInTenantService(data: APISystem.onSaveMenuInTenantDataType) {
  return await insertTenantMenu(data);
}
