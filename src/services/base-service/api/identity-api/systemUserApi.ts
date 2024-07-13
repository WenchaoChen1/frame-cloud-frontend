import {request} from "@umijs/max";

export async function getUserOnlineAuthorization() {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/authorization/get-user-online-authorization`, {
    method: 'GET',
  });
}
export async function deleteAuthorizationForceOut(id:string) {
  return request<APISystem.UserResponseDataType>(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/authorization/delete-authorization-force-out/${id}`, {
    method: 'DELETE',
  });
}
