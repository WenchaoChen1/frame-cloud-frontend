import {
  getAuthorizationManagePageService,
  deleteAuthorizationManageService
} from '@/services/base-service/identity-service/authorizationService';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import styles from './index.less';

const Authorization: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<APISystem.UserItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: any) => {
    const response = await getAuthorizationManagePageService({
        pageNumber: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
        id: params.id || '',
        principalName: params.principalName || '',
        authorizationGrantType: params.authorizationGrantType || '',
    });

    let dataSource: APISystem.UserItemDataType[] = [];
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

      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  }

  const timeFormat = (timestamp: any) => {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
  };

  const columns: ProColumns<APIIdentity.authorization>[] = [
    {title: 'Client ID', dataIndex: 'id'},
    {title: 'User Name', dataIndex: 'principalName'},
    {title: 'Authentication Mode', dataIndex: 'authorizationGrantType'},
    {
      title: 'accessTokenIssuedAt',
      dataIndex: 'accessTokenIssuedAt',
      search: false,
      render: (text) => timeFormat(text),
    },
    {
      title: 'accessTokenExpiresAt',
      dataIndex: 'accessTokenExpiresAt',
      search: false,
      render: (text) => timeFormat(text),
    },
    {
      title: 'refreshTokenIssuedAt',
      dataIndex: 'refreshTokenIssuedAt',
      search: false,
      render: (text) => timeFormat(text),
    },
    {
      title: 'refreshTokenExpiresAt',
      dataIndex: 'refreshTokenExpiresAt',
      search: false,
      render: (text) => timeFormat(text),
    },
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={async () => await deleteUserRequest(record?.id || '')}
        >
          <a>Delete</a>
        </Popconfirm>
    },
  ];

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        className={styles.Authorization}
        options={false}
        request={getList}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: (currentPageNumber, pageSizeNumber) => {
            setPageSize(pageSizeNumber);
            setCurrentPage(currentPageNumber);
          }
        }}
      />
    </PageContainer>
  );
};

export default Authorization;