import {
  deleteRoleManageService,
  getRoleManageTenantMenuTreeService,
  getAllTenantMenuIdByRoleIdService,
  getRoleManageDetailService,
  getRoleManageRoleDetailToListService,
  getRoleManageTreeService,
  insertRoleManageService,
  updateRoleAssignedTenantMenuService,
  updateRoleManageService,
  updateRoleAssignedBusinessPermissionService,
} from '@/services/base-service/system-service/roleService';
import BusinessPermission from './businessPermission/index';
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
import {Button, message, Tree, Row, Col} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const Role: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [roleNameText, setRoleNameText] = useState('');
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [OpenbusinessModal, setOpenbusinessModal] = useState(false);
  const [selectedBusinesPermissions, setSelectedBusinesPermissions] = useState([]);
  const [roleId, setRoleId] = useState('');

  const openEdit = async (record: APISystem.RoleItemDataType) => {
    setIsEdit(true);
    setCurrentRow(record);
    setOpenModal(true);
  };

  const createRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('add');
    delete fields.roleId;
    fields.parentId = currentRow?.parentId;

    try {
      await insertRoleManageService({ ...fields });
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
      await updateRoleManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const openMenuModal = async (record?: any) => {
    const allMenuResponse = await getRoleManageTenantMenuTreeService(record?.tenantId);
    if (allMenuResponse.success === true) {
      setAllMenuTree(allMenuResponse?.data || []);

      const selectedMenuResponse = await getAllTenantMenuIdByRoleIdService(record?.id);
      if (selectedMenuResponse?.data) {
        setSelectedKeys(selectedMenuResponse?.data);
      } else {
        setSelectedKeys([]);
      }
    }
    setMenuModalVisible(true);
  };

  const deleteRoleRequest = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteRoleManageService(id);
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

  // const onChangeTenant = (getTenantId: string) => {
  //   setTenantId2(getTenantId);
  //   formRef?.current?.setFieldValue('parentId');
  // };

  const onChangeTenant = (getTenantId: string) => {
    console.log('变化了吗')
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
        <a
          key="BusinessBtn"
          onClick={() => {
            setOpenbusinessModal(true);
            setRoleId(record?.roleId);
          }}
        >
          businessPermission
        </a>,
        <a
          key="MenuBtn"
          onClick={() => {
            setCurrentRow(record);
            openMenuModal(record);
          }}
        >
          Menu
        </a>,
        <a key="editBtn" onClick={() => openEdit(record)}>
          Edit
        </a>,
        <div key={'Delete'}>
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRoleRequest(record?.roleId || '');
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </div>
      ],
    },
    {
      title: 'Tenant',
      key: 'tenantId',
      hideInTable: true,
      hidden: true,
      dataIndex: 'direction',
      renderFormItem: () => {
        return (
          <ProFormTreeSelect
            name="tenant"
            placeholder="Please select"
            allowClear={false}
            width={'lg'}
            secondary
            initialValue={tenantId}
            fieldProps={{
              treeDefaultExpandAll:true,
              onChange: onChangeTenant,
              treeData: tenantTreeData,
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
          />
        );
      },
    },
  ];

  const getList = async (params: APISystem.RoleTableSearchParams) => {
    if (!tenantId) {
      return {
        data: [],
        success: true,
      };
    }

    params.tenantId = tenantId;
    const roleResponse = await getRoleManageTreeService(params);
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
      const roleDetailResponse = await getRoleManageDetailService(currentRow?.roleId || '');
      if (roleDetailResponse.success === true && roleDetailResponse.data) {
        return roleDetailResponse.data;
      }
    }

    return {
      roleId: '',
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

      setTenantTreeData(tenantTreeResponse.data);
      return tenantTreeResponse.data;
    } else {
      setTenantId(undefined);
      setTenantTreeData([]);
      return [];
    }
  };

  const onSaveMenu = async (id: string) => {
    const menuDataBody = {
      roleId: id,
      tenantMenuIds: checkedKeys,
    };

    const saveMenuResponse = await updateRoleAssignedTenantMenuService(menuDataBody);
    if (saveMenuResponse?.success === true) {
      message.success('Save success');
      setMenuModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error('Save menu failed, please try again');
    }
  };

  const editBusiness = async (record: any) => {
    const parms = {
      roleId: roleId || '',
      businessPermissionIds: selectedBusinesPermissions || '',
    };
    try {
      await updateRoleAssignedBusinessPermissionService(parms);
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
  };

  const handleSelectedBusinessPermissions = (newSelectedRowKeys: any) => {
    setSelectedBusinesPermissions(newSelectedRowKeys);
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
          <ProFormText name="roleId" hidden={true} />

          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Role Name is required',
                  },
                ]}
                fieldProps={{
                  onChange: (changeValues) => setRoleNameText(changeValues?.target?.defaultValue),
                }}
                label={'Role Name'}
                name="roleName"
                placeholder={'Role Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Code is required',
                  },
                ]}
                label={'Code'}
                name="code"
                placeholder={'Code'}
              />
            </Col>
            <Col span={12}>
              <ProFormTreeSelect
                label={'Tenant'}
                name="tenantId"
                placeholder="Please select"
                allowClear={false}
                secondary
                request={getTenantTreeRequest}
                fieldProps={{
                  treeDefaultExpandAll:true,
                  onChange: onChangeTenant,
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
            </Col>
            <Col span={12}>
              <ProFormTreeSelect
                params={tenantId}
                label={'Parent Role'}
                name="parentId"
                placeholder="Please select"
                allowClear={false}
                secondary
                request={getParentRoleTreeRequest}
                fieldProps={{
                  treeDefaultExpandAll:true,
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
            </Col>
            <Col span={12}>
              <ProFormDigit label={'Sort'} name="sort" placeholder={'Sort'} style={{width:'100%'}} />
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
            <Col span={24}>
              <ProFormTextArea label={'Description'} name="description"/>
            </Col>
          </Row>
        </ModalForm>
      )}

      {menuModalVisible && (
        <ModalForm
          title={'Menu'}
          width="500px"
          open={menuModalVisible}
          onOpenChange={setMenuModalVisible}
          onFinish={async (record) => {
            await onSaveMenu(record?.id);
          }}
          initialValues={{
            id: currentRow?.roleId,
          }}
        >
          <ProFormText label={'id'} name="id" hidden={true} />

          <div>
            <Tree
              height={500}
              checkable
              defaultExpandedKeys={selectedKeys}
              defaultSelectedKeys={selectedKeys}
              defaultCheckedKeys={selectedKeys}
              defaultExpandAll={true}
              onCheck={onCheck}
              treeData={allMenuTree}
              fieldNames={{ title: 'name', key: 'tenantMenuId' }}
            />

          </div>
        </ModalForm>
      )}

      {OpenbusinessModal && (
        <ModalForm
          title={'Permissions'}
          width="80%"
          open={OpenbusinessModal}
          onOpenChange={setOpenbusinessModal}
          onFinish={async (record) => {
            let response = await editBusiness(record);

            if (response) {
              setOpenbusinessModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <BusinessPermission
            onSelectedPermissions={handleSelectedBusinessPermissions}
            Id={roleId}
            tenantId={tenantId}
          />
        </ModalForm>
      )}

    </PageContainer>
  );
};

export default Role;
