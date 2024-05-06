// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import {deleteAuthorizationByIdService} from "@/services/identity-service/authorizationService";

/** 分页查询数据 通过pageNumber和pageSize获取分页数据 返回值: 单位列表 GET /authorize/authorization */
export async function findByPage4(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: APIIdentity.Pager,
  options?: { [key: string]: any },
) {
  return request<any>(`${process.env.IDENTITY_SERVICE}/authorize/authorization`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function deleteAuthorizationById(id: string) {
  return request<APISystem.OrganizeListResponseDataType>(`${process.env.IDENTITY_SERVICE}/authorize/authorization/${id}`, {
    method: 'DELETE',
  });
}


// /** 保存或更新数据 接收JSON数据，转换为实体，进行保存或更新 返回值: 已保存数据 POST /authorize/authorization */
// export async function saveOrUpdate4(
//   // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
//   params: APIIdentity.saveOrUpdate4Params,
//   body: APIIdentity.HerodotusAuthorization,
//   options?: { [key: string]: any },
// ) {
//   return request<{ id?: number }>(`${process.env.IDENTITY_SERVICE}/authorize/authorization`, {
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
// /** 删除数据 根据实体ID删除数据，以及相关联的关联数据 返回值: 操作消息 DELETE /authorize/authorization/${param0} */
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
//     `${process.env.IDENTITY_SERVICE}/authorize/authorization/${param0}`,
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
