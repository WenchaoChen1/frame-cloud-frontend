import {oauth2RefreshToken, oauth2Token, signOut} from "@/services/base-service/api/identity-api/oauth2";

export async function oauth2TokenService(params: APIIdentity.Oauth2TokenParamsDataType) {
  return await oauth2Token(params);
}

export async function oauth2RefreshTokenService(data: APIIdentity.Oauth2TokenParamsDataType) {
  return await oauth2RefreshToken(data);
}

export async function signOutService(data: APIIdentity.signOutParams) {
  return await signOut(data);
}
