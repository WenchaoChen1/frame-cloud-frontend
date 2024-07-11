import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteUserManageService,
  getUserManageDetailService,
  getUserManagePageService,
  insertUserManageService,
  updateUserManageService,
  userManageResetPasswordService,
} from '@/services/base-service/system-service/userService';
import { PlusOutlined } from '@ant-design/icons';
import { enumsService } from '@/services/base-service/system-service/commService';
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
import { useAccess, Access } from 'umi';
import { statusConversionType } from '@/utils/utils';
import { FormattedMessage, useModel } from '@umijs/max';
import { useIntl } from "@@/exports";
import { Button, message, Space,Row,Col } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";
import FunctionPermission from '@/pages/base/components/functionPermission/index'

const User: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const currentUserId = initialState?.currentUser?.userId;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [passWordModal, setPassWordModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userID, setUserID] = useState('');
  const [currentRow, setCurrentRow] = useState<APISystem.UserItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.UserItemDataType[]>([]);
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'updatedDate': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

  const getList = async (params: APISystem.UserItemDataType) => {
    if (params?.status?.length > 0) {
      const list = await statusConversionType(params.status, dataItemStatus)
      params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
    }

    const roleResponse = await getUserManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      status: params?.status,
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

  const resetPasswordRequest = async (fields: APISystem.UserItemDataType) => {
    const hide = message.loading('Update');
    try {
      await userManageResetPasswordService(fields);
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

  const onReactPassWord = (record: APISystem.UserItemDataType) => {
    setUserID(record?.userId);
    setPassWordModal(true);
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
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      renderFormItem: () => {
        return <ProFormDigit width="md" name="phoneNumber" placeholder={'Please Enter'} />;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      valueType: 'select',
      valueEnum: dataItemStatus?.reduce((result: any, type: any) => {
        result[type?.value] = {
          text: type?.name,
          status: type?.value,
        };
        return result;
      }, {}),
      renderFormItem: (_, { ...rest }) => 
        <ProFormSelect mode="multiple" {...rest} placeholder={'Please Select'} fieldProps={{mode: 'multiple'}}/>
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
      fixed: 'right',
      render: (_, record:any) => [
        <FunctionPermission code="EditUser">
          <a key="editUser" onClick={() => onEditUser(record)}>
            Edit
          </a>
        </FunctionPermission>,
        <FunctionPermission code="ResetPasswordUser">
          <a key="resetPassword" onClick={() => onReactPassWord(record)}>
            ResetPassword
          </a>
        </FunctionPermission>,
        currentUserId !== record.userId && (
          <FunctionPermission code="DeleteUser">
            <PopconfirmPage
              key="deleteUser"
              onConfirm={async () => {
                await deleteUserRequest(record?.userId || '');
              }}>
              <a>Delete</a>
            </PopconfirmPage>
          </FunctionPermission>
        )
      ],
    },
  ];

  const initType = async () => {
    const response = await enumsService();
    if (response?.success === true) {
      setDataItemStatus(response?.data?.sysDataItemStatus);
    }
  };

  useEffect(() => {
    initType();
  }, []);

  return (
    <PageContainer>
      <ProTable<APISystem.UserItemDataType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        toolBarRender={() => [
          <FunctionPermission code="AddUser">
            <Button
              type="primary"
              onClick={() => {
                setIsEdit(false);
                setOpenModal(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>
          </FunctionPermission>
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
                placeholder={'Please Enter'}
                name="phoneNumber"
                label="Phone Number"
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
                label={'Nick Name'}
                rules={[
                  {
                    required: true,
                    message: 'Nick Name is required',
                  },
                ]}
                name="nickname"
                placeholder={'Nick Name'}
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
                placeholder={'Please Select'}
                name="status"
                label={'Status'}
                request={async () => {
                  return dataItemStatus?.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormTextArea
                name="description"
                label={'Description'}
                placeholder={'Please Enter Description'}
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
                    label: 'Male',
                  },
                  {
                    value: 1,
                    label: 'Female',
                  },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>
      )}

      {passWordModal && (
        <ModalForm
          title={'New'}
          open={passWordModal}
          onOpenChange={setPassWordModal}
          onFinish={async (record) => {
            const response = await resetPasswordRequest(record);

            if (response) {
              setPassWordModal(false);
              actionRef.current?.reloadAndRest?.();
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'User Id is required',
                  },
                ]}
                initialValue={userID}
                disabled
                label={'User Id'}
                name="userId"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'New Password is required',
                  },
                ]}
                label={'New Password'}
                name="newPassword"
                placeholder={'New Password'}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default User;
