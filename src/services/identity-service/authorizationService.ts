import {findByPage4} from "@/services/api/identity-api/authorizationApi";

export async function getAuthorizationPage(params: APIIdentity.findByPage4Params) {
  return await findByPage4(params);
}

export async function deleteAuthorizationById(id: string) {
  // return await findByPage4(params);
  console.log(id)
  return null;
}
