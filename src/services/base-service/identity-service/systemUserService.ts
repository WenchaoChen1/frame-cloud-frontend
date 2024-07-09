import {
  getUserOnlineAuthorization,
  deleteAuthorizationForceOut
} from "@/services/base-service/api/identity-api/systemUserApi";
export async function getUserOnlineAuthorizationService() {
  return await getUserOnlineAuthorization();
}
export async function deleteAuthorizationForceOutService(id:string) {
  return await deleteAuthorizationForceOut(id);
}
