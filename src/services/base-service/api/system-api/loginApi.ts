import { request } from '@umijs/max';

export async function getLoginInfo(data: APISystem.GetAccountInfoBody) {
  return request<{data: API.CurrentUser}>(`${process.env.SYSTEM_SERVICE}/v1/security/get-account-current-login-information`, {
    method: 'GET',
    data: data,
    options: {skipErrorHandler: true}
  });
}

export async function updateAccountCurrentLoginInformation(data: APISystem.GetAccountInfoBody) {
  return request<{data: API.CurrentUser}>(`${process.env.SYSTEM_SERVICE}/v1/security/update-account-current-login-information`, {
    method: 'PUT',
    data: data,
    options: {skipErrorHandler: true}
  });
}
