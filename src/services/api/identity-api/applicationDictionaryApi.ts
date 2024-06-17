import { request } from '@umijs/max';

export async function getAuthorizationGrantTypes() {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/constant/enums`, {
    method: 'GET',
  });
}
