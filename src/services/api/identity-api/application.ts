import { request } from '@umijs/max';

export async function getApplicationList(
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/authorize/application`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addApplication(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/authorize/application`, {
    method: 'POST',
    data: data,
  });
}

export async function getAuthorizationGrantTypes() {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/authorize/constant/enums`, {
    method: 'GET',
    // params: {
    //   ...params,
    // },
  });
}

export async function deleteUser(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/authorize/scope/${id}`, {
    method: 'DELETE',
  });
}

export async function editPermis(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/authorize/scope/assigned`, {
    method: 'POST',
    data: data,
  });
}
