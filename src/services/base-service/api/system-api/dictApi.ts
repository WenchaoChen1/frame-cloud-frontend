import { request } from '@umijs/max';
import {Key} from "react";

// dict - list
export async function getDictTree(tenantId: string) {
  return request<APISystem.DictListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/dict/get-all-dict-to-tree`, {
    method: 'GET',
    params: {tenantId: tenantId}
  });
}

export async function createDict(data?: any) {
  return request<APISystem.DictListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/dict`, {
    method: 'POST',
    data: data,
  });
}

export async function editDict(data?: any) {
  return request<APISystem.DictListResponseDataType>(`${process.env.SYSTEM_SERVICE}/v1/dict`, {
    method: 'PUT',
    data: data,
  });
}

export async function deleteDict(id: string) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/dict/delete`, {
    method: 'DELETE',
    params: {id: id}
  });
}

export async function getDictInfo(id: Key) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/dict/get-by-id`, {
    method: 'GET',
    params: {id: id}
  });
}

export async function batchDeleteDict(params: any) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/dict`, {
    method: 'DELETE',
    params: params
  });
}

export async function moveDict(data: APISystem.moveMenuDataType) {
  return request<Record<string, any>>(`${process.env.SYSTEM_SERVICE}/v1/dict/move`, {
    method: 'PUT',
    data: data
  });
}
