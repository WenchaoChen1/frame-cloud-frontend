import { request } from '@umijs/max';

export async function getComplianceList(
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/compliance`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addApplication(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application`, {
    method: 'POST',
    data: data,
  });
}

export async function getAuthorizationGrantTypes() {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/constant/enums`, {
    method: 'GET',
    // params: {
    //   ...params,
    // },
  });
}

export async function deleteApplication(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/application/${id}`, {
    method: 'DELETE',
  });
}

export async function editPermis(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/scope/assigned`, {
    method: 'POST',
    data: data,
  });
}
