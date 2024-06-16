import {request} from '@umijs/max';
export async function getUserList(params: APISystem.PageParams) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/get-user-manage-page`, {
    method: 'GET',
    params: {
      pageNumber: params.current,
      pageSize: params.pageSize
    }
  });
}
// User - list - pagination
// export async function getUserList(params: APISystem.PageParams) {
//   return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/get-user-page`, {
//     method: 'GET',
//     params: {
//       pageNumber: params.current,
//       pageSize: params.pageSize
//     }
//   });
// }

export async function getAllUserList() {
  return request<APISystem.AllUserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/get-all-user`, {
    method: 'GET'
  });
}

export async function createUser(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/insert-user-manage`, {
    method: 'POST',
    data: data,
  });
}
export async function insertAndUpdateUserManage(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/insert-and-update-user-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function editUser(data?: any) {
  return request<APISystem.UserResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/user/insert-user-manage-user-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteUser(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/user`, {
    method: 'DELETE',
    params: {id: id}
  });
}

export async function getUserInfo(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/user/get-by-id`, {
    method: 'GET',
    params: {id: id}
  });
}

