import {getLoginInfo} from "@/services/api/system-api/loginApi";
import {
  createUser,
  deleteUser,
  editUser,
  getAllUserList,
  getUserInfo,
  getUserList
} from "@/services/api/system-api/userApi";

export async function getLoginInfoService(data: APISystem.GetAccountInfoBody) {
  return await getLoginInfo(data);
}

// User - list
export async function getUserListService(params: API.PageParams) {
  return await getUserList(params);
}

export async function getAllUserListService() {
  return await getAllUserList();
}

export async function createUserService(data?: any) {
  return await createUser(data);
}

export async function editUserService(data?: any) {
  return await editUser(data);
}

export async function deleteUserService(id: string) {
  return await deleteUser(id);
}

export async function getUserInfoService(id: string) {
  return await getUserInfo(id);
}
