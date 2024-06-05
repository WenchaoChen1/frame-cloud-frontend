import {
  getAllUserListService,
  editUserService,
  deleteUserService,
  editPermisService,
} from '@/services/identity-service/scope';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, message, Popconfirm, Space} from 'antd';
import React, {useRef, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import ScopePermissions from '@/components/ScopePermissions/scopePermissions';
import styles from './index.less';

const Scope: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [PermissOpenModal, setPermissOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [scopeId, setScopeId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);



  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: API.PageParams) => {
    const response = await getAllUserListService({
        pageNumber: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE
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
    const hide = message.loading('Update');
    try {
      await editUserService(fields);
      hide();

      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await editUserService({ ...fields });
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
    }
    try {
      await editPermisService(parms);
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
      await deleteUserService(id);
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
  }


  const columns: ProColumns<APIIdentity.authorization>[] = [
    {title: 'scopeName', dataIndex: 'scopeName', width: '45%'},
    {title: 'scopeCode', dataIndex: 'scopeCode', width: '45%'},
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>[
        <a
          key={record?.scopeId}
          onClick={() => {
            setPermissOpenModal(true);
            setScopeId(record?.scopeId);
            setSelectedPermissions(record?.permissions);
          }}
        >
          Permissions
        </a>,
        <a
          key={record?.scopeId}
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            setOpenModal(true);
          }}
        >
          Edit
        </a>,
        <Popconfirm
          title="Sure to delete?"
          onConfirm={async () => await deleteUserRequest(record?.scopeId || '')}
        >
          <a>Delete</a>
        </Popconfirm>
      ]
    },
  ];

  const handleSelectedPermissions = (permissions) => {
    setSelectedPermissions(permissions);
  };

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.scopeListStyle}
        rowKey="scopeId"
        options={false}
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
          }
        }}
      />

      {
        openModal &&
        <ModalForm
          title={ isEdit ? 'Edit' :  'New'}
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

            if (response) {
              setOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          initialValues={{
            scopeId: currentRow?.scopeId,
            scopeName: currentRow?.scopeName,
            scopeCode: currentRow?.scopeCode,
          }}
        >
          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "scopeName is required",
                },
              ]}
              label={"scopeName"}
              width="md"
              name="scopeName"
              placeholder={"scopeName"}
            />
            <ProFormText
              name="scopeCode"
              label={"scopeCode"}
              width="md"
              placeholder={"scopeCode"}
              rules={[
                {
                  required: true,
                  message: "scopeCode is required",
                },
              ]}
            />

            <ProFormText
              label={"scopeId"}
              width="md"
              name="scopeId"
              hidden={true}
            />
          </Space>
 
        </ModalForm>
      }

      {
        PermissOpenModal &&
        <ModalForm
          title={'Permissions'}
          width="70%"
          open={PermissOpenModal}
          onOpenChange={setPermissOpenModal}
          onFinish={async (record) => {
            let response = await editPermiss();

            if (response) {
              setPermissOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ScopePermissions onSelectedPermissions={handleSelectedPermissions} selectedPermissions={selectedPermissions} scopeId={scopeId} />
        </ModalForm>
      }
    </PageContainer>
  );
};

export default Scope;
