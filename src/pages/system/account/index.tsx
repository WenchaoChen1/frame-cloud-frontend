import React, {useRef, useState} from 'react';
import {Button, message, Space} from 'antd';
import {FormattedMessage, useModel} from '@umijs/max';
import {PlusOutlined} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable
} from '@ant-design/pro-components';
import {
  createAccountService,
  deleteAccountService,
  editAccountService,
  getAccountInfoService,
  getAccountListService,
} from '@/services/system-service/account';
import {getTenantManageTreeService} from '@/services/system-service/tenantService';
import {getAllUserListService} from "@/services/system-service/user";

const Account: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const currentAccountId = initialState?.currentUser?.accountId;

  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.AccountItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.AccountItemDataType[]>([]);

  const actionRef = useRef<ActionType>();

  const getList = async (params: APISystem.PageParams) => {
    params.tenantId=initialState?.currentUser?.tenantId;
    console.log(params)
    const roleResponse = await getAccountListService(params);

    let dataSource: APISystem.AccountItemDataType[] = [];
    let total = 0;
    if (roleResponse?.success === true) {
      dataSource = roleResponse?.data?.content || [];
      total = roleResponse?.data?.totalElements || 0;
    }

    return {
      success: true,
      data: dataSource,
      total: total,
    };
  };

  const getAccountInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getAccountInfoService(currentRow?.id || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      id: '',
      name: '',
      tenantId: '',
      userId: '',
    };
  }

  const createAccountRequest = async (fields: APISystem.AccountItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await createAccountService({...fields});
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
  const updateAccountRequest = async (fields: APISystem.AccountItemDataType) => {
    const hide = message.loading('Update...');
    try {
      await editAccountService(fields);
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
      await deleteAccountService(id);
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

  const onEdit = async (record: APISystem.AccountItemDataType) => {
    setCurrentRow(record);

    setIsEdit(true);
    setOpenModal(true);
  }

  const columns: ProColumns<APISystem.AccountItemDataType>[] = [
    {
      title: 'Account',
      dataIndex: 'name',
    },
    {
      title: 'Identity',
      dataIndex: 'identity',
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
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => onEdit(record)}
        >
          Edit
        </a>,
        currentAccountId !== record.id &&
        <a
          key="delete"
          onClick={async () => {
            await deleteRow(record?.id || '');
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.AccountItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{labelWidth: 100}}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setIsEdit(false);
              setOpenModal(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
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

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="Item"/>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await deleteRow('');
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
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={openModal}
          onOpenChange={setOpenModal}
          request={getAccountInfoRequest}
          onFinish={async (record) => {
            let response = undefined;

            if (isEdit) {
              response = await updateAccountRequest(record as APISystem.AccountItemDataType);
            } else {
              response = await createAccountRequest(record as APISystem.AccountItemDataType);
            }

            if (response) {
              setOpenModal(false);
              actionRef.current?.reloadAndRest?.();
            }
          }}
        >
          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "Name is required",
                }
              ]}
              width="md"
              label={"Name"}
              name={"name"}
              placeholder={"Name"}
            />

            <ProFormSelect
              name="accountTypeConstants"
              label={"Account Type"}
              width="md"
              rules={[
                {
                  required: true,
                  message: "Account Type is required",
                },
              ]}
              initialValue={'ADMIN'}
              options={[
                {
                  value: 'ADMIN',
                  label: 'Admin'
                },
                {
                  value: 'USER',
                  label: 'User'
                }
              ]}
              allowClear={false}
            />
            <ProFormText name="id" hidden={true}/>
          </Space>

          <Space size={20}>
            <ProFormTreeSelect
              label="Tenant name"
              name="tenantId"
              placeholder="Please select"
              allowClear
              width={'md'}
              secondary
              disabled={isEdit ? true : false}
              request={async () => {
                const tenantTreeResponse = await getTenantManageTreeService();
                if (tenantTreeResponse.success && tenantTreeResponse.data) {
                  return tenantTreeResponse.data;
                } else {
                  return []
                }
              }}
              fieldProps={{
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
                  message: "Tenant is required",
                }
              ]}
            />

            <ProFormSelect
              label={"User"}
              name="userId"
              placeholder="Please select"
              allowClear
              width={'md'}
              secondary
              disabled={isEdit ? true : false}
              request={async () => {
                const responseRole = await getAllUserListService();
                if (responseRole.success === true && responseRole?.data) {
                  return responseRole?.data;
                } else {
                  return [];
                }
              }}
              fieldProps={{
                fieldNames: {
                  label: 'username',
                  value: 'id'
                }
              }}
              rules={[
                {
                  required: true,
                  message: "User is required",
                }
              ]}
            />
          </Space>
        </ModalForm>
      }
    </PageContainer>
  );
};

export default Account;
