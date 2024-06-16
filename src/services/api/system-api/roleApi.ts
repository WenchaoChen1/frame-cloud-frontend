import {request} from '@umijs/max';

// Role - list
export async function getRoleList(params: APISystem.RoleTableSearchParams) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/get-role-manage-tree`, {
    method: 'GET',
    params: params
  });
}

export async function insertAndUpdateRoleManage(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role/insert-and-update-role-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function insertRole(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role`, {
    method: 'POST',
    data: data,
  });
}

export async function updateRole(data?: any) {
  return request<APISystem.RoleResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/role`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteRole(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/role`, {
    method: 'DELETE',
    params: {id: id}
  });
}

export async function getRoleInfo(id: string) {
  return request<APISystem.RoleDetailResponseDataType>(`${process.env.SYSTEM_SERVICE}/role`, {
    method: 'GET',
    params: {id: id}
  });
}

export async function batchDeleteRole(params: any) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/role`, {
    method: 'DELETE',
    params: params
  });
}

export async function moveRole(data: APISystem.moveMenuDataType) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/role/move`, {
    method: 'PUT',
    data: data
  });
}

// role - relation menu - get Selected Menu By Role
export async function findSelectedMenuByRole(roleId: string) {
  return request<APISystem.SelectedRelationMenuDataType>(`${process.env.SYSTEM_SERVICE}/roleMenu/getRoleMenu`, {
    method: 'GET',
    params: {
      roleId: roleId
    }
  });
}

// role - relation menu - save Selected Menu By Role
export async function onSaveMenuInRole(data: APISystem.onSaveMenuInRoleDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/roleMenu/batchSave`, {
    method: 'POST',
    data: data,
  });
}

//  get role By tenantId
export async function getRoleByTenantId(tenantId: string) {
  return request<APISystem.RoleByTenantIdResponseDataType>(`${process.env.SYSTEM_SERVICE}/role/findAll`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}
