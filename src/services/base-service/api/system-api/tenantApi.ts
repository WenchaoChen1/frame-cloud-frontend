import { request } from '@umijs/max';

export async function getTenantManageTree(params?: any) {
  return request(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/get-tenant-manage-tree`, {
    method: 'GET',
    params: params,
  });
}

export async function insertTenantManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/insert-tenant-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateTenantManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/update-tenant-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteTenantManage(id: string) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/delete-tenant-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function getTenantManageDetail(id: string) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/get-tenant-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function insertAndUpdateTenantManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/tenant/insert-and-update-tenant-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function batchDeleteTenant(params: any) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/tenant`, {
    method: 'DELETE',
    params: params
  });
}


//  get children tenant By tenantId
export async function getChildrenByTenantId(tenantId: string) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/tenant/findByTenantId`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

// tenant - relation menu - get selected menu by tenantId
export async function getAllByTenantId(tenantId: string) {
  return request<APISystem.SelectedRelationMenuDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/rTenantMenu/get-all-by-tenant-id`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

// tenant - relation menu - save Selected Menu By tenantId
export async function insertTenantMenu(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/rTenantMenu/insert-tenant-menu`, {
    method: 'POST',
    data: data
  });
}
