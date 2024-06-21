import {request} from '@umijs/max';

export async function getRoleManageTree(params: APISystem.RoleTableSearchParams) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-role-manage-tree`, {
    method: 'GET',
    params: params
  });
}

export async function getAllByTenantMenuToTree(tenantId: string) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-all-by-tenant-menu-to-tree`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

export async function getAllTenantByRoleId(roleId: string) {
  return request<APISystem.SelectedRelationMenuDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-all-tenant-by-role-id/${roleId}`, {
    method: 'GET'
  });
}

export async function insertRoleMenu(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/insert-role-menu`, {
    method: 'POST',
    data: data
  });
}


export async function getRoleManageRoleDetailToList(params: APISystem.RoleTableSearchParams) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-role-manage-role-detail-to-list`, {
    method: 'GET',
    params: params
  });
}

export async function getRoleManageDetail(id: string) {
  return request<APISystem.RoleDetailResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-role-manage-detail/${id}`, {
    method: 'GET'
  });
}

export async function deleteRoleManage(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/role/delete-role-manage/${id}`, {
    method: 'DELETE'
  });
}

export async function insertRoleManage(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/insert-role-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateRoleManage(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/update-role-manage`, {
    method: 'PUT',
    data: data,
  });
}