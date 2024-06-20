import {request} from '@umijs/max';

export async function getMenuManageTree(params?: any) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-menu-manage-tree`, {
    method: 'GET',
    params: params,
  });
}

export async function insertMenuManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/insert-menu-manage`, {
    method: 'POST',
    data: data,
  });
}

export async function updateMenuManage(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/update-menu-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteMenuManage(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/menu/delete-menu-manage/${id}`, {
    method: 'DELETE'
  });
}
