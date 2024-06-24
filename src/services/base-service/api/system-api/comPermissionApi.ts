import { request } from '@umijs/max';

export async function getPermissionManagePage(params: APIIdentity.Pager) {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/get-permission-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function getPermissionType() {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/permission/get-all-distinct-permission-type`, {
    method: 'GET',
  });
}
