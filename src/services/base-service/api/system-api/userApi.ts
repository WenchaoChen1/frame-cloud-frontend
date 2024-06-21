import {request} from '@umijs/max';

export async function getUserManagePage(params: APISystem.PageParams) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/get-user-manage-page`, {
    method: 'GET',
    params: params
  });
}

export async function getUserManageDetail(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/user/get-user-manage-detail/${id}`, {
    method: 'GET'
  });
}

export async function updateUserManage(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/update-user-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function insertUserManage(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/insert-user-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function deleteUserManage(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/user/delete-user-manage/${id}`, {
    method: 'DELETE'
  });
}
