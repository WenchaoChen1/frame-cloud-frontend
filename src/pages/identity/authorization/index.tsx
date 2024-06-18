import {
  getAuthorizationPage,
  deleteAuthorizationByIdService
} from '@/services/identity-service/authorizationService';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useModel} from '@umijs/max';
import { message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import styles from './index.less';

const Authorization: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const currentUserId = initialState?.currentUser?.userId;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<APISystem.UserItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: API.PageParams) => {
    const response = await getAuthorizationPage({
        pageNumber: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE
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
      await deleteAuthorizationByIdService(id);
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
    {title: 'Client ID', dataIndex: 'registeredClientId'},
    {title: 'User Name', dataIndex: 'principalName'},
    {title: 'Authentication Mode', dataIndex: 'authorizationGrantType'},
    {
      title: 'accessTokenIssuedAt',
      dataIndex: 'accessTokenIssuedAt',
      render: (text) => timeFormat(text),
    },
    {
      title: 'accessTokenExpiresAt',
      dataIndex: 'accessTokenExpiresAt',
      render: (text) => timeFormat(text),
    },
    {
      title: 'refreshTokenIssuedAt',
      dataIndex: 'refreshTokenIssuedAt',
      render: (text) => timeFormat(text),
    },
    {
      title: 'refreshTokenExpiresAt',
      dataIndex: 'refreshTokenExpiresAt',
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
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     onClick={() => {
        //       // setIsEdit(false);
        //       setOpenModal(true);
        //     }}
        //   >
        //     <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
        //   </Button>,
        // ]}
        request={getList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          // showTotal: () => '',
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
