import { request } from '@umijs/max';

export async function getAllUserList(
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/get-scope-manage-page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function editUser(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/insert-scope-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function deleteUser(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/delete-scope-manage/${id}`, {
    method: 'DELETE',
  });
}

export async function editPermis(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/scope-manage-assigned-permission`, {
    method: 'POST',
    data: data,
  });
}

export async function getPermis(params: APIIdentity.Pager,) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/get-by-id`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
