import {
  deleteAuthorizationManage,
  getAuthorizationManagePage,
} from "@/services/base-service/api/identity-api/authorizationApi";

export async function getAuthorizationManagePageService(params: any) {
  return await getAuthorizationManagePage(params);
}

export async function deleteAuthorizationManageService(id: string) {
  return await deleteAuthorizationManage(id);
}
