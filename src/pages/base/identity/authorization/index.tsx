import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteAuthorizationManageService,
  getAuthorizationManagePageService,
} from '@/services/base-service/identity-service/authorizationService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import {useIntl} from "@@/exports";
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const Authorization: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'createdDate': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

  const getList = async (params: APIIdentity.authorization) => {
    const response = await getAuthorizationManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      id: params?.id || '',
      principalName: params.principalName || '',
      authorizationGrantType: params.authorizationGrantType || '',
    });

    let dataSource: APIIdentity.authorization[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      total = response?.data?.totalElements || 0;
    }

    setTotal(total);

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  const deleteUserRequest = async (id: string) => {
    const hide = message.loading('delete...');

    try {
      await deleteAuthorizationManageService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');
      actionRef.current?.reloadAndRest?.();
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APIIdentity.authorization>[] = [
    { title: 'Client ID', dataIndex: 'id',ellipsis: true },
    { title: 'User Name', dataIndex: 'principalName' },
    { title: 'Authentication Mode', dataIndex: 'authorizationGrantType' },
    {
      title: 'accessTokenIssuedAt',
      dataIndex: 'accessTokenIssuedAt',
      search: false,
      ellipsis: true,
    },
    {
      title: 'accessTokenExpiresAt',
      dataIndex: 'accessTokenExpiresAt',
      search: false,
      ellipsis: true,
    },
    {
      title: 'refreshTokenIssuedAt',
      dataIndex: 'refreshTokenIssuedAt',
      search: false,
      ellipsis: true,
    },
    {
      title: 'refreshTokenExpiresAt',
      dataIndex: 'refreshTokenExpiresAt',
      search: false,
      ellipsis: true,
    },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true,ellipsis: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true,ellipsis: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <PopconfirmPage onConfirm={async () => await deleteUserRequest(record?.id || '')}>
          <a>Delete</a>
        </PopconfirmPage>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        rowKey="id"
        request={getList}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: (currentPageNumber, pageSizeNumber) => {
            setPageSize(pageSizeNumber);
            setCurrentPage(currentPageNumber);
          },
        }}
      />
    </PageContainer>
  );
};

export default Authorization;
