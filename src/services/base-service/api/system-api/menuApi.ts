import {request} from '@umijs/max';

export async function getMenuManageTree(params?: any) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-menu-manage-tree`, {
    method: 'GET',
    params: params,
  });
}

export async function getMenuManageDetail(id?: any) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-menu-manage-detail/${id}`, {
    method: 'GET'
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

export async function getTenantManageMenuTree(tenantId: string) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/menu/get-tenant-manage-menu-tree`, {
    method: 'GET',
    params: {
      tenantId: tenantId
    }
  });
}

export async function updateMenuAssignedAttribute(data?: any) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute-menu/update-menu-assigned-attribute`, {
    method: 'POST',
    data: data,
  });
}

export async function getMenuManageAttributePage(data?: any) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute/get-menu-manage-attribute-page`, {
    method: 'GET',
    params: data
  });
}

export async function getAllAttributeIdByMenuId(attributeId: string) {
  return request<APISystem.MenuListDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute-menu/get-all-attribute-id-by-menu-id/${attributeId}`, {
    method: 'GET',
  });
}