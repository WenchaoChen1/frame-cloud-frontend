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

  const getList = async (params: APIIdentity.findByPage4Params) => {
    const response = await getAuthorizationPage(params);

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      total = response?.data?.totalElements || 0;
    }

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
      await deleteAuthorizationById(id);
      hide();
      message.success(  'Deleted successfully and will refresh soon');

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
        // <a
        //   key="editUser"
        //   onClick={async () => await onEditUser(record)}
        // >
        //   Edit
        // </a>,

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

      {/*{selectedRowsState?.length > 0 && (*/}
      {/*  <FooterToolbar*/}
      {/*    extra={*/}
      {/*      <div>*/}
      {/*        <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}*/}
      {/*        <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}*/}
      {/*        <FormattedMessage id="pages.searchTable.item" defaultMessage="Item"/>*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      onClick={async () => {*/}
      {/*        await deleteUserRequest('');*/}
      {/*        setSelectedRows([]);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <FormattedMessage*/}
      {/*        id="pages.searchTable.batchDeletion"*/}
      {/*        defaultMessage="Batch deletion"*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*  </FooterToolbar>*/}
      {/*)}*/}
      {/*{*/}
      {/*  openModal &&*/}
      {/*  <ModalForm*/}
      {/*    title={isEdit ? 'Edit' : 'New'}*/}
      {/*    open={openModal}*/}
      {/*    onOpenChange={setOpenModal}*/}
      {/*    request={async () => {*/}
      {/*      if (isEdit) {*/}
      {/*        const userDetailResponse = await getUserInfoService(currentRow?.id || '');*/}
      {/*        if (userDetailResponse.success === true && userDetailResponse.data) {*/}
      {/*          return userDetailResponse.data;*/}
      {/*        }*/}
      {/*      }*/}
      {/*      return {*/}
      {/*        id: '',*/}
      {/*        username: '',*/}
      {/*        mobile: '',*/}
      {/*        email: '',*/}
      {/*        gender: '',*/}
      {/*      };*/}
      {/*    }}*/}
      {/*    onFinish={async (record) => {*/}
      {/*      let response = undefined;*/}
      {/*      if (isEdit) {*/}
      {/*        response = await editUserRequest(record as APISystem.UserItemDataType);*/}
      {/*      } else {*/}
      {/*        response = await createUserRequest(record as APISystem.UserItemDataType);*/}
      {/*      }*/}

      {/*      if (response) {*/}
      {/*        setOpenModal(false);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Space size={20}>*/}
      {/*      <ProFormText*/}
      {/*        rules={[*/}
      {/*          {*/}
      {/*            required: true,*/}
      {/*            message: "User Name is required",*/}
      {/*          }*/}
      {/*        ]}*/}
      {/*        label={"User Name"}*/}
      {/*        width="md"*/}
      {/*        name="username"*/}
      {/*        placeholder={"User Name"}*/}
      {/*      />*/}

      {/*      <ProFormText*/}
      {/*        rules={[*/}
      {/*          {*/}
      {/*            required: true,*/}
      {/*            message: "Mobile is required",*/}
      {/*          }*/}
      {/*        ]}*/}
      {/*        label={"Mobile"}*/}
      {/*        width="md"*/}
      {/*        name="mobile"*/}
      {/*        placeholder={"Mobile"}*/}
      {/*      />*/}
      {/*    </Space>*/}

      {/*    <Space size={20}>*/}
      {/*      <ProFormText*/}
      {/*        rules={[*/}
      {/*          {*/}
      {/*            required: true,*/}
      {/*            message: "Email is required",*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*        label={"Email"}*/}
      {/*        width="md"*/}
      {/*        name="email"*/}
      {/*        placeholder={"Email"}*/}
      {/*      />*/}

      {/*      <ProFormRadio.Group*/}
      {/*        rules={[*/}
      {/*          {*/}
      {/*            required: true,*/}
      {/*            message: "Gender is required",*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*        initialValue={1}*/}
      {/*        name="gender"*/}
      {/*        label={"Gender"}*/}
      {/*        options={[*/}
      {/*          {*/}
      {/*            value: 0,*/}
      {/*            label: 'male',*/}
      {/*          },*/}
      {/*          {*/}
      {/*            value: 1,*/}
      {/*            label: 'female',*/}
      {/*          },*/}
      {/*        ]}*/}
      {/*      />*/}
      {/*    </Space>*/}

      {/*    <Space size={20}>*/}
      {/*      <ProFormTextArea*/}
      {/*        label={"Description"}*/}
      {/*        name="description"*/}
      {/*        width="md"*/}
      {/*        placeholder={'Please enter description'}*/}
      {/*      />*/}

      {/*      <ProFormText name="id" hidden={true}/>*/}
      {/*    </Space>*/}
      {/*  </ModalForm>*/}
      {/*}*/}

    </PageContainer>
  );
};

export default User;
