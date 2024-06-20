import styles from './index.less';
import React, {useRef, useState} from 'react';
import {Button, message, Tree} from 'antd';
import {FormattedMessage} from '@umijs/max';
import commonStyle from "@/pages/common/index.less";
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {
  getTenantManageTreeService,
  insertTenantManageService,
  updateTenantManageService,
  deleteTenantManageService,
  getTenantManageDetailService,

  batchDeleteTenantService,
  findAllMenuTreeByTenantService,
  findSelectedMenuByTenantService,
  onSaveMenuInTenantService,
} from '@/services/system-service/tenantService';


const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.TenantItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.TenantItemDataType[]>([]);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[], halfChecked: React.Key[] }>({
    checked: [],
    halfChecked: []
  });
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;
    fields.parentId = currentRow?.parentId

    try {
      await insertTenantManageService({...fields});
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
  }

  const batchDeleteRow = async (selectedRows: APISystem.TenantItemDataType[]) => {
    const hide = message.loading('delete...');
    if (!selectedRows) return true;

    console.log('selectedRows', selectedRows);
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

    setCurrentRow({parentId: record?.id ? record.id : ''});
    handleModalVisible(true);
  }

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[], e: any) => {
    setCheckedKeys({
      checked: checkedKeysValue,
      halfChecked: e.halfCheckedKeys
    });
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const openMenuModal = async (id: string) => {
    const allMenuResponse = await findAllMenuTreeByTenantService(id);
    if (allMenuResponse.success === true) {
      setAllMenuTree(allMenuResponse?.data || []);
    }

    const selectedMenuResponse = await findSelectedMenuByTenantService(id);
    if (selectedMenuResponse.success === true) {
      if (selectedMenuResponse?.data) {
        const checkedKey: string[] = selectedMenuResponse.data?.checkedMenuId || [];
        const halfChecked: string[] = selectedMenuResponse.data?.halfCheckedMenuId || [];

        setCheckedKeys({checked: checkedKey, halfChecked: halfChecked});
      }
    }

    setMenuModalVisible(true);
  }

  const onSaveMenu = async (id: string) => {
    const menuDataBody = {
      tenantId: id,
      menuIds: checkedKeys.checked.concat(checkedKeys.halfChecked),
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

  const getTenantManageInfoRequest = async () => {
    if (isEdit) {
      const roleDetailResponse =  await getTenantManageDetailService(currentRow?.id || '');
      if (roleDetailResponse.success === true && roleDetailResponse.data) {
        return roleDetailResponse.data;
      }
    }

    return {
      parentId:'',
      tenantName: '',
      type: '',
      status: '',
      tenantCode: 1,
      description: '',
    };
  }

  const columns: ProColumns<APISystem.TenantItemDataType>[] = [
    {
      title: 'Tenant name',
      dataIndex: 'tenantName',
    },
    {
      title: "Type",
      dataIndex: 'type',
      valueEnum: {
        1: {
          text: 'Platform',
        },
        2: {
          text: 'Customer',
        },
      }
    },
    {
      title: "Status",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Disable',
          status: 'Processing',
        },
        1: {
          text: 'Enable',
          status: 'Success',
        },
        2: {
          text: 'Logoff',
          status: 'Error',
        },
        3: {
          text: 'Arrearage',
          status: 'Default',
        }
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
    },
    {
      title: 'Created At',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
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
            console.log('Edit record', record);
            handleModalVisible(true);
          }}
        >
          Edit
        </a>,
        <a
          key="NewBtn"
          onClick={() => {
            onOpenEditModal(record);
          }}
        >
          Add
        </a>,
        <a
          key="deleteRow"
          onClick={async () => {
            await deleteRow(record?.id || '');
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}
        >Delete</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.TenantItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        toolBarRender={() => []}
        request={getTenantManageTreeService}
        columns={columns}
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
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

      {
        modalVisible &&
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="400px"
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
            status: currentRow?.status
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
          <ProFormText name="id" hidden={true}/>

          <ProFormText
            label={"parentId"}
            name="parentId"
            hidden={true}
          />

          <ProFormText
            rules={[
              {
                required: true,
                message: "Tenant name is required",
              },
            ]}
            label={"Tenant name"}
            width="md"
            name="tenantName"
            placeholder={"Tenant name"}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: "Code name is required",
              },
            ]}
            label={"Tenant Code"}
            width="md"
            name="tenantCode"
            placeholder={"Tenant Code"}
          />
          <ProFormTextArea
            name="description"
            width="md"
            label={"Description"}
            placeholder={'Please enter description'}
          />
          <ProFormSelect
            name="type"
            label={"Type"}
            width="md"
            initialValue={1}
            allowClear={false}
            rules={[
              {
                required: true,
                message: "Type is required",
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
              }
            ]}
          />
          <ProFormSelect
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
            name="status"
            width="md"
            label={"Status"}
            initialValue={1}
            options={[
              {
                value: 0,
                label: 'Disable',
              },
              {
                value: 1,
                label: 'Enable',
              },
              {
                value: 2,
                label: 'Logoff',
              },
              {
                value: 3,
                label: 'Arrearage',
              }
            ]}
          />
        </ModalForm>
      }

      {
        menuModalVisible &&
        <ModalForm
          title={'Menu'}
          width="400px"
          open={menuModalVisible}
          onOpenChange={setMenuModalVisible}
          onFinish={async (record) => {
            await onSaveMenu(record?.id);
          }}
          initialValues={{
            id: currentRow?.id
          }}
          className={commonStyle.pageContainer}
        >
          <ProFormText
            label={"id"}
            name="id"
            hidden={true}
          />

          <div className={styles.tenantMenuTree}>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={allMenuTree}
              fieldNames={{title: 'name', key: 'id'}}
            />
          </div>

        </ModalForm>
      }

    </PageContainer>
  );
};

export default Index;
