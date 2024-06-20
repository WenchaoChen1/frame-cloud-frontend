import {
  deleteAuthorizationManage, 
  getAuthorizationManagePage,
} from "@/services/api/identity-api/authorizationApi";

export async function getAuthorizationManagePageService(params: APIIdentity.Pager) {
  return await getAuthorizationManagePage(params);
}

export async function deleteAuthorizationManageService(id: string) {
  return await deleteAuthorizationManage(id);
}
