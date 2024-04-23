import {request} from '@umijs/max';

// menu - list
export async function getMenuTree(
  params?: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-all-menu-to-tree`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function createMenu(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu`, {
    method: 'POST',
    data: data,
  });
}

export async function editMenu(data?: any) {
  return request<APISystem.TenantListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteMenu(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/menu`, {
    method: 'DELETE',
    params: {
      id: id,
    },
  });
}

export async function moveMenu(data: APISystem.moveMenuDataType) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/menu/move`, {
    method: 'PUT',
    data: data
  });
}
