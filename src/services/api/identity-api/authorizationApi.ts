import { request } from '@umijs/max';
import {deleteAuthorizationByIdService} from "@/services/identity-service/authorizationService";

export async function getAuthorizationManagePage(params: APIIdentity.Pager) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/v1/authorize/authorization/get-authorization-manage-page`, {
    method: 'GET',
    params: params,
  });
}

export async function deleteAuthorizationManage(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/v1/authorize/authorization/delete-authorization-manage/${id}`, {
    method: 'DELETE',
  });
}


// /** 保存或更新数据 接收JSON数据，转换为实体，进行保存或更新 返回值: 已保存数据 POST /v1/authorize/authorization */
// export async function saveOrUpdate4(
//   // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
//   params: APIIdentity.saveOrUpdate4Params,
//   body: APIIdentity.HerodotusAuthorization,
//   options?: { [key: string]: any },
// ) {
//   return request<{ id?: number }>(`${process.env.IDENTITY_SERVICE}/v1/authorize/authorization`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     params: {
//       ...params,
//     },
//     data: body,
//     ...(options || {}),
//   });
// }
//
// /** 删除数据 根据实体ID删除数据，以及相关联的关联数据 返回值: 操作消息 DELETE /v1/authorize/authorization/${param0} */
// export async function delete5(
//   // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
//   params: APIIdentity.delete5Params,
//   body: {
//     id?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   const { id: param0, ...queryParams } = params;
//   return request<{ id?: number }>(
//     `${process.env.IDENTITY_SERVICE}/v1/authorize/authorization/${param0}`,
//     {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       params: { ...queryParams },
//       data: body,
//       ...(options || {}),
//     },
//   );
// }
