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
import { filterDate } from '@/utils/utils';
import { enumsService } from '@/services/base-service/system-service/commService';
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
import ConfirmPage from "@/pages/base/components/popconfirm";
import FunctionPermission from '@/pages/base/components/functionPermission/index'

const Role: React.FC = () => {
  const intl = useIntl();
  const refTableForm = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [buttonTenantId,setButtonTenantId] = useState('')
  const [tenantId, setTenantId] = useState<any>();
  const [roleNameText, setRoleNameText] = useState('');
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [OpenBusinessModal, setOpenBusinessModal] = useState(false);
  const [selectedBusinessPermissions, setSelectedBusinessPermissions] = useState([]);
  const [roleId, setRoleId] = useState('');
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'createdDate': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

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
      if (refTableForm?.current){
        refTableForm?.current.setFieldsValue({
          tenantId: fields?.tenantId
        })
      }
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

  const onChangeTenant = (getTenantId: string) => {
    setTenantId(getTenantId);
    formRef?.current?.setFieldValue('parentId', undefined);
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
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
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
      valueType: 'select',
      valueEnum: dataItemStatus?.reduce((result: any, type: any) => {
        result[type?.value] = {
          text: type?.name,
          status: type?.value,
        };
        return result;
      }, {}),
      renderFormItem: (_, { ...rest }) => <ProFormSelect mode="multiple" {...rest} fieldProps={{mode: 'multiple'}}/>
    },
    {
      title: intl.formatMessage({ id: 'application.list.createdDate' }),
      // key: 'showTime',
      // sorter: true,
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
      fixed: 'right',
      render: (_, record: any) => [
        <FunctionPermission code="BusinessRole">
          <a
            key="BusinessBtn"
            onClick={() => {
              setOpenBusinessModal(true);
              setRoleId(record?.roleId);
              setButtonTenantId(record?.tenantId)
            }}
          >
            Business
          </a>
        </FunctionPermission>,
        <FunctionPermission code="MenuRole">
          <a
            key="MenuBtn"
            onClick={() => {
              setCurrentRow(record);
              openMenuModal(record);
            }}
          >
            Menu
          </a>
        </FunctionPermission>,
        <FunctionPermission code="EditRole">
          <a key="editBtn" onClick={() => openEdit(record)}>
            Edit
          </a>
        </FunctionPermission>,
        <FunctionPermission code="DeleteRole">
          <ConfirmPage
            onConfirm={async () => {
              await deleteRoleRequest(record?.roleId || '');
            }}>
            <a key="deleteRow">Delete</a>
          </ConfirmPage>
        </FunctionPermission>,
      ],
    },
    {
      title: 'Tenant',
      hideInTable: true,
      dataIndex: 'tenantId',
      key:'tenantId',
      renderFormItem: () => {
        return (
          <ProFormTreeSelect
            name="tenantId"
            placeholder="Please select"
            allowClear={true}
            width={'lg'}
            secondary
            fieldProps={{
              placeholder:'Please Select',
              treeDefaultExpandAll:true,
              treeData: tenantTreeData,
              filterTreeNode: true,
              showSearch: true,
              popupMatchSelectWidth: false,
              autoClearSearchValue: true,
              treeNodeFilterProp: 'title',
              fieldNames: {
                label: 'tenantName',
                value:'id'
              },
            }}
          />
        );
      },
    },
  ];

  const getList = async (params: APISystem.RoleTableSearchParams) => {
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
      sort: '',
      status: null,
      description: '',
    };
  };

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantManageTreeService({});
    if (tenantTreeResponse.success && tenantTreeResponse.data) {
      setTenantTreeData(tenantTreeResponse.data);
      return tenantTreeResponse.data;
    } else {
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

  const editBusiness = async () => {
    const params = {
      roleId: roleId || '',
      businessPermissionIds: selectedBusinessPermissions || '',
    };
    try {
      await updateRoleAssignedBusinessPermissionService(params);
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
    setSelectedBusinessPermissions(newSelectedRowKeys);
  };

  const getParentRoleTreeRequest = async () => {
    const Response = await getRoleManageRoleDetailToListService({
      tenantId: tenantId,
      tenantName: roleNameText || '',
    });
    if (Response.success && Response.data) {
      const list = filterDate(Response.data, currentRow?.id)
      return list;
    } else {
      return [];
    }
  };

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

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
        <ProTable<APISystem.RoleItemDataType, APISystem.PageParams>
          rowKey="id"
          formRef={refTableForm}
          headerTitle={'List'}
          actionRef={actionRef}
          columnsStateMap={columnsStateMap}
          onColumnsStateChange={handleColumnsStateChange}
          toolBarRender={() => [
            <FunctionPermission code="AddRole">
              <Button
                type="primary"
                onClick={() => {
                  setIsEdit(false);
                  setCurrentRow({ parentId: '0' });
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
          tableAlertRender={()=>{
            return `Selected ${selectedRowsState.length} ${selectedRowsState.length > 1 ? 'Items' : 'Item'}`
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
              // Because the newly added tenantId must be placed in the query condition box after the new saving,
              // the assigned tenantId can only be obtained by re-searching
              if (refTableForm.current){
                refTableForm.current.submit()
              }
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
                disabled={isEdit}
                allowClear={false}
                secondary
                request={getTenantTreeRequest}
                fieldProps={{
                  placeholder:"Please Select",
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
                allowClear={false}
                secondary
                request={getParentRoleTreeRequest}
                fieldProps={{
                  placeholder:"Please Select",
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
                placeholder="Please Select"
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
            <Col span={24}>
              <ProFormTextArea label={'Description'} placeholder={'Please Description'} name="description"/>
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
              checkStrictly
              defaultExpandedKeys={selectedKeys}
              defaultSelectedKeys={selectedKeys}
              defaultCheckedKeys={selectedKeys}
              defaultExpandAll={true}
              onCheck={onCheck}
              treeData={allMenuTree}
              fieldNames={{ title: 'menuName', key: 'tenantMenuId' }}
            />

          </div>
        </ModalForm>
      )}

      {OpenBusinessModal && (
        <ModalForm
          title={'Permissions'}
          width="80%"
          open={OpenBusinessModal}
          onOpenChange={setOpenBusinessModal}
          onFinish={async () => {
            let response = await editBusiness();

            if (response) {
              setOpenBusinessModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <BusinessPermission
            onSelectedPermissions={handleSelectedBusinessPermissions}
            Id={roleId}
            tenantId={buttonTenantId}
          />
        </ModalForm>
      )}

    </PageContainer>
  );
};

export default Role;
