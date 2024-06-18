import { request } from '@umijs/max';

export async function getPermissionManagePage(params: APIIdentity.Pager) {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/get-permission-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function insertPermissionManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/permission/insert-permission-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updatePermissionManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/permission/update-permission-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function savePermission(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/permission`, {
    method: 'POST',
    data: data,
  });
}

export async function deletePermissionManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/permission/delete-permission-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function getPermissionManageDetail(id: string) {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/get-permission-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function getPermissionType() {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/permissionType`, {
    method: 'GET',
  });
}