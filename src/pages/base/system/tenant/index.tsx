import commonStyle from '@/pages/common/index.less';
import {
  batchDeleteTenantService,
  deleteTenantManageService,
  findSelectedMenuByTenantService,
  getTenantManageDetailService,
  getTenantManageTreeService,
  insertTenantManageService,
  onSaveMenuInTenantService,
  updateTenantManageService,
} from '@/services/base-service/system-service/tenantService';
import { enumsService } from '@/services/base-service/system-service/commService';
import { getRoleManageRoleDetailToListService } from '@/services/base-service/system-service/roleService';
import { getTenantManageMenuTreeService } from '@/services/base-service/system-service/menuService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { useIntl } from "@@/exports";
import {Button, message, Tree, Row, Col} from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import {PlusOutlined} from '@ant-design/icons'
import PopconfirmPage from '@/pages/base/components/popconfirm/index'
import styles from './index.less';

const Index: React.FC = () => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.TenantItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.TenantItemDataType[]>([]);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [tenantId, setTenantId] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [defaultExpanded, setDefaultExpanded] = useState([]);
  const [menuData,setMenuData] = useState([])
  const [showAll,setShowAll] = useState(false)
  const [permissionTypeList, setPermissionTypeList] = useState([]);
  const [tableAdd,setTableAdd] = useState<string | undefined>('')

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertTenantManageService({ ...fields });
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
      await updateTenantManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const deleteRow = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteTenantManageService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const batchDeleteRow = async (selectedRows: APISystem.TenantItemDataType[]) => {
    const hide = message.loading('delete...');
    if (!selectedRows) return true;

    try {
      await batchDeleteTenantService({
        id: selectedRows.map((row) => row.id),
      });
      hide();
      message.success('Deleted successfully and will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const onOpenEditModal = (record: APISystem.TenantItemDataType) => {
    setIsEdit(false);

    setCurrentRow({ parentId: record?.id ? record.id : '' });
    handleModalVisible(true);
  };

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const openMenuModal = async (id: string) => {
    const allMenuResponse = await getTenantManageMenuTreeService(id);
    if (allMenuResponse.success === true) {
      setAllMenuTree(allMenuResponse?.data || []);
    }

    const selectedMenuResponse = await findSelectedMenuByTenantService(id);
    if (selectedMenuResponse.success === true) {
      if (selectedMenuResponse?.data) {
        setCheckedKeys(selectedMenuResponse.data);
      }
    }

    setMenuModalVisible(true);
  };

  const onSaveMenu = async (id: string) => {
    const menuDataBody = {
      tenantId: id,
      menuIds: checkedKeys
    };

    const saveMenuResponse = await onSaveMenuInTenantService(menuDataBody);
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

  const getParentRoleTreeRequest = async () => {
    const Response = await getRoleManageRoleDetailToListService({
      tenantId: tenantId || '',
      tenantName: '',
    });
    if (Response.success && Response.data) {
      return Response.data;
    } else {
      return [];
    }
  };

  const getTenantManageInfoRequest = async () => {
    if (isEdit) {
      const roleDetailResponse = await getTenantManageDetailService(currentRow?.id || '');
      await getParentRoleTreeRequest();
      if (roleDetailResponse.success === true && roleDetailResponse.data) {
        return roleDetailResponse.data;
      }
    }

    return {
      parentId: tableAdd,
      tenantName: '',
      type: '',
      status: '',
      tenantCode: '',
      description: '',
    };
  };

  const columns: ProColumns<APISystem.TenantItemDataType>[] = [
    {
      title: 'Tenant name',
      dataIndex: 'tenantName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      valueEnum: {
        1: {
          text: 'Platform',
        },
        2: {
          text: 'Customer',
        },
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
      title: 'Tenant Code',
      dataIndex: 'tenantCode',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'application.list.createdDate' }),
      key: 'showTime',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createdDate'
    },
    {
      title: intl.formatMessage({ id: 'application.list.updatedDate' }),
      hideInSearch: true,
      dataIndex: 'updatedDate',
      sorter: true,
    },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key="MenuBtn"
          onClick={() => {
            setCurrentRow(record);
            openMenuModal(record?.id || '');
          }}
        >
          Menu
        </a>,
        <a
          key="EditBtn"
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            setTenantId(record?.id);
            handleModalVisible(true);
          }}
        >
          Edit
        </a>,
        <a
          key="NewBtn"
          onClick={() => {
            setIsEdit(false);
            setTenantId(record?.id);
            setTableAdd(record?.id ? record.id : '')
            onOpenEditModal(record);
          }}
        >
          Add
        </a>,
        <div key='Delete'>
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRow(record?.id || '');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </div>
      ],
    },
  ];

  const searchTable = async (params: any) => {
    params.status = params?.status?.map((item: any) => {
      if (item === '1') {
        return 'FORBIDDEN'
      } else if (item === '2') {
        return 'LOCKING'
      } else if (item === '3') {
        return 'EXPIRED'
      } else {
        return 'ENABLE'
      }
    });
    let data: any = [];
    params.status = params?.status?.map((param: any) => encodeURIComponent(param)).join(',') || [];
    const res = await getTenantManageTreeService(params);
    if (res.success) {
      data = res?.data || [];
    }
    setMenuData(data)
    return {
      data,
      success: true,
    };
  };

  const openTreeData = async () =>{
    const treeDataMap = menuData
    let treeDataId: any[];
    treeDataId = [];
    if (!showAll){
      const renderData = (ele: any) =>{
        ele.forEach((item: any)=>{
          treeDataId.push(item.id)
          if (item?.children && item?.children?.length > 0){
            renderData(item?.children)
          }
        })
      }
      renderData(treeDataMap)
    }
    setDefaultExpanded(treeDataId)
  }

  const initPermissionTypeChange = async () => {
    const response = await enumsService();
    console.log(response, '777777')
    if (response?.success === true) {
      setPermissionTypeList(response?.data?.sysTenantPermissionType
      );
    }
  };

  useEffect(() => {
    initPermissionTypeChange();
  }, []);

  return (
    <PageContainer>
      <ProTable<APISystem.TenantItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowAll(!showAll)
              openTreeData()
            }}
            type="primary"
          >
            全部{
            showAll?'收起':'展开'
          }
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEdit(false)
              setTableAdd('')
              handleModalVisible(true)
            }}
            type="primary"
          >
            新建
          </Button>
        ]}
        request={searchTable}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        expandable={{expandedRowKeys: defaultExpanded}}
        onExpand={(b, r) => {
          const newExp: any = b ? [...defaultExpanded, r.id] : defaultExpanded.filter(i => i !== r.id);
          setDefaultExpanded(newExp);
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              await batchDeleteRow(selectedRowsState);
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

      {modalVisible && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          formRef={formRef}
          open={modalVisible}
          onOpenChange={handleModalVisible}
          request={getTenantManageInfoRequest}
          initialValues={{
            id: currentRow?.id,
            parentId: currentRow?.parentId,
            tenantName: currentRow?.tenantName ? currentRow.tenantName : '',
            description: currentRow?.description,
            tenantCode: currentRow?.tenantCode,
            type: currentRow?.type,
            status: currentRow?.status,
          }}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.TenantItemDataType);
            } else {
              response = await handleAdd(record as APISystem.TenantItemDataType);
            }

            if (response) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          className={commonStyle.pageContainer}
        >
          <Row  gutter={16}>
            <Col span={12}>
              <ProFormTreeSelect
                label={'Parent tenant'}
                name="parentId"
                placeholder="Please select"
                allowClear={true}
                secondary
                request={async ()=>menuData}
                fieldProps={{
                  treeDefaultExpandAll:true,
                  suffixIcon: null,
                  filterTreeNode: true,
                  showSearch: true,
                  popupMatchSelectWidth: false,
                  autoClearSearchValue: true,
                  multiple: false,
                  treeNodeFilterProp: 'title',
                  fieldNames: {
                    label: 'tenantName',
                    value: 'id',
                  },
                }}
              />
            </Col>
            
            <Col span={12}>
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'TenantPermission Type is required',
                  },
                ]}
                mode="multiple"
                label={'TenantPermission Type'}
                name="TenantPermissionType"
                placeholder={'TenantPermission Type'}
                request={async () => {
                  return permissionTypeList.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText name="id" hidden={true} />
            </Col>
            <Col span={12}>
              <ProFormText label={'parentId'} name="parentId" hidden={true} />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Tenant name is required',
                  },
                ]}
                label={'Tenant name'}
                name="tenantName"
                placeholder={'Tenant name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Code name is required',
                  },
                ]}
                label={'Tenant Code'}
                name="tenantCode"
                placeholder={'Tenant Code'}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="type"
                label={'Type'}
                initialValue={1}
                allowClear={false}
                rules={[
                  {
                    required: true,
                    message: 'Type is required',
                  },
                ]}
                options={[
                  {
                    value: 1,
                    label: 'Platform',
                  },
                  {
                    value: 2,
                    label: 'Customer',
                  },
                ]}
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
            <Col span={24}>
              <ProFormTextArea
                name="description"
                label={'Description'}
                placeholder={'Please enter description'}
              />
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
            id: currentRow?.id,
          }}
          className={commonStyle.pageContainer}
        >
          <ProFormText label={'id'} name="id" hidden={true} />

          <div className={styles.tenantMenuTree}>
            <Tree
              height={500}
              checkable
              defaultExpandAll
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={allMenuTree}
              fieldNames={{ title: 'name', key: 'id' }}
            />
          </div>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default Index;
