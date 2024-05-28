import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, message, Popconfirm, Space, Form, Select} from 'antd';
import React, {useRef, useState, useEffect} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import {
  deletePermissionByIdService,
  getPermissionListService,
  savePermissionService,
  getPermissionTypeService,
} from "@/services/system-service/permissionService";
import styles from './index.less';

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.PermissionItemDataType>();
  const [permissionTypeList, setPermissionTypeList] = useState([]);

  const [selectedRowsState, setSelectedRows] = useState<APISystem.PermissionItemDataType[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);

  const actionRef = useRef<ActionType>();

  const getList = async (params: API.PageParams,) => {
    const response = await getPermissionListService({
        page: params.current || 1,
        size: params.pageSize || DEFAULT_PAGE_SIZE,
        permissionType: params.permissionType?.map((param: any) => encodeURIComponent(param)).join(',') || [],
        status: params.status?.map((param: any) => encodeURIComponent(param)).join(',') || [],
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

  const initPermissionTypeChange = async () => {
    const response = await getPermissionTypeService();
    if (response?.success === true) {
      setPermissionTypeList(response?.data);
    }
  };

  useEffect(() => {
    initPermissionTypeChange()
  }, []);

  /**
   * @en-US Add node
   * @param fields
   */
  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await savePermissionService({ ...fields });
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
  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('Update');
    try {
      await savePermissionService(fields);
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
      await deletePermissionByIdService(id);
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

  const columns: ProColumns<APISystem.PermissionItemDataType>[] = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      hideInSearch: false,
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      hideInSearch: false,
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      hideInForm: true,
      // valueEnum: permissionTypeList,
      valueEnum: permissionTypeList.reduce((result, type) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <ProFormSelect
            mode="multiple"
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        )
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        ENABLE: {
          text: '启用',
          status: 'ENABLE',
        },
        FORBIDDEN: {
          text: '禁用',
          status: 'FORBIDDEN',
        },
        LOCKING: {
          text: '锁定',
          status: 'LOCKING',
        },
        EXPIRED: {
          text: '过期',
          status: 'EXPIRED',
        }
      },
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <ProFormSelect
            mode="multiple"
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        )
      },
    },
    {
      title: "Operating",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="EditBtn"
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
          onConfirm={async () => await onDeleteRequest(record?.permissionId || '')}
        >
          <a>Delete</a>
        </Popconfirm>
      ]
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.PermissionItemDataType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.permission}
        rowKey="id"
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
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          current: page,
          pageSize: size,
          total: total,
          showSizeChanger: true,
          onChange: (currentPageNumber, pageSizeNumber) => {
            setSize(pageSizeNumber);
            setPage(currentPageNumber);
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
            console.log('onFinish record', record);
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
          initialValues={{
            permissionId: currentRow?.permissionId,
            permissionName: currentRow?.permissionName,
            permissionCode: currentRow?.permissionCode,
            permissionType: currentRow?.permissionType,
            status: currentRow?.status,
          }}
        >
          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "Permission name is required",
                },
              ]}
              label={"Permission Name"}
              width="md"
              name="permissionName"
              placeholder={"Permission name"}
            />
            <ProFormText
              name="permissionCode"
              label={"Code"}
              width="md"
              placeholder={"Code"}
              rules={[
                {
                  required: true,
                  message: "Code is required",
                },
              ]}
            />

            <ProFormText
              label={"permissionId"}
              width="md"
              name="permissionId"
              hidden={true}
            />
          </Space>

          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "Permission Type is required",
                }
              ]}
              label={"Permission Type"}
              width="md"
              name="permissionType"
              placeholder={"Permission Type"}
            />
            <ProFormRadio.Group
              rules={[
                {
                  required: true,
                  message: "Status is required",
                },
              ]}
              initialValue={1}
              name="status"
              label={"Status"}
              options={[
                {
                  value: 0,
                  label: 'Disable',
                },
                {
                  value: 1,
                  label: 'Enable',
                },
              ]}
            />
          </Space>

        </ModalForm>
      }
    </PageContainer>
  );
};

export default User;
