import {request} from '@umijs/max';

export async function getUserManagePage(params: APISystem.PageParams) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/get-user-manage-page`, {
    method: 'GET',
    params: params
  });
}

export async function getUserManageDetail(id: string) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/get-user-manage-detail/${id}`, {
    method: 'GET'
  });
}

export async function updateUserManage(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/update-user-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function insertUserManage(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/insert-user-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function deleteUserManage(id: string) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/delete-user-manage/${id}`, {
    method: 'DELETE'
  });
}

export async function userManageResetPassword(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/security/user-manage-reset-password/${data?.newPassword}/${data?.userId}`, {
    method: 'PUT',
  });
}

export async function getUserSettingsDetail() {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/get-user-settings-detail`, {
    method: 'GET'
  });
}
export async function getAccountSettingsDetail() {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/account/get-account-settings-detail`, {
    method: 'GET'
  });
}
export async function updateAccountSettingsDetail(data:any) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/account/update-account-settings-detail`, {
    method: 'POST',
    data
  });
}
export async function updateUserSettingsDetail(data?: any) {
  return request<Record<string, any>>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/user/update-user-settings-detail`, {
    method: 'POST',
    data: data,
  });
}
export async function resetPassword(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/security/reset-password/${data.originalPassword}/${data.newPassword}`, {
    method: 'put',
  });
}
