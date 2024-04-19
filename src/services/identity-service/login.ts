import {oauth2Token, signOut} from "@/services/api/identity-api/oauth2";

export async function oauth2TokenService(params: APIIdentity.Oauth2TokenParamsDataType) {
  return await oauth2Token(params);
}
export async function signOutService(params: APIIdentity.signOutParams) {
  return await signOut(params);
}
