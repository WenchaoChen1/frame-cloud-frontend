import {request} from '@umijs/max';

// login get token
export async function oauth2Token(params: APIIdentity.Oauth2TokenParamsDataType) {
  return request<APIIdentity.Oauth2TokenResultDataType>(`${process.env.IDENTITY_SERVICE}y/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic cGFzc3dvcmQtY2xpZW50OjEyMzQ1Ng=='
    },
    params: params,
  }).then((response: any) => {
    return response;
  }).catch(function (error) {
    console.log('/oauth2/token catch error', error);
    return error;
  });
}

/** 注销OAuth2应用 根据接收到的AccessToken,删除后端存储的Token信息,起到注销效果 返回值: 是否成功 PUT /oauth2/sign-out */
export async function signOut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.signOutParams,
  options?: { [key: string]: any },
) {
  return request(`${process.env.IDENTITY_SERVICE}/oauth2/sign-out`, {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
