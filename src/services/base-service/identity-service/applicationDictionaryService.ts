import {
  getAuthorizationGrantTypes,
} from "@/services/base-service/api/identity-api/applicationDictionaryApi";

export async function getAuthorizationGrantTypesService() {
  return await getAuthorizationGrantTypes();
}
