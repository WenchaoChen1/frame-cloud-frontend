import {
  getBusinessPermissionManageTreeService,
  getBusinessPermissionManageDetailService,
  deleteBusinessPermissionManageService,
  insertBusinessPermissionManageService,
  updateBusinessPermissionManageService,
  getRoleManageRoleDetailToListService
} from '@/services/base-service/system-service/businessService';
import { getTenantManageTreeService } from '@/services/base-service/system-service/tenantService';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage} from '@umijs/max';
import { useIntl } from "@@/exports";
import {Button, message, Space, Tree} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const BusinessPermission: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [roleNameText, setRoleNameText] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);

  const openEdit = async (record: APISystem.RoleItemDataType) => {
    setIsEdit(true);
    setCurrentRow(record);
    setOpenModal(true);
  };

  const createRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;
    fields.parentId = currentRow?.parentId;

    try {
      await insertBusinessPermissionManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const updateRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updateBusinessPermissionManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const deleteRoleRequest = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteBusinessPermissionManageService(id);
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

  const onChangeTenant = (getTenantId: string) => {
    setTenantId(getTenantId);
    formRef?.current?.setFieldValue('parentId');
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APISystem.RoleItemDataType>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'description', hideInSearch: true, dataIndex: 'description', width: '600px' },
    { title: 'Sort', hideInSearch: true, dataIndex: 'sort' },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
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
    },
    {
      title: intl.formatMessage({ id: 'application.list.createdDate' }),
      key: 'showTime',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createdDate',
      render:(_,record: any)=> formatDate(record?.createdDate)
    },
    {
      title: intl.formatMessage({ id: 'application.list.updatedDate' }),
      hideInSearch: true,
      dataIndex: 'updatedDate',
      sorter: true,
      render:(_,record: any)=> formatDate(record?.updatedDate)
    },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      width: '220px',
      render: (_, record) => [
        // <a
        //   key="MenuBtn"
        //   onClick={() => {
        //     setCurrentRow(record);
        //     openMenuModal(record);
        //   }}
        // >
        //   Menu
        // </a>,
        <a key="editBtn" onClick={() => openEdit(record)}>
          Edit
        </a>,
        <div key={'Delete'}>
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRoleRequest(record?.id || '');
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </div>
      ],
    }
  ];

  const getList = async (params: APISystem.BusinessTableSearchParams) => {
    const roleResponse = await getBusinessPermissionManageTreeService(params);
    let dataSource: APISystem.RoleItemDataType[] = [];
    if (roleResponse?.success === true) {
      dataSource = roleResponse?.data || [];
    }

    return {
      success: true,
      data: dataSource,
    };
  };

  const getRoleInfoRequest = async () => {
    if (isEdit) {
      const roleDetailResponse = await getBusinessPermissionManageDetailService(currentRow?.id || '');
      if (roleDetailResponse.success === true && roleDetailResponse.data) {
        return roleDetailResponse.data;
      }
    }

    return {
      id: '',
      roleName: '',
      parentId: '',
      code: '',
      sort: 1,
      status: 1,
      description: '',
    };
  };

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantManageTreeService({});
    if (tenantTreeResponse.success && tenantTreeResponse.data) {
      if (tenantTreeResponse.data?.length > 0) {
        setTenantId(tenantTreeResponse.data[0].id || undefined);
      }

      return tenantTreeResponse.data;
    } else {
      setTenantId(undefined);
      return [];
    }
  };

  const getParentRoleTreeRequest = async () => {
    const Response = await getRoleManageRoleDetailToListService({
      tenantId: tenantId,
      tenantName: roleNameText || '',
    });
    if (Response.success && Response.data) {
      return Response.data;
    } else {
      return [];
    }
  };

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

  return (
    <PageContainer>
      {tenantId && (
        <ProTable<APISystem.RoleItemDataType, APISystem.PageParams>
          rowKey="id"
          headerTitle={'List'}
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setIsEdit(false);
                setCurrentRow({ parentId: '0' });
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
      )}

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
              await deleteRoleRequest('');
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
          formRef={formRef}
          onOpenChange={setOpenModal}
          request={getRoleInfoRequest}
          onFinish={async (record: APISystem.RoleItemDataType) => {
            let response = undefined;
            if (isEdit) {
              response = await updateRoleRequest(record);
            } else {
              response = await createRoleRequest(record);
            }

            if (response) {
              setOpenModal(false);
              actionRef.current?.reloadAndRest?.();
            }
          }}
        >
          <ProFormText name="id" hidden={true} />

          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Name is required',
                },
              ]}
              fieldProps={{
                onChange: (changeValues) => setRoleNameText(changeValues?.target?.defaultValue),
              }}
              label={'Name'}
              name="name"
              width="md"
              placeholder={'Name'}
            />

            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Code is required',
                },
              ]}
              label={'Code'}
              name="code"
              width="md"
              placeholder={'Code'}
            />
          </Space>

          <Space size={20}>
            <ProFormTreeSelect
              label={'Tenant'}
              name="tenantId"
              placeholder="Please select"
              allowClear={false}
              width="md"
              secondary
              request={getTenantTreeRequest}
              fieldProps={{
                treeDefaultExpandAll:true,
                onChange: onChangeTenant,
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                popupMatchSelectWidth: false,
                autoClearSearchValue: true,
                treeNodeFilterProp: 'title',
                fieldNames: {
                  label: 'tenantName',
                  value: 'id',
                },
              }}
              rules={[
                {
                  required: true,
                  message: 'Role is required',
                },
              ]}
            />

            <ProFormTreeSelect
              params={tenantId}
              label={'Parent Role'}
              name="parentId"
              placeholder="Please select"
              allowClear={false}
              width="md"
              secondary
              request={getParentRoleTreeRequest}
              fieldProps={{
                treeDefaultExpandAll:true,
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                popupMatchSelectWidth: false,
                autoClearSearchValue: true,
                treeNodeFilterProp: 'title',
                fieldNames: {
                  label: 'roleName',
                  value: 'id',
                },
              }}
            />
          </Space>

          <Space size={20}>
            <ProFormDigit label={'Sort'} name="sort" width="md" placeholder={'Sort'} />

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

          <Space size={20}>
            <ProFormTextArea label={'Description'} name="description" width="md" />
          </Space>
        </ModalForm>
      )}

    </PageContainer>
  );
};

export default BusinessPermission;
