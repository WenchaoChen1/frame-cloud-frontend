import {getLoginInfo} from "@/services/api/system-service/loginApi";


export async function getLoginInfoService(data: APISystem.GetAccountInfoBody) {
  return await getLoginInfo(data);
}
