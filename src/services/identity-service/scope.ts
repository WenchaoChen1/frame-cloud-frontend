import {
  getAllUserList,
  deleteUser,
  editUser,
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

