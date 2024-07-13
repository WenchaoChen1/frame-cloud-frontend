import { request } from '@umijs/max';

export async function getAuthorizationManagePage(params: APIIdentity.Pager) {
  return request<any>(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/authorization/get-authorization-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function deleteAuthorizationManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/authorization/delete-authorization-manage/${id}`, {
    method: 'DELETE',
  });
}
