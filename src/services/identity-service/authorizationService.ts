import {deleteAuthorizationById, findByPage4} from "@/services/api/identity-api/authorizationApi";

export async function getAuthorizationPage(params: APIIdentity.Pager) {
  return await findByPage4(params);
}

export async function deleteAuthorizationByIdService(id: string) {
  return await deleteAuthorizationById(id);
}
