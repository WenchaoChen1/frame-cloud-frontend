import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteAccountManageService,
  getAccountManageDetailService,
  getAccountManagePageService,
  insertAccountManageService,
  updateAccountManageService,
} from '@/services/base-service/system-service/accountService';
import { enumsService } from '@/services/base-service/system-service/commService';
import { getTenantManageTreeService } from '@/services/base-service/system-service/tenantService';
import { getUserManagePageService } from '@/services/base-service/system-service/userService';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns, ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useModel} from '@umijs/max';
import { useIntl } from "@@/exports";
import { Button, message, Row,Col } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";
import RolePage from './components/role'
import TenantPage from './components/tenant'
import BinessPage from './components/biness'

const Account: React.FC = () => {
  const intl = useIntl();
  const refTableForm = useRef<ProFormInstance>();
  const [roleModal,setRoleModal] = useState(false)
  const [tenantModal,setTenantModal] = useState(false)
  const [binessModal,setBinessModal] = useState(false)
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const currentAccountId = initialState?.currentUser?.accountId;
  const [tenantTreeData, setTenantTreeData] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<APISystem.AccountItemDataType>();
  const [selectedRowsState, setSelectedRows] = useState<APISystem.AccountItemDataType[]>([]);
  const [accountType, setAccountType] = useState<any>([]);
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);

  const getList = async (params: APISystem.AccountItemDataType) => {
    const roleResponse = await getAccountManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      tenantId: params?.tenantId || '',
      name: params?.name || '',
      identity: params?.identity || '',
    });

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
      const accountDetailResponse = await getAccountManageDetailService(currentRow?.accountId || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      accountId: '',
      name: '',
      tenantId: '',
      userId: '',
    };
  };

  const createAccountRequest = async (fields: APISystem.AccountItemDataType) => {
    const hide = message.loading('add');
    delete fields.accountId;

    try {
      await insertAccountManageService({ ...fields });
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

  const updateAccountRequest = async (fields: APISystem.AccountItemDataType) => {
    const hide = message.loading('Update...');
    try {
      await updateAccountManageService(fields);
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
      await deleteAccountManageService(id);
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

  const onEdit = async (record: APISystem.AccountItemDataType) => {
    setCurrentRow(record);
    setIsEdit(true);
    setOpenModal(true);
  };
  const onRole = (record: APISystem.AccountItemDataType) =>{
    setCurrentRow(record);
    setRoleModal(true)
  }
  const onEditTenant = (record: APISystem.AccountItemDataType) =>{
    setCurrentRow(record);
    setTenantModal(true)
  }
  const onBiness = (record: APISystem.AccountItemDataType) =>{
    setCurrentRow(record);
    setBinessModal(true)
  }

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantManageTreeService({});
    if (tenantTreeResponse.success && tenantTreeResponse.data) {
      setTenantTreeData(tenantTreeResponse?.data);
      return tenantTreeResponse.data;
    } else {
      setTenantTreeData([]);
      return [];
    }
  };

  const onChangeTenant = (getTenantId: string) => {
    setTenantId(getTenantId);
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const closeRole = () =>{
    setCurrentRow({})
    setRoleModal(false)
  }
  const closeTenant = () =>{
    setCurrentRow({})
    setTenantModal(false)
  }
  const closeBiness = () =>{
    setCurrentRow({})
    setBinessModal(false)
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
                value: 'id',
              },
            }}
          />
        );
      },
    },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => onRole(record)}>
          Role
        </a>,
        <a key="edit" onClick={() => onEditTenant(record)}>
          Tenant
        </a>,
        <a key="edit" onClick={() => onBiness(record)}>
          Biness
        </a>,
        <a key="edit" onClick={() => onEdit(record)}>
          Edit
        </a>,
        currentAccountId !== record.accountId && (
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRow(record?.accountId || '');
            }}>
            <a key="delete">Delete</a>
          </PopconfirmPage>
        ),
      ],
    },
  ];

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

  const initType = async () => {
    const response = await enumsService();
    if (response?.success === true) {
      setAccountType(response?.data?.sysAccountType);
      setDataItemStatus(response?.data?.sysDataItemStatus);
    }
  };

  useEffect(() => {
    initType();
  }, []);

  return (
    <PageContainer>
      <ProTable<APISystem.AccountItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        formRef={refTableForm}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setIsEdit(false);
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
      {openModal && (
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
              // Because the newly added tenantId must be placed in the query condition box after the new saving,
              // the assigned tenantId can only be obtained by re-searching
              if (refTableForm.current){
                refTableForm.current.submit()
              }
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Name is required',
                  },
                ]}
                label={'Name'}
                name={'name'}
                placeholder={'Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="type"
                label={'Account Type'}
                rules={[
                  {
                    required: true,
                    message: 'Account Type is required',
                  },
                ]}
                request={async () => {
                  return accountType?.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
                allowClear={false}
              />
            </Col>
            <Col span={12} hidden={true}><ProFormText name="accountId" /></Col>
            <Col span={12}>
              <ProFormTreeSelect
                label="Tenant name"
                name="tenantId"
                placeholder="Please select"
                allowClear
                secondary
                disabled={isEdit}
                request={getTenantTreeRequest}
                fieldProps={{
                  treeDefaultExpandAll:true,
                  suffixIcon: null,
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
                    message: 'Tenant is required',
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                label={'User'}
                name="userId"
                placeholder="Please select"
                allowClear
                secondary
                disabled={isEdit}
                request={async () => {
                  const responseRole = await getUserManagePageService({});
                  if (responseRole.success === true && responseRole?.data?.content) {
                    return responseRole?.data?.content;
                  } else {
                    return [];
                  }
                }}
                fieldProps={{
                  fieldNames: {
                    label: 'username',
                    value: 'userId',
                  },
                }}
                rules={[
                  {
                    required: true,
                    message: 'User is required',
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormText label={'Identity'} name={'identity'} placeholder={'Identity'} />
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
          </Row>
        </ModalForm>
      )}

      {/*role modal*/}
      <RolePage currentRow={currentRow} roleModal={roleModal} tenantId={tenantId} closeRole={closeRole} actionRef={actionRef}></RolePage>
      {/*tenant modal*/}
      <TenantPage currentRow={currentRow} tenantModal={tenantModal} tenantId={tenantId} closeRole={closeTenant} actionRef={actionRef}></TenantPage>
      {/*tenant modal*/}
      <BinessPage currentRow={currentRow} binessModal={binessModal} tenantId={tenantId} closeRole={closeBiness} actionRef={actionRef}></BinessPage>
    </PageContainer>
  );
};

export default Account;
