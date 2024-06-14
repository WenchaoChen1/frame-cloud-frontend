import {
  getComplianceList,
  addApplication,
  getAuthorizationGrantTypes,
  deleteApplication,
  editPermis,
} from "@/services/api/identity-api/application";


export async function getComplianceListService(params?: any) {
  return await getComplianceList(params);
}

export async function addApplicationService(data?: any) {
  return await addApplication(data);
}

export async function getAuthorizationGrantTypesService(params?: any) {
  return await getAuthorizationGrantTypes(params);
}

export async function deleteApplicationService(id: string) {
  return await deleteApplication(id);
}

export async function editPermisService(data?: any) {
  return await editPermis(data);
}