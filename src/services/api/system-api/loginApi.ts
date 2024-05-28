import { request } from '@umijs/max';
import { getRefreshToken } from '@/utils/utils';

export async function getLoginInfo(data: APISystem.GetAccountInfoBody) {
  return request<{
    data: API.CurrentUser;
  }>(`${process.env.SYSTEM_SERVICE}/current-login-information/add-by-token-current-login-information`, {
    method: 'POST',
    data: data,
    options: {skipErrorHandler: true}
  });
}
