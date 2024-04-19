import { request } from '@umijs/max';

export async function getLoginInfo(data: APISystem.GetAccountInfoBody) {
  return request<{
    data: API.CurrentUser;
  }>('/api/gstdev-system/current-login-information/add-by-token-current-login-information', {
    method: 'POST',
    data: data,
    options: {skipErrorHandler: true}
  });
}
