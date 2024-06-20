import {
  getComplianceManagePage,
} from "@/services/api/identity-api/complianceApi";


export async function getComplianceManagePageService(params?: any) {
  return await getComplianceManagePage(params);
}