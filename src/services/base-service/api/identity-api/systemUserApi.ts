import {request} from "@umijs/max";

export async function getUserOnlineAuthorization() {
  return request<APISystem.UserResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/authorization/get-user-online-authorization`, {
    method: 'GET',
  });
}