import {FormattedMessage} from '@umijs/max';
import {Button, message, Space, Tree} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
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
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PlusOutlined} from '@ant-design/icons';
import {
  getRoleManageTreeService,
  getRoleManageDetailService,
  deleteRoleManageService,
  insertRoleManageService,
  updateRoleManageService,
  getRoleManageRoleDetailToListService,
  getAllByTenantMenuToTreeService,
  insertRoleMenuService,
  getAllTenantByRoleIdService,
} from '@/services/base-service/system-service/roleService';
import {getTenantManageTreeService} from '@/services/base-service/system-service/tenantService';
import type { ProFormInstance } from '@ant-design/pro-components';

const Role: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [tenantId, setTenantId] = useState<string|undefined>(undefined);
  const [parentTreeData, setParentTreeData] = useState([]);
  const [roleNameText, setRoleNameText] = useState('');
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.RoleItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.RoleItemDataType[]>([]);
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<{ checked: React.Key[], halfChecked: React.Key[] }>({
    checked: [],
    halfChecked: []
  });
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const openEdit = async (record: APISystem.RoleItemDataType) => {
    setIsEdit(true);

    setCurrentRow(record);
    setOpenModal(true);
  }

  const createRoleRequest = async (fields: APISystem.RoleItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;
    fields.parentId = currentRow?.parentId

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

  const openMenuModal = async (id?: any) => {
    const allMenuResponse = await getAllByTenantMenuToTreeService(tenantId);

    if (allMenuResponse.success === true) {
      setAllMenuTree(allMenuResponse?.data || []);
    }

    const selectedMenuResponse = await getAllTenantByRoleIdService(id);
    if (selectedMenuResponse.success === true) {
      if (selectedMenuResponse?.data) {
        const checkedKey: string[] = selectedMenuResponse.data?.checkedMenuId || [];
        const halfChecked: string[] = selectedMenuResponse.data?.halfCheckedMenuId || [];

        setCheckedKeys({checked: checkedKey, halfChecked: halfChecked});
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
  }

  const onChangeTenant = (tenantId: string) => {
    setTenantId(tenantId);
    formRef.current.setFieldValue('parentId')
    // getParentRoleTreeRequest(tenantId);
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
        }
      },
    },
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      width: '220px',
      render: (_, record) => [
        <a
          key="MenuBtn"
          onClick={() => {
            setCurrentRow(record);
            openMenuModal(record?.id);
          }}
        >
          Menu
        </a>,
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
              onChange: onChangeTenant,
              treeData: tenantTreeData,
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
      const roleDetailResponse =  await getRoleManageDetailService(currentRow?.id || '');
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
    const tenantTreeResponse = await getTenantManageTreeService();
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

  const removeFields = (obj: any) => {
    delete obj.id;
    delete obj.sort;

    if (obj.children) {
      obj.children.forEach((child: any) => {
        removeFields(child);
      });
    }
  };

  const onSaveMenu = async (id: string) => {
    const menuDataBody = {
      roleId: id,
      menuIds: checkedKeys.checked.concat(checkedKeys.halfChecked),
    };

    const saveMenuResponse = await insertRoleMenuService(menuDataBody);
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

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const getParentRoleTreeRequest = async (Id: any) => {
    const Response = await getRoleManageRoleDetailToListService({
      tenantId,
      tenantName: roleNameText || ''
    });
    if (Response.success && Response.data) {
      const list = Response.data
      setParentTreeData(list);
      return list;
    } else {
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
          options={false}
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
          formRef={formRef}
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
              fieldProps={{
                onChange: (changeValues) => setRoleNameText(changeValues?.target?.defaultValue)
              }}
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
              label={"Tenant"}
              name="tenantId"
              placeholder="Please select"
              allowClear={false}
              width="md"
              secondary
              request={getTenantTreeRequest}
              fieldProps={{
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
              rules={[
                {
                  required: true,
                  message: "Role is required"
                }
              ]}
            />

            <ProFormTreeSelect
              params={tenantId}
              label={"Parent Role"}
              name="parentId"
              placeholder="Please select"
              allowClear={false}
              width="md"
              secondary
              request={getParentRoleTreeRequest}
              fieldProps={{
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                popupMatchSelectWidth: false,
                autoClearSearchValue: true,
                treeNodeFilterProp: 'title',
                fieldNames: {
                  label: 'roleName',
                  value: 'id'
                },
              }}
            />
          </Space>

          <Space size={20}>
            <ProFormDigit
              label={"Sort"}
              name="sort"
              width="md"
              placeholder={"Sort"}
            />

            <ProFormSelect
              width="md"
              rules={[
                {
                  required: true,
                  message: "Status is required",
                },
              ]}
              name="status"
              label={"Status"}
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
                  value:  2,
                },
                {
                  label: '过期',
                  value: 3,
                }
              ]}
            />
          </Space>

          <Space size={20}>
            <ProFormTextArea label={"Description"} name="description" width="md" />
          </Space>
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
        >
          <ProFormText
            label={"id"}
            name="id"
            hidden={true}
          />

          <div>
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

export default Role;
