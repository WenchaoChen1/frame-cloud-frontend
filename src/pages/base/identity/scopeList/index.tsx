import Permissions from './permissions/index';
import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteScopeManageService,
  getScopeManageDetailService,
  getScopeManagePageService,
  insertScopeManageService,
  updateScopeManageAssignedPermissionService,
  updateScopeManageService,
} from '@/services/base-service/identity-service/scopeService';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { useIntl } from "@@/exports";
import { Button, message, Space,Row,Col } from 'antd';
import React, { useRef, useState } from 'react';
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const Scope: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [PermissOpenModal, setPermissOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [scopeId, setScopeId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: APIIdentity.scopeItemType) => {
    const response = await getScopeManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      scopeName: params?.scopeName || '',
      scopeCode: params?.scopeCode || '',
    });

    let dataSource: APIIdentity.scopeItemType[] = [];
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

  const handleUpdate = async (fields: APIIdentity.scopeItemType) => {
    const hide = message.loading('Update');
    try {
      await updateScopeManageService(fields);
      hide();
      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const getScopeInfoRequest = async () => {
    if (isEdit && currentRow?.scopeId) {
      const accountDetailResponse = await getScopeManageDetailService(currentRow?.scopeId || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      scopeName: '',
      scopeCode: '',
      scopeId: '',
    };
  };

  const handleAdd = async (fields: APIIdentity.scopeItemType) => {
    const hide = message.loading('add');
    delete fields?.id;
    try {
      await insertScopeManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const editPermiss = async () => {
    const parms = {
      scopeId: scopeId || '',
      permissions: selectedPermissions || '',
    };
    try {
      await updateScopeManageAssignedPermissionService(parms);
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const deleteUserRequest = async (id: string) => {
    const hide = message.loading('delete...');

    try {
      await deleteScopeManageService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');

      setCurrentRow({});
      actionRef.current?.reloadAndRest?.();

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
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

  const columns: ProColumns<APIIdentity.scopeItemType>[] = [
    { title: 'scopeName', dataIndex: 'scopeName'},
    { title: 'scopeCode', dataIndex: 'scopeCode'},
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate)},
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate)},
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key={record?.scopeId}
          onClick={() => {
            setPermissOpenModal(true);
            setScopeId(record?.scopeId);
          }}
        >
          Permissions
        </a>,
        <a
          key='Edit'
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            setOpenModal(true);
          }}
        >
          Edit
        </a>,
        <div key='Delete'>
          <PopconfirmPage onConfirm={async () => await deleteUserRequest(record?.scopeId || '')}>
            <a>Delete</a>
          </PopconfirmPage>
        </div>
      ],
    },
  ];

  const handleSelectedPermissions = (permissions: any) => {
    setSelectedPermissions(permissions);
  };

  return (
    <PageContainer>
      <ProTable<APIIdentity.scopeItemType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        rowKey="scopeId"
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
            setCurrentRow(selectedRows);
          },
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
      />

      {openModal && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={openModal}
          onOpenChange={setOpenModal}
          request={getScopeInfoRequest}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APIIdentity.scopeItemType);
            } else {
              response = await handleAdd(record as APIIdentity.scopeItemType);
            }

            if (response) {
              setOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
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
                    message: 'scopeName is required',
                  },
                ]}
                label={'scopeName'}
                name="scopeName"
                placeholder={'scopeName'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="scopeCode"
                label={'scopeCode'}
                placeholder={'scopeCode'}
                rules={[
                  {
                    required: true,
                    message: 'scopeCode is required',
                  },
                ]}
              />
            </Col>
            <Col span={12} hidden={true}><ProFormText label={'scopeId'} name="scopeId"  /></Col>
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
            Id={scopeId}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default Scope;
