import { request } from '@umijs/max';

export async function getScopeManagePage(params: APIIdentity.Pager) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/get-scope-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function getScopeManageDetail(id: APIIdentity.Pager) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/get-scope-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function insertScopeManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/insert-scope-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateScopeManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/update-scope-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteScopeManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/delete-scope-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function scopeManageAssignedPermission(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/scope-manage-assigned-permission`, {
    method: 'POST',
    data: data,
  });
}

