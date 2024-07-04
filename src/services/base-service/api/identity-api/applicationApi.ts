import { request } from '@umijs/max';

export async function getApplicationManagePage(params?: APIIdentity.Pager) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/get-application-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function getApplicationManageDetail(id: any) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/get-application-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function updateApplicationManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/update-application-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function insertApplicationManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/insert-application-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function deleteApplicationManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/delete-application-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function getAuthorizationGrantTypes() {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/constant/enums`, {
    method: 'GET',
  });
}

export async function updateApplicationManageAssignedScope(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/update-application-manage-assigned-scope`, {
    method: 'POST',
    data: data,
  });
}

export async function getApplicationScopeIdByApplicationId(id: string) {
  return request(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/get-application-scope-id-by-application-id/${id}`, {
    method: 'GET',
  });
}
