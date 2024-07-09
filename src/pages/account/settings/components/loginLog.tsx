import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';
import {useEffect, useRef, useState} from 'react';
import {getUserOnlineAuthorizationService} from '@/services/base-service/identity-service/systemUserService'
import React from 'react';


function Acount() {
  const actionRef = useRef<ActionType>();
  const columns = [
    {
      dataIndex: 'accessTokenExpiresAt',
      title: '令牌到期时间',
    },
    {
      title: '令牌生成时间',
      dataIndex: 'accessTokenIssuedAt',
    },
    {
      title: '授权类型',
      dataIndex: 'authorizationGrantType',
    },
    {
      title: '令牌刷新过期时间',
      dataIndex: 'refreshTokenExpiresAt',
    },
    {
      title: '令牌刷新生成时间',
      dataIndex: 'refreshTokenIssuedAt',
    },
  ];
  const getTableDatas = async () =>{
    let data = []
    const res = await getUserOnlineAuthorizationService()
    if (res.success){
      data = res.data
    }
    return {
      data,
      success: true,
    }
  }
  return (
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={getTableDatas}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
      />
  );
}

export default Acount;
