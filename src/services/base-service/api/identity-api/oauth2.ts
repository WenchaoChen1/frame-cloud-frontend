import {request} from '@umijs/max';
import {HEADERS_AUTHORIZATION} from "@/pages/common/constant";

export async function oauth2Token(params: APIIdentity.Oauth2TokenParamsDataType) {
  return request<APIIdentity.Oauth2TokenResultDataType>(`${process.env.IDENTITY_SERVICE}/oauth2/token`, {
    method: 'POST',
    headers: {Authorization: HEADERS_AUTHORIZATION},
    params: params,
  }).then((response: any) => {
    return response;
  }).catch(function (error) {
    return error;
  });
}

export async function oauth2RefreshToken(data: APIIdentity.Oauth2TokenParamsDataType) {
  return request<APIIdentity.Oauth2TokenResultDataType>(`${process.env.IDENTITY_SERVICE}/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: HEADERS_AUTHORIZATION,
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  }).then((response: any) => {
    return response;
  }).catch(function (error) {
    console.log('/oauth2/token catch error', error);
    return error;
  });
}

/** 注销OAuth2应用 根据接收到的AccessToken,删除后端存储的Token信息,起到注销效果 返回值: 是否成功 PUT /oauth2/sign-out */
export async function signOut(data: APIIdentity.signOutParams) {
  return request(`${process.env.IDENTITY_SERVICE}/oauth2/sign-out`, {
    method: 'POST',
    data: data,
  });
}
