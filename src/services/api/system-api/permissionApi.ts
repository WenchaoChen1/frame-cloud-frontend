import { request } from '@umijs/max';

export async function getPermissionList(
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/get-permission-manage-page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getPermissionType() {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/permissionType`, {
    method: 'GET',
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


export async function deletePermissionById(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/permission/${id}`, {
    method: 'DELETE',
  });
}

