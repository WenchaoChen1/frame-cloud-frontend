import {
  getAllUserList,
  deleteUser,
  editUser,
  editPermis,
  getPermis,
} from "@/services/api/identity-api/scope";


export async function getAllUserListService(params?: any) {
  return await getAllUserList(params);
}

export async function editUserService(data?: any) {
  return await editUser(data);
}

export async function deleteUserService(id: string) {
  return await deleteUser(id);
}

export async function editPermisService(data?: any) {
  return await editPermis(data);
}

export async function getPermisService(params?: any) {
  return await getPermis(params);
}