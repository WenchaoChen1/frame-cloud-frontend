import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteUserManageService,
  getUserManageDetailService,
  getUserManagePageService,
  insertUserManageService,
  updateUserManageService,
} from '@/services/base-service/system-service/userService';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useModel } from '@umijs/max';
import { useIntl } from "@@/exports";
import { Button, message, Space,Row,Col } from 'antd';
import React, { useRef, useState } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const User: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const currentUserId = initialState?.currentUser?.userId;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.UserItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.UserItemDataType[]>([]);

  const getList = async (params: APISystem.UserItemDataType) => {
    params.status = params?.status?.map((item: any) => {
      if (item === '1') {
        return 'FORBIDDEN';
      } else if (item === '2') {
        return 'LOCKING';
      } else if (item === '3') {
        return'EXPIRED';
      } else {
        return 'ENABLE';
      }
    });

    const roleResponse = await getUserManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      status: params?.status?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      username: params?.username || '',
      phoneNumber: params?.phoneNumber || '',
      email: params?.email || '',
    });

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (roleResponse?.success === true) {
      dataSource = roleResponse?.data?.content || [];
      total = roleResponse?.data?.totalElements || 0;
    }

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  const createUserRequest = async (fields: APISystem.UserItemDataType) => {
    const hide = message.loading('add');
    delete fields.userId;

    try {
      await insertUserManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const editUserRequest = async (fields: APISystem.UserItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updateUserManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const deleteUserRequest = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteUserManageService(id);
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
  };

  const onEditUser = (record: APISystem.UserItemDataType) => {
    setIsEdit(true);
    setOpenModal(true);

    setCurrentRow(record);
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APISystem.UserItemDataType>[] = [
    {
      title: 'User Name',
      dataIndex: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'PhoneNumber',
      dataIndex: 'phoneNumber',
      renderFormItem: () => {
        return <ProFormDigit width="md" name="phoneNumber" />;
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '启用',
          status: 'ENABLE',
        },
        1: {
          text: '禁用',
          status: 'FORBIDDEN',
        },
        2: {
          text: '锁定',
          status: 'LOCKING',
        },
        3: {
          text: '过期',
          status: 'EXPIRED',
        },
      },
      renderFormItem: (_, { ...rest }) => {
        return (
          <ProFormSelect
            mode="multiple"
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      valueType: 'textarea',
      search: false,
    },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record:any) => [
        <a key="editUser" onClick={() => onEditUser(record)}>
          Edit
        </a>,


        currentUserId !== record.userId && (
          <PopconfirmPage
            onConfirm={async () => {
              await deleteUserRequest(record?.userId || '');
            }}>
            <a key="deleteUser">Delete</a>
          </PopconfirmPage>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.UserItemDataType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setIsEdit(false);
              setOpenModal(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getList}
        columns={columns}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="Item" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              await deleteUserRequest('');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
      {openModal && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          open={openModal}
          onOpenChange={setOpenModal}
          request={async () => {
            if (isEdit) {
              const userDetailResponse = await getUserManageDetailService(currentRow?.userId || '');
              if (userDetailResponse.success === true && userDetailResponse.data) {
                return userDetailResponse.data;
              }
            }
            return {
              userId: '',
              username: '',
              phoneNumber: '',
              email: '',
              gender: '',
            };
          }}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await editUserRequest(record as APISystem.UserItemDataType);
            } else {
              response = await createUserRequest(record as APISystem.UserItemDataType);
            }

            if (response) {
              setOpenModal(false);
              actionRef.current?.reloadAndRest?.();
            }
          }}
        >
          <Space size={20}>
            <ProFormText name="userId" hidden={true} />
          </Space>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'User Name is required',
                  },
                ]}
                label={'User Name'}
                name="username"
                placeholder={'User Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormDigit
                rules={[
                  {
                    required: true,
                    message: 'Phone Number is required',
                  },
                ]}
                name="phoneNumber"
                label="PhoneNumber"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'First Name is required',
                  },
                ]}
                label={'First Name'}
                name="firstName"
                placeholder={'First Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Last Name is required',
                  },
                ]}
                label={'Last Name'}
                name="lastName"
                placeholder={'Last Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Email is required',
                  },
                ]}
                label={'Email'}
                name="email"
                placeholder={'Email'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={'Avatar'}
                name="avatar"
                rules={[
                  {
                    required: true,
                    message: 'Avatar is required',
                  },
                ]}
                placeholder={'Avatar'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={'Nickname'}
                rules={[
                  {
                    required: true,
                    message: 'Nickname is required',
                  },
                ]}
                name="nickname"
                placeholder={'Nickname'}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'Status is required',
                  },
                ]}
                name="status"
                label={'Status'}
                options={[
                  {
                    label: '启用',
                    value: 0,
                  },
                  {
                    label: '禁用',
                    value: 1,
                  },
                  {
                    label: '锁定',
                    value: 2,
                  },
                  {
                    label: '过期',
                    value: 3,
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormTextArea
                name="description"
                label={'Description'}
                placeholder={'Please enter description'}
              />
            </Col>
            <Col span={12}>
              <ProFormRadio.Group
                rules={[
                  {
                    required: true,
                    message: 'Gender is required',
                  },
                ]}
                initialValue={1}
                name="gender"
                label={'Gender'}
                options={[
                  {
                    value: 0,
                    label: 'male',
                  },
                  {
                    value: 1,
                    label: 'female',
                  },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default User;
