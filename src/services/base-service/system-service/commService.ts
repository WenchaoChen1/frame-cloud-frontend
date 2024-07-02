import {
  enums,
} from "@/services/base-service/api/system-api/commApi";

export async function enumsService() {
  return await enums();
}
