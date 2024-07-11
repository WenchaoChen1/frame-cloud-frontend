import dayjs from "dayjs";
import { useIntl } from "@@/exports";
import { useAccess, Access } from 'umi';
import { FormattedMessage} from '@umijs/max';
import {Button, message, Tree,Row,Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import PopconfirmPage from "@/pages/base/components/popconfirm";
import { enumsService } from '@/services/base-service/system-service/commService';
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
import FunctionPermission from '@/pages/base/components/functionPermission/index'

const BusinessPermission: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const refTableForm = useRef<ProFormInstance>();
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [roleNameText, setRoleNameText] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [MenuOpenModal, setMenuOpenModal] = useState<boolean>(false);
  const [selectMenuDataList, setSelectMenuDataList] = useState<any>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);
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

  const createRoleRequest = async (fields: APISystem.BusinessPermissionItemDataType) => {
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

  const updateRoleRequest = async (fields: APISystem.BusinessPermissionItemDataType) => {
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
    formRef?.current?.setFieldValue('parentId', undefined);
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

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

  const columns: ProColumns<APISystem.BusinessPermissionItemDataType>[] = [
    { 
      title: 'Name',
      dataIndex: 'name',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { title: 'Description', hideInSearch: true, dataIndex: 'description', ellipsis: true, },
    { title: 'Sort', hideInSearch: true, dataIndex: 'sort' },
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
        <FunctionPermission code="MenuBusiness">
          <a
            onClick={() => {
              setCurrentRow(record);
              openMenuModal(record);
            }}
          >
            Menu
          </a>
        </FunctionPermission>,
        <FunctionPermission code="EditBusiness">
          <a onClick={() => openEdit(record)}>
            Edit
          </a>
        </FunctionPermission>,
        <FunctionPermission code="DeleteBusiness">
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRoleRequest(record?.id || '');
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </FunctionPermission>,
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
            allowClear={true}
            width={'lg'}
            secondary
            // initialValue={tenantId}
            fieldProps={{
              placeholder:"Please Select",
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
    let dataSource: APISystem.BusinessTableSearchParams[] = [];
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
      const roleDetailResponse = await getBusinessPermissionManageDetailService(currentRow?.id);
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

  const onSaveMenu = async () => {
    const menuDataBody = {
      businessPermissionId: currentRow?.businessPermissionId,
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
        <ProTable<APISystem.BusinessTableSearchParams, APISystem.PageParams>
          rowKey="id"
          formRef={refTableForm}
          headerTitle={'List'}
          actionRef={actionRef}
          columnsStateMap={columnsStateMap}
          onColumnsStateChange={handleColumnsStateChange}
          toolBarRender={() => [
            <FunctionPermission code="AddBusiness">
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
            onChange: (_, selectedRows: any) => {
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
          onFinish={async (record: any) => {
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
                disabled={isEdit}
                fieldProps={{
                  placeholder:'Please Select',
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
                  placeholder:'Please Select',
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
                placeholder={'Please Select'}
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
            <Col span={12}><ProFormTextArea label={'Description'} name="description" placeholder={'Please Enter Description'} /></Col>
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
            await onSaveMenu();
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
