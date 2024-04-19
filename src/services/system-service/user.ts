import {getLoginInfo} from "@/services/api/system-api/loginApi";

export async function getLoginInfoService(data: APISystem.GetAccountInfoBody) {
  return await getLoginInfo(data);
}
