import {
  getComplianceManagePage,
} from "@/services/base-service/api/identity-api/complianceApi";

export async function getComplianceManagePageService(params?: any) {
  return await getComplianceManagePage(params);
}
