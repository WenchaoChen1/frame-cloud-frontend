import { request } from '@umijs/max';

export async function getPermissionManagePage(params: any) {
  return request(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/get-permission-manage-page`, {
    method: 'POST',
    data: params,
  });
}

export async function insertPermissionManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/insert-permission-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updatePermissionManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/update-permission-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function savePermission(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission`, {
    method: 'POST',
    data: data,
  });
}

export async function deletePermissionManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/delete-permission-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function getPermissionManageDetail(id: string) {
  return request<any>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/get-permission-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function getPermissionType() {
  return request<any>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/permission/get-all-distinct-permission-type`, {
    method: 'GET',
  });
}
