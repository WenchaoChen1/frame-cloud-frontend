import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import Permissions from './permissions/index';
import {
  getAttributeManagePageService,
  getAttributeManageDetailService,
  updateAttributeManageService,
  attributeManageAssignedPermissionService,
} from '@/services/base-service/system-service/metadataService';
import {
  getPermissionTypeService,
} from '@/services/base-service/system-service/permissionService';
import { getAuthorizationGrantTypesService } from '@/services/base-service/identity-service/applicationDictionaryService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message, Space, Tooltip, TableColumnsType, Table } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useIntl } from "@@/exports";
import dayjs from "dayjs";

const Metadata: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [PermissOpenModal, setPermissOpenModal] = useState<boolean>(false);
  const [attributeId, setAttributeId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [permissionExpression, setPermissionExpression] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [permissionTypeList, setPermissionTypeList] = useState([]);

  const getList = async (params: any) => {
    if (params?.status) {
      if (params?.status === '1') {
        params.status = 'FORBIDDEN';
      } else if (params?.status === '2') {
        params.status = 'LOCKING';
      } else if (params?.status === '3') {
        params.status = 'EXPIRED';
      } else {
        params.status = 'ENABLE';
      }
    }
    const response = await getAttributeManagePageService({
      pageNumber: params.current || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      attributeCode: params?.attributeCode,
      status: params?.status,
      requestMethod: params?.requestMethod,
      description: params?.description,
      url: params?.url,
    });
    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      total = response?.data?.totalElements || 0;
    }
    setTotal(total);

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    try {
      await updateAttributeManageService({ ...fields });

      message.success('Update successfully');
      return true;
    } catch (error) {
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const nestedColumns: TableColumnsType<APISystem.MetadataListItemDataType> = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      key: 'permissionName',
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      valueType: 'select',
      key: 'permissionType',
      valueEnum: permissionTypeList.reduce((result, type) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
    },
    { title: 'createdDate', dataIndex: 'createdDate',render:(_,record)=> formatDate(record?.createdDate) },
    { title: 'updatedDate', dataIndex: 'updatedDate',render:(_,record)=> formatDate(record?.updatedDate) },
  ];

  const columns: ProColumns<APIIdentity.authorization>[] = [
    { title: intl.formatMessage({ id: 'metadata.list.interfaceName' }), dataIndex: 'requestMethod' },
    { title: 'Url', dataIndex: 'url', ellipsis: true, },
    { title: 'Description', dataIndex: 'description', ellipsis: true, },
    { title: intl.formatMessage({ id: 'metadata.list.default' }), dataIndex: 'attributeCode', ellipsis: true, },
    {
      title: intl.formatMessage({ id: 'metadata.list.expression' }),
      dataIndex: 'webExpression',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'application.list.status' }),
      dataIndex: 'status',
      valueType: 'select',
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
      render: (value: any, record: any) => {
        const { status } = record;
        if (status === 0) {
          return (
            <Tooltip title={'启用'}>
              <img src={require('@/images/status_0.png')} alt={value} />
            </Tooltip>
          );
        } else if (status === 1) {
          return (
            <Tooltip title={'禁用'}>
              <img src={require('@/images/status_1.png')} alt={value} />
            </Tooltip>
          );
        } else if (status === 2) {
          return (
            <Tooltip title={'锁定'}>
              <img src={require('@/images/status_2.png')} alt={value} />
            </Tooltip>
          );
        } else if (status === 3) {
          return (
            <Tooltip title={'过期'}>
              <img src={require('@/images/status_3.png')} alt={value} />
            </Tooltip>
          );
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.searchTable.actions' }),
      dataIndex: 'actions',
      search: false,
      render: (_, record) => [
        <a
          key='attributeId'
          onClick={() => {
            setPermissOpenModal(true);
            setAttributeId(record?.attributeId);
          }}
          style={{ marginRight: '10px' }}
        >
          Permissions
        </a>,
        <a
          key='attributeId'
          onClick={() => {
            setOpenModal(true);
            setIsEdit(true);
            setCurrentRow(record);
          }}
        >
          Edit
        </a>,
      ],
    },
  ];

  const editPermiss = async () => {
    const parms = {
      attributeId: attributeId || '',
      permissionIds: selectedPermissions || '',
    };
    try {
      await attributeManageAssignedPermissionService(parms);
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleSelectedPermissions = (newSelectedRowKeys: any) => {
    setSelectedPermissions(newSelectedRowKeys);
  };

  const initAuthorizationGrantTypes = async () => {
    const response = await getAuthorizationGrantTypesService();
    if (response?.success === true) {
      setPermissionExpression(response?.data?.permissionExpression);
    }
  };

  const initPermissionTypeChange = async () => {
    const response = await getPermissionTypeService();
    if (response?.success === true) {
      setPermissionTypeList(response?.data);
    }
  };

  useEffect(() => {
    initPermissionTypeChange();
    initAuthorizationGrantTypes();
  }, []);

  return (
    <PageContainer>
      <ProTable<APISystem.MetadataListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="attributeId"
        request={getList}
        columns={columns}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: (currentPageNumber, pageSizeNumber) => {
            setPageSize(pageSizeNumber);
            setCurrentPage(currentPageNumber);
          },
        }}
        expandable={{
          expandedRowRender: (record: any) => (
            <Table<APISystem.scorPermissionDataType>
              dataSource={record?.permissions}
              columns={nestedColumns}
              rowKey="attributeId"
            />
          ),
        }}
      />

      {openModal && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={openModal}
          onOpenChange={setOpenModal}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType);
            }

            if (response) {
              setOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          request={async () => {
            if (isEdit && currentRow) {
              const responsePayMethodInfo = await getAttributeManageDetailService(
                currentRow?.attributeId,
              );
              if (responsePayMethodInfo.success === true && responsePayMethodInfo.data) {
                return responsePayMethodInfo.data;
              }
            }
            return {
              id: '',
              clientId: '',
              secretCreated: '',
            };
          }}
        >
          <Space size={24}>
            <ProFormText
              label={'服务 Id'}
              width="md"
              name="serviceId"
              placeholder={'clientId'}
              disabled
            />

            <ProFormText
              name="requestMethod"
              label={'Request Method'}
              width="md"
              placeholder={'Request Method'}
              disabled
            />
          </Space>

          <Space size={24}>
            <ProFormText
              label={'URL'}
              width="md"
              name="url"
              placeholder={'URL'}
              disabled
            />

            <ProFormText
              name="attributeCode"
              label={'默认权限代码'}
              width="md"
              placeholder={'默认权限代码'}
              disabled
            />
          </Space>

          <Space size={24}>
            <ProFormSelect
              label={'权限表达式'}
              width="md"
              name="webExpression"
              placeholder={'权限表达式'}
              request={async () => {
                return permissionExpression?.map((item: any) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />

            <ProFormSelect
              label={intl.formatMessage({ id: 'application.list.status' })}
              width="md"
              name="status"
              placeholder={'status'}
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
          </Space>

          <Space size={24}>
            <ProFormTextArea
              name="description"
              width="md"
              label={'Description'}
              placeholder={'Please enter description'}
            />
            <ProFormText label={'attributeId'} width="md" name="attributeId" hidden={true} />
          </Space>
        </ModalForm>
      )}

      {PermissOpenModal && (
        <ModalForm
          title={'Permissions'}
          width="80%"
          open={PermissOpenModal}
          onOpenChange={setPermissOpenModal}
          onFinish={async () => {
            let response = await editPermiss();

            if (response) {
              setPermissOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <Permissions
            onSelectedPermissions={handleSelectedPermissions}
            Id={attributeId}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default Metadata;
