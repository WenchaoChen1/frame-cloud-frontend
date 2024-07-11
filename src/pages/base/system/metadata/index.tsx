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
import { enumsService } from '@/services/base-service/system-service/commService';
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
import { message, Tooltip, TableColumnsType, Table,Row,Col } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { statusConversionType } from '@/utils/utils';
import { useIntl } from "@@/exports";
import dayjs from "dayjs";
import FunctionPermission from '@/pages/base/components/functionPermission/index'

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
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);

  const getList = async (params: APISystem.MetadataListItemDataType) => {
    if (params?.status?.length > 0) {
      const list = await statusConversionType(params.status, dataItemStatus)
      params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
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
    let dataSource: APISystem.MetadataListItemDataType[] = [];
    let dataTotal = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      dataTotal = response?.data?.totalElements || 0;
    }
    setTotal(dataTotal);

    return {
      data: dataSource,
      success: true,
      total: dataTotal,
    };
  };

  const handleUpdate = async (fields: APISystem.MetadataListItemDataType) => {
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
      valueEnum: permissionTypeList.reduce((result: any, type: any) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
    },
    { title: 'createdDate', dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: 'updatedDate', dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
  ];

  const columns: ProColumns<APISystem.MetadataListItemDataType>[] = [
    { 
      title: intl.formatMessage({ id: 'metadata.list.interfaceName' }),
      dataIndex: 'requestMethod',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { 
      title: 'Url',
      dataIndex: 'url',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { 
      title: 'Description',
      dataIndex: 'description',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { 
      title: intl.formatMessage({ id: 'metadata.list.default' }),
      dataIndex: 'attributeCode',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: intl.formatMessage({ id: 'metadata.list.expression' }),
      dataIndex: 'webExpression',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'application.list.status' }),
      dataIndex: 'status',
      valueType: 'select',
      width: '80px',
      valueEnum: dataItemStatus?.reduce((result: any, type: any) => {
        result[type?.value] = {
          text: type?.name,
          status: type?.value,
        };
        return result;
      }, {}),
      renderFormItem: (_, { ...rest }) => {
        return (
          <ProFormSelect
            placeholder={'Please Select'}
            mode="multiple"
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        );
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
      width: '120px',
      fixed: 'right',
      render: (_, record: any) => [
        <FunctionPermission code="PermissionsMetadata">
          <a
            onClick={() => {
              setPermissOpenModal(true);
              setAttributeId(record?.attributeId);
            }}
            style={{ marginRight: '10px' }}
          >
            Permissions
          </a>
        </FunctionPermission>,
        <FunctionPermission code="EditMetadata">
          <a
            onClick={() => {
              setOpenModal(true);
              setIsEdit(true);
              setCurrentRow(record);
            }}
          >
            Edit
          </a>
        </FunctionPermission>,
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
      <ProTable<APISystem.MetadataListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="attributeId"
        request={getList}
        columns={columns}
        scroll={{ x: 'max-content' }}
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
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                label={'服务 Id'}
                name="serviceId"
                placeholder={'clientId'}
                disabled
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="requestMethod"
                label={'Request Method'}
                placeholder={'Request Method'}
                disabled
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={'URL'}
                name="url"
                placeholder={'URL'}
                disabled
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="attributeCode"
                label={'默认权限代码'}
                placeholder={'默认权限代码'}
                disabled
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                label={'权限表达式'}
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
            </Col>
            <Col span={12}>
              <ProFormSelect
                label={intl.formatMessage({ id: 'application.list.status' })}
                name="status"
                placeholder={'status'}
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
            <Col span={12}>
              <ProFormTextArea
                name="description"
                label={'Description'}
                placeholder={'Please enter description'}
              />
            </Col>
            <Col span={12} hidden={true}><ProFormText label={'attributeId'} width="md" name="attributeId"/></Col>
          </Row>
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
