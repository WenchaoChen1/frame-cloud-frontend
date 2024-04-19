import {
  createAccount,
  deleteAccount,
  editAccount,
  getAccountInfo,
  getAccountList,
  getAccountListInLogin,
} from '@/services/api/system-api/accountApi';

// Account - list
export async function getAccountListService(params: API.PageParams) {
  return await getAccountList(params);
}

export async function createAccountService(data?: any) {
  return await createAccount(data);
}

export async function editAccountService(data?: any) {
  return await editAccount(data);
}

export async function deleteAccountService(id: string) {
  return await deleteAccount(id);
}

export async function getAccountInfoService(id: string) {
  return await getAccountInfo(id);
}

export async function getAccountListInLoginService() {
  return await getAccountListInLogin();
}
