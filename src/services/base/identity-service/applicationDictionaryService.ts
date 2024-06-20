import {
  getAuthorizationGrantTypes,
} from "@/services/api/identity-api/applicationDictionaryApi";

export async function getAuthorizationGrantTypesService() {
  return await getAuthorizationGrantTypes();
}
