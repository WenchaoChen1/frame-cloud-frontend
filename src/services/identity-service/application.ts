import {
  getApplicationList,
  addApplication,
  getAuthorizationGrantTypes,
  deleteUser,
  editPermis,
} from "@/services/api/identity-api/application";


export async function getApplicationListService(params?: any) {
  return await getApplicationList(params);
}

export async function addApplicationService(data?: any) {
  return await addApplication(data);
}

export async function getAuthorizationGrantTypesService(params?: any) {
  return await getAuthorizationGrantTypes(params);
}

export async function deleteUserService(id: string) {
  return await deleteUser(id);
}

export async function editPermisService(data?: any) {
  return await editPermis(data);
}