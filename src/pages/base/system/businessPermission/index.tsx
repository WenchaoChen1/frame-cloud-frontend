import dayjs from "dayjs";
import { useIntl } from "@@/exports";
import { FormattedMessage} from '@umijs/max';
import {Button, message, Space, Tree,Row,Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import PopconfirmPage from "@/pages/base/components/popconfirm";
import { getTenantManageTreeService } from '@/services/base-service/system-service/tenantService';
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
import {
  getBusinessPermissionManageTreeService,
  getBusinessPermissionManageDetailService,
  deleteBusinessPermissionManageService,
  insertBusinessPermissionManageService,
  updateBusinessPermissionManageService,
  getRoleManageRoleDetailToListService,
  getBusinessPermissionManageTenantMenuTreeService,
  getAllTenantMenuIdByBusinessPermissionIdService,
  updateBusinessPermissionAssignedTenantMenuService,
} from '@/services/base-service/system-service/businessService';

const BusinessPermission: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const refTableForm = useRef<ProFormInstance>();
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [roleNameText, setRoleNameText] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);
  const [MenuOpenModal, setMenuOpenModal] = useState<boolean>(false);
  const [selectMenuDataList, setSelectMenuDataList] = useState<any>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

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
              await deleteRoleRequest(record?.id || '');
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
      dataIndex: 'tenantId',
      renderFormItem: () => {
        return (
          <ProFormTreeSelect
            name="tenantId"
            placeholder="Please select"
            allowClear={true}
            width={'lg'}
            secondary
            // initialValue={tenantId}
            fieldProps={{
              treeDefaultExpandAll:true,
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
      sort: '',
      status: 1,
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

  const onCheck = (checkedKeysValue: any) => {
    setSelectMenuDataList(checkedKeysValue);
  };

  const openMenuModal = async (record?: any) => {
    const allMenuResponse = await getBusinessPermissionManageTenantMenuTreeService(record?.tenantId);
    if (allMenuResponse.success === true) {
      setAllMenuTree(allMenuResponse?.data || []);

      const selectedMenuResponse = await getAllTenantMenuIdByBusinessPermissionIdService(record?.id);
      if (selectedMenuResponse?.data) {
        setSelectMenuDataList(selectedMenuResponse?.data);
      } else {
        setSelectMenuDataList([]);
      }
    }
    setMenuOpenModal(true);
  };

  const onSaveMenu = async (id: string) => {
    const menuDataBody = {
      businessPermissionId: id,
      tenantMenuIds: selectMenuDataList,
    };

    const saveMenuResponse = await updateBusinessPermissionAssignedTenantMenuService(menuDataBody);
    if (saveMenuResponse?.success === true) {
      message.success('Save success');
      setMenuOpenModal(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error('Save menu failed, please try again');
    }
  };

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

  return (
    <PageContainer>
        <ProTable<APISystem.RoleItemDataType, APISystem.PageParams>
          rowKey="id"
          formRef={refTableForm}
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
              // actionRef.current?.reloadAndRest?.();
            }
          }}
        >
          <ProFormText name="businessPermissionId" hidden={true} />
          <Row gutter={16}>
            <Col span={12}>
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
                placeholder={'Name'}
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
            <Col span={12}><ProFormDigit label={'Sort'} name="sort" placeholder={'Sort'} /></Col>
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
            <Col span={12}><ProFormTextArea label={'Description'} name="description" /></Col>
          </Row>
        </ModalForm>
      )}

      {MenuOpenModal && (
        <ModalForm
          title={'Menu'}
          width="400px"
          open={MenuOpenModal}
          onOpenChange={setMenuOpenModal}
          onFinish={async (record) => {
            await onSaveMenu(record?.id);
          }}
        >
          <ProFormText label={'id'} name="id" hidden={true} />

          <div>
            <Tree
              checkable
              defaultExpandedKeys={selectMenuDataList}
              defaultSelectedKeys={selectMenuDataList}
              defaultCheckedKeys={selectMenuDataList}
              defaultExpandAll={true}
              onCheck={onCheck}
              treeData={allMenuTree}
              fieldNames={{ title: 'menuName', key: 'tenantMenuId' }}
            />

          </div>
        </ModalForm>
      )}

    </PageContainer>
  );
};

export default BusinessPermission;
