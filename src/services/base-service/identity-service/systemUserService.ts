import {
  getUserOnlineAuthorization
} from "@/services/base-service/api/identity-api/systemUserApi";
export async function getUserOnlineAuthorizationService() {
  return await getUserOnlineAuthorization();
}
