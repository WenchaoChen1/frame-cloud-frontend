import { request } from '@umijs/max';

export async function getComplianceList(
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/compliance/get-compliance-manage-page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
