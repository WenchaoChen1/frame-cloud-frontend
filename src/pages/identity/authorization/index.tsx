import {
  getAuthorizationPage,
  deleteAuthorizationByIdService
} from '@/services/identity-service/authorizationService';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useModel} from '@umijs/max';
import {Button, message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";

const User: React.FC = () => {
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

  // /**
  //  * @en-US Add node
  //  * @param fields
  //  */
  // const createUserRequest = async (fields: APISystem.UserItemDataType) => {
  //   const hide = message.loading('add');
  //   delete fields.id;
  //
  //   try {
  //     await createUserService({...fields});
  //     hide();
  //     message.success('Added successfully');
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('Adding failed, please try again!');
  //     return false;
  //   }
  // };
  //
  // /**
  //  * @en-US Update node
  //  * @param fields
  //  */
  // const editUserRequest = async (fields: APISystem.UserItemDataType) => {
  //   const hide = message.loading('Update');
  //   try {
  //     await editUserService(fields);
  //     hide();
  //
  //     message.success('Update successfully');
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('Update failed, please try again!');
  //     return false;
  //   }
  // };

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

  // const onEditUser = (record: APISystem.UserItemDataType) => {
  //   setIsEdit(true);
  //   setOpenModal(true);
  //
  //   setCurrentRow(record);
  // }
//   { title: 'registeredClientId', dataIndex: 'registeredClientId', align: 'center', label: '客户端ID' },
//   { title: 'principalName', dataIndex: 'principalName', align: 'center', label: '用户名' },
//   { title: 'authorizationGrantType', dataIndex: 'authorizationGrantType', align: 'center', label: '认证模式' },
//   {
//     title: 'accessTokenIssuedAt',
//       dataIndex: 'accessTokenIssuedAt',
//     align: 'center',
//     label: '访问Token颁发时间',
//     format: value => dateFormat(value)
//   },
//   {
//     title: 'accessTokenExpiresAt',
//       dataIndex: 'accessTokenExpiresAt',
//     align: 'center',
//     label: '访问Token过期时间',
//     format: value => dateFormat(value)
//   },
//   {
//     title: 'refreshTokenIssuedAt',
//       dataIndex: 'refreshTokenIssuedAt',
//     align: 'center',
//     label: '刷新Token颁发时间',
//     format: value => dateFormat(value)
//   },
//   {
//     title: 'refreshTokenExpiresAt',
//       dataIndex: 'refreshTokenExpiresAt',
//     align: 'center',
//     label: '刷新Token过期时间',
//     format: value => dateFormat(value)
//   },
//   { title: 'actions', dataIndex: 'actions', align: 'center', label: '操作' }
// ];

  const columns: ProColumns<APIIdentity.authorization>[] = [
    {title: 'registered', dataIndex: 'registeredClientId'},
    {title: 'principal', dataIndex: 'principalName'},
    {title: 'auth', dataIndex: 'authorizationGrantType'},
    {
      title: 'accessTokenIssuedAt',
      dataIndex: 'accessTokenIssuedAt',
    },
    {
      title: 'accessTokenExpiresAt',
      dataIndex: 'accessTokenExpiresAt',
    },
    {
      title: 'refreshTokenIssuedAt',
      dataIndex: 'refreshTokenIssuedAt',
    },
    {
      title: 'refreshTokenExpiresAt',
      dataIndex: 'refreshTokenExpiresAt',
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
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // setIsEdit(false);
              setOpenModal(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}
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

export default User;
