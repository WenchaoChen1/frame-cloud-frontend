import {request} from '@umijs/max';

export async function getBusinessPermissionManageTree(params: APISystem.RoleTableSearchParams) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/business-permission/get-business-permission-manage-tree`, {
    method: 'GET',
    params: params
  });
}

export async function getBusinessPermissionManageDetail(id: string) {
  return request<APISystem.RoleDetailResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/business-permission/get-business-permission-manage-detail/${id}`, {
    method: 'GET'
  });
}

export async function getRoleManageRoleDetailToList(params: APISystem.RoleTableSearchParams) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-role-manage-role-detail-to-list`, {
    method: 'GET',
    params: params
  });
}

export async function deleteBusinessPermissionManage(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/business-permission/delete-business-permission-manage/${id}`, {
    method: 'DELETE'
  });
}

export async function insertBusinessPermissionManage(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/business-permission/insert-business-permission-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateBusinessPermissionManage(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/business-permission/update-business-permission-manage`, {
    method: 'PUT',
    data: data,
  });
}


export async function getRoleManageTenantMenuTree(tenantId: string) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/rTenantMenu/get-role-manage-tenant-menu-tree`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

export async function getAllMenuIdByRoleId(tenantId: string) {
  return request<APISystem.SelectedRelationMenuDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-all-menu-id-by-role-id/${tenantId}`, {
    method: 'GET'
  });
}

export async function insertRoleMenu(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/insert-role-menu`, {
    method: 'POST',
    data: data
  });
}
