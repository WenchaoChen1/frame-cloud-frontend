import {
  getComplianceList,
} from "@/services/api/identity-api/compliance";


export async function getComplianceListService(params?: any) {
  return await getComplianceList(params);
}