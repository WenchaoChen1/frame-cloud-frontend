import {
  getAuthorizationPage,
  deleteAuthorizationById
} from '@/services/identity-service/authorizationService';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useModel} from '@umijs/max';
import {Button, message, Space} from 'antd';
import React, {useRef, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";

const User: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const currentUserId = initialState?.currentUser?.userId;

  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.UserItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.UserItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const getList = async (params: API.PageParams) => {

    // @ts-ignore
    const response = await getAuthorizationPage({
      pager: {
        pageNumber: params.current || 0,
        pageSize: params.pageSize || 10
      }
    });

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      total = response?.data?.totalElements || 0;
    }
console.log(dataSource)
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
    console.log(Date.now() - Math.floor(Math.random() * 1000),)
    const hide = message.loading('delete...');
    try {
      await deleteAuthorizationById(id);
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
    {title: 'registeredClientId', dataIndex: 'registeredClientId',},
    {title: 'principalName', dataIndex: 'principalName',},
    {title: 'authorizationGrantType', dataIndex: 'authorizationGrantType',},
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
      render: (_, record) => [

        currentUserId !== record.id &&
        <a
          key="deleteUser"
          onClick={async () => {
            await deleteUserRequest(record?.id || '');
          }}
        >
          Delete
        </a>
      ],
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
      />
    </PageContainer>
  );
};

export default User;
