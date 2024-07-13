import { request } from '@umijs/max';

export async function getComplianceManagePage(params: APIIdentity.Pager,) {
  return request<any>(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/compliance/get-compliance-manage-page`, {
    method: 'GET',
    params: params,
  });
}
