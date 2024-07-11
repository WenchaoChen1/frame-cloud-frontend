import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deletePermissionManageService,
  getPermissionManageDetailService,
  getPermissionManagePageService,
  getPermissionTypeService,
  insertPermissionManageService,
  updatePermissionManageService,
} from '@/services/base-service/system-service/permissionService';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, Access } from 'umi';
import { FormattedMessage} from '@umijs/max';
import { statusConversionType } from '@/utils/utils';
import { enumsService } from '@/services/base-service/system-service/commService';
import { Button, message, Table, TableColumnsType, Tooltip,Row,Col } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from "dayjs";
import { useIntl } from "@@/exports";
import PopconfirmPage from "@/pages/base/components/popconfirm";
import FunctionPermission from '@/pages/base/components/functionPermission/index'

const User: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.PermissionItemDataType>();
  const [permissionTypeList, setPermissionTypeList] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'createdDate': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

  const getList = async (params: APISystem.PermissionItemDataType) => {
    if (params?.status?.length > 0) {
      const list = await statusConversionType(params.status, dataItemStatus)
      params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
    }
    const response = await getPermissionManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      permissionType:
        params?.permissionType?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      status: params?.status,
      permissionName: params?.permissionName || '',
      permissionCode: params?.permissionCode || '',
    });

    let dataSource: APISystem.PermissionItemDataType[] = [];
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

  const initPermissionTypeChange = async () => {
    const response = await getPermissionTypeService();
    if (response?.success === true) {
      setPermissionTypeList(response?.data);
    }
  };

  useEffect(() => {
    initPermissionTypeChange();
  }, []);

  const getPermissionInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getPermissionManageDetailService(
        currentRow?.permissionId || '',
      );
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      permissionId: '',
      permissionCode: '',
      permissionType: '',
      permissionName: '',
      status: '',
    };
  };

  const handleAdd = async (fields: APISystem.PermissionItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertPermissionManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: APISystem.PermissionItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updatePermissionManageService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const onDeleteRequest = async (id: string) => {
    const hide = message.loading('delete...');

    try {
      await deletePermissionManageService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');
      actionRef.current?.reloadAndRest?.();
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const nestedColumns: TableColumnsType<APISystem.MetadataListItemDataType> = [
    { title: 'Permission interface', dataIndex: 'requestMethod' },
    { title: 'Url', dataIndex: 'url' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Default permission code', dataIndex: 'attributeCode' },
    {
      title: intl.formatMessage({ id: 'metadata.list.expression' }),
      dataIndex: 'webExpression',
      hideInSearch: true,
    },
    {
      title: 'Specific expressions',
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
  ];

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APISystem.PermissionItemDataType>[] = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      hideInSearch: false,
      ellipsis: true,
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      hideInForm: true,
      ellipsis: true,
      valueEnum: permissionTypeList.reduce((result: any, type: any) => {
          result[type] = {
            text: type,
            status: type,
          };
          return result;
        },
        {}),
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
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
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
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <FunctionPermission code="EditPermission">
          <a
            onClick={() => {
              setIsEdit(true);
              setCurrentRow(record);
              setOpenModal(true);
            }}
          >
            Edit
          </a>
        </FunctionPermission>,
        <FunctionPermission code="DeletePermission">
          <PopconfirmPage onConfirm={() => onDeleteRequest(record?.permissionId || '')}>
            <a>Delete</a>
          </PopconfirmPage>
        </FunctionPermission>,
      ],
    },
  ];

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
      <ProTable<APISystem.PermissionItemDataType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="permissionId"
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        toolBarRender={() => [
          <FunctionPermission code="AddPermission">
            <Button
              type="primary"
              onClick={() => {
                setIsEdit(false);
                setOpenModal(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>
          </FunctionPermission>
        ]}
        request={getList}
        columns={columns}
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
            <Table<APISystem.PerScopeDataType>
              dataSource={record?.sysAttributes}
              columns={nestedColumns}
              rowKey="permissionId"
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
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType);
            }
            console.log('onFinish response', response);

            if (response) {
              setOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          request={getPermissionInfoRequest}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Permission name is required',
                  },
                ]}
                label={'Permission Name'}
                name="permissionName"
                placeholder={'Permission name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="permissionCode"
                label={'Code'}
                placeholder={'Code'}
                rules={[
                  {
                    required: true,
                    message: 'Code is required',
                  },
                ]}
              />
            </Col>
            <Col span={12} hidden={true} >
              <ProFormText label={'permissionId'} width="md" name="permissionId"/>
            </Col>
            <Col span={12}>
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'Permission Type is required',
                  },
                ]}
                label={'Permission Type'}
                name="permissionType"
                placeholder={'Permission Type'}
                options={permissionTypeList}
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
    </PageContainer>
  );
};

export default User;
