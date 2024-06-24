import { request } from '@umijs/max';

export async function getAttributeManagePage(params?: APIIdentity.Pager) {
  return request<any>(`${process.env.SYSTEM_SERVICE}/v1/attribute/get-attribute-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function getAttributeManageDetail(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute/get-attribute-manage-detail/${id}`, {
    method: 'GET',
  });
}

export async function updateAttributeManage(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute/update-attribute-manage`, {
    method: 'PUT',
    data: data,
  });
}

export async function updateAttributeManageAssignedPermission(data: APISystem.PermissionItemDataType) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute/update-attribute-manage-assigned-permission`, {
    method: 'POST',
    data: data,
  });
}

export async function getAttributePermissionIdByAttributeId(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/attribute/get-attribute-permission-id-by-attribute-id/${id}`, {
    method: 'GET',
  });
}