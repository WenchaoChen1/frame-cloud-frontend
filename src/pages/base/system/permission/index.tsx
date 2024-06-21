import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deletePermissionManageService,
  getPermissionManageDetailService,
  getPermissionManagePageService,
  getPermissionTypeService,
  insertPermissionManageService,
  updatePermissionManageService,
} from '@/services/base-service/system-service/permissionService';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const User: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.PermissionItemDataType>();
  const [permissionTypeList, setPermissionTypeList] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const actionRef = useRef<ActionType>();

  const getList = async (params: API.PageParams) => {
    params.status = params?.status?.map((item: any) => {
      if (item === '1') {
        return (item = 'FORBIDDEN');
      } else if (item === '2') {
        return (item = 'LOCKING');
      } else if (item === '3') {
        return (item = 'EXPIRED');
      } else {
        return (item = 'ENABLE');
      }
    });
    const response = await getPermissionManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      permissionType:
        params?.permissionType?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      status: params?.status?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      permissionName: params?.permissionName || '',
      permissionCode: params?.permissionCode || '',
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

  const initPermissionTypeChange = async () => {
    const response = await getPermissionTypeService();
    if (response?.success === true) {
      setPermissionTypeList(response?.data);
    }
  };

  useEffect(() => {
    initPermissionTypeChange();
  }, []);

  const getPermissionInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getPermissionManageDetailService(
        currentRow?.permissionId || '',
      );
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      permissionId: '',
      permissionCode: '',
      permissionType: '',
      permissionName: '',
      status: '',
    };
  };

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertPermissionManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updatePermissionManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const onDeleteRequest = async (id: string) => {
    const hide = message.loading('delete...');

    try {
      await deletePermissionManageService(id);
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

  const columns: ProColumns<APISystem.PermissionItemDataType>[] = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      hideInSearch: false,
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      hideInSearch: false,
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      hideInForm: true,
      valueEnum: permissionTypeList.reduce((result, type) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
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
      title: 'Status',
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
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
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
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="EditBtn"
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            setOpenModal(true);
          }}
        >
          Edit
        </a>,
        <Popconfirm
          title="Sure to delete?"
          onConfirm={async () => await onDeleteRequest(record?.permissionId || '')}
        >
          <a>Delete</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.PermissionItemDataType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.permission}
        rowKey="permissionId"
        options={false}
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

      {openModal && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={openModal}
          onOpenChange={setOpenModal}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType);
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType);
            }
            console.log('onFinish response', response);

            if (response) {
              setOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          request={getPermissionInfoRequest}
        >
          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Permission name is required',
                },
              ]}
              label={'Permission Name'}
              width="md"
              name="permissionName"
              placeholder={'Permission name'}
            />
            <ProFormText
              name="permissionCode"
              label={'Code'}
              width="md"
              placeholder={'Code'}
              rules={[
                {
                  required: true,
                  message: 'Code is required',
                },
              ]}
            />

            <ProFormText label={'permissionId'} width="md" name="permissionId" hidden={true} />
          </Space>

          <Space size={20}>
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: 'Permission Type is required',
                },
              ]}
              label={'Permission Type'}
              width="md"
              name="permissionType"
              placeholder={'Permission Type'}
              options={permissionTypeList}
            />
            <ProFormSelect
              width="md"
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
          </Space>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default User;
