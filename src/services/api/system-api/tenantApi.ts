import { request } from '@umijs/max';

// tenant - list
export async function getTenantTree(
  params?: {
    current?: number;
    pageSize?: number;
  }
) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/tenant/get-tenant-by-id-to-tree`, {
    method: 'GET',
    params: params,
    // data: {}
  });
}

export async function insertAndUpdateTenantManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/tenant/insert-and-update-tenant-manage`, {
    method: 'POST',
    data: data,
  });
}export async function insertTenant(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/tenant`, {
    method: 'POST',
    data: data,
  });
}

export async function updateTenant(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/tenant`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteTenant(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/tenant`, {
    method: 'DELETE',
    params: {
      id: id,
    },
  });
}

export async function batchDeleteTenant(params: any) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/tenant`, {
    method: 'DELETE',
    params: params
  });
}


//  get children tenant By tenantId
export async function getChildrenByTenantId(tenantId: string) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/tenant/findByTenantId`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

//  get relation menu all tree By tenantId
export async function findAllMenuTreeByTenant(tenantId: string) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-all-menu-to-tree`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

// tenant - relation menu - get selected menu by tenantId
export async function findSelectedMenuByTenant(tenantId: string) {
  return request<APISystem.SelectedRelationMenuDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-all-tenant-menu-id`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

// tenant - relation menu - save Selected Menu By tenantId
export async function onSaveMenuInTenant(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/rTenantMenu/insertTenantMenu`, {
    method: 'POST',
    data: data
  });
}
