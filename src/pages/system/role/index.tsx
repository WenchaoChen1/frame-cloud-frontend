import {FormattedMessage} from '@umijs/max';
import {Button, message, Space} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PlusOutlined} from '@ant-design/icons';
import {
  deleteRoleService,
  getRoleInfoService,
  getRoleListService,
  insertRoleService,
  updateRoleService,
} from '@/services/system-service/role';
import {getTenantTreeService} from '@/services/system-service/tenant';

const Role: React.FC = () => {
  const [tenantId, setTenantId] = useState<string|undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const openEdit = async (record: APISystem.RoleItemDataType) => {
    setIsEdit(true);

    setCurrentRow(record);
    setOpenModal(true);
  }

  /**
   * @en-US Add node
   * @param fields
   */
  const createRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertRoleService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  /**
   * @en-US Update node
   * @param fields
   */
  const updateRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updateRoleService(fields);
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
      await deleteRoleService(id);
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

  const getRoleTreeRequest = async () => {
    const RoleTreeResponse = await getRoleListService({tenantId: tenantId});
    if (RoleTreeResponse.success && RoleTreeResponse.data) {
      return RoleTreeResponse.data;
    } else {
      return [];
    }
  }

  const onChangeTenant = (tenantId: string) => {
    console.log('onChangeTenantId', tenantId);
    setTenantId(tenantId);
  };

  const columns: ProColumns<APISystem.RoleItemDataType>[] = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
    },
    {
      title: 'Sort',
      hideInSearch: true,
      dataIndex: 'sort',
    },
    {
      title: "Status",
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        0: {
          text: 'Disable',
          status: 'Processing',
        },
        1: {
          text: 'Enable',
          status: 'Success',
        }
      },
    },
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="editBtn"
          onClick={() => openEdit(record)}
        >
          Edit
        </a>,
        <a
          key="deleteBtn"
          onClick={async () => {
            await deleteRoleRequest(record?.id || '');
          }}
        >Delete</a>
      ]
    },
    {
      title: 'Tenant',
      key: 'tenant',
      hideInTable: true,
      dataIndex: 'direction',
      renderFormItem: () => {
        return (
          <ProFormTreeSelect
            name="tenant"
            placeholder="Please select"
            // initialValue={tenantId}
            allowClear={false}
            width={'lg'}
            secondary
            fieldProps={{
              value: tenantId,
              treeData: tenantTreeData,
              onChange: onChangeTenant,
              showArrow: false,
              filterTreeNode: true,
              showSearch: true,
              popupMatchSelectWidth: false,
              autoClearSearchValue: true,
              treeNodeFilterProp: 'title',
              fieldNames: {
                label: 'tenantName',
                value: 'id'
              }
            }}
          />
        );
      },
    }
  ];

  const getList = async (params: APISystem.RoleTableSearchParams) => {
    console.log('getList========', params);

    if (!tenantId) {
      return {
        data: [],
        success: true,
      };
    }

    params.tenantId = tenantId;

    const roleResponse = await getRoleListService(params);

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
      const roleDetailResponse =  await getRoleInfoService(currentRow?.id || '');
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
  }

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantTreeService();
    if (tenantTreeResponse.success && tenantTreeResponse.data) {
      if (tenantTreeResponse.data?.length > 0) {
        setTenantId(tenantTreeResponse.data[0].id || undefined);
      }

      setTenantTreeData(tenantTreeResponse.data);
      return tenantTreeResponse.data;
    } else {
      setTenantId(undefined);
      setTenantTreeData([]);
      return [];
    }
  }

  useEffect(() => {
    getTenantTreeRequest();
  }, [])

  return (
    <PageContainer>
      {
        tenantId &&
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
                setCurrentRow({parentId: '0'});
                setOpenModal(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
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
      }

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
      {
        openModal &&
        <ModalForm
          title={ isEdit ? 'Edit' :  'New'}
          open={openModal}
          onOpenChange={setOpenModal}
          request={getRoleInfoRequest}
          onFinish={async (record: APISystem.RoleItemDataType) => {
            let response = undefined;
            if (isEdit) {
              response = await updateRoleRequest(record as APISystem.RoleItemDataType);
            } else {
              response = await createRoleRequest(record as APISystem.RoleItemDataType);
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
                  message: "Role Name is required",
                }
              ]}
              label={"Role Name"}
              name="roleName"
              width="md"
              placeholder={"Role Name"}
            />

            <ProFormText
              rules={[
                {
                  required: true,
                  message: "Code is required",
                }
              ]}
              label={"Code"}
              name="code"
              width="md"
              placeholder={"Code"}
            />
          </Space>

          <Space size={20}>
            <ProFormTreeSelect
              label={"Parent Role"}
              name="parentId"
              placeholder="Please select"
              allowClear={false}
              width="md"
              secondary
              request={getRoleTreeRequest}
              fieldProps={{
                onChange: onChangeTenant,
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                popupMatchSelectWidth: false,
                autoClearSearchValue: true,
                treeNodeFilterProp: 'title',
                fieldNames: {
                  label: 'roleName',
                  value: 'id'
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Role is required"
                }
              ]}
            />

            <ProFormDigit
              label={"Sort"}
              name="sort"
              width="md"
              placeholder={"Sort"}
            />
          </Space>

          <Space size={20}>
            <ProFormTextArea label={"Description"} name="description" width="md" />
            <ProFormRadio.Group
              rules={[
                {
                  required: true,
                  message: "Status is required"
                }
              ]}
              initialValue={1}
              name="status"
              label={"Status"}
              options={[
                {
                  value: 0,
                  label: 'Disable',
                },
                {
                  value: 1,
                  label: 'Enable',
                }
              ]}
            />
          </Space>
        </ModalForm>
      }
    </PageContainer>
  );
};

export default Role;
