import type { ActionType } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';
import { useRef} from 'react';
import {getUserOnlineAuthorizationService,deleteAuthorizationForceOutService} from '@/services/base-service/identity-service/systemUserService'
import React from 'react';
import dayjs from "dayjs";
import {message, Popconfirm} from 'antd'

function Acount() {
  const actionRef = useRef<ActionType>();
  const reducedTime = (e: any) =>{
    const accessTokenExpiresAt = dayjs(e?.accessTokenExpiresAt).format('YYYY-MM-DD HH:mm:ss')
    const refreshTokenExpiresAt = dayjs(e?.refreshTokenExpiresAt).format('YYYY-MM-DD HH:mm:ss')
    let chooseTime = refreshTokenExpiresAt
    if (accessTokenExpiresAt > refreshTokenExpiresAt || accessTokenExpiresAt === refreshTokenExpiresAt){
      chooseTime = accessTokenExpiresAt
    }
    return chooseTime
  }
  const confirm = async (id:string) =>{
    const res = await deleteAuthorizationForceOutService(id)
    console.log(res)
    if (res.success){
      message.success('operate successfully!')
      actionRef?.current?.reload()
    }
  }
  const columns = [
    {
      title: '登录时间',
      dataIndex: 'accessTokenIssuedAt',
    },
    {
      title: '登录到期时间',
      dataIndex: 'refreshTokenExpiresAt',
      render: (text: any, record: any, ) => reducedTime(record)
    },
    {
      title: 'operation',
      valueType: 'option',
      key: 'option',
      render: (text: any, record: any, ) => [
        <Popconfirm
          title="强制退出?"
          description="是否要强制退出?"
          onConfirm={()=>confirm(record?.id)}
          okText="Yes"
          cancelText="No"
        >
          <a key="editable">
            强制退出
          </a>
        </Popconfirm>
      ],
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
