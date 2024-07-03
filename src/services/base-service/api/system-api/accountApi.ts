import { request } from '@umijs/max';

export async function insertAccountManage(data?: any) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/insert-account-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateAccountManage(data?: any) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/update-account-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteAccountManage(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/account/delete-account-manage/${id}`, {
    method: 'DELETE'
  });
}

export async function getAccountManageDetail(id: string) {
  return request<APISystem.AccountDetailResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-account-manage-detail/${id}`, {
    method: 'GET'
  });
}

export async function getAccountManagePage(params: APISystem.PageParams) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-account-manage-page`, {
    method: 'GET',
    params: params
  });
}

export async function getAccountManageTenantDetailToList(params: APISystem.PageParams) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/tenant/get-account-manage-tenant-detail-to-list`, {
    method: 'GET',
    params: params
  });
}

export async function getAccountManageRoleTree(tenantId: string) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-account-manage-role-tree/${tenantId}`, {
    method: 'GET',
  });
}
export async function getAllRoleIdByAccountId(accountId: string) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-all-role-id-by-account-id/${accountId}`, {
    method: 'GET',
  });
}
export async function updateAccountAssignedRole(data?: any) {
  return request<APISystem.AccountResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/update-account-assigned-role`, {
    method: 'POST',
    data: data,
  });
}
export async function getAccountManageTenantMenuTree(tenantId: string) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-account-manage-tenant-menu-tree/${tenantId}`, {
    method: 'GET',
  });
}
export async function getAllTenantMenuIdByAccountId(accountId: string) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-all-tenant-menu-id-by-account-id/${accountId}`, {
    method: 'GET',
  });
}
export async function updateAccountAssignedTenantMenu(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/update-account-assigned-tenant-menu`, {
    method: 'post',
    data
  });
}
export async function getAccountManageBusinessPermissionTree(tenantId: string) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-account-manage-business-permission-tree/${tenantId}`, {
    method: 'GET',
  });
}
export async function getAllBusinessPermissionIdByAccountId(accountId: string) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/get-all-business-permission-id-by-account-id/${accountId}`, {
    method: 'GET',
  });
}
export async function updateAccountAssignedBusinessPermission(data: APISystem.onSaveMenuInTenantDataType) {
  return request<APISystem.onSaveRelationMenuResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/account/update-account-assigned-business-permission`, {
    method: 'post',
    data
  });
}
