import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormRadio,
  ProFormText,
  ProTable
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, message, Popconfirm, Space} from 'antd';
import React, {useRef, useState} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import {
  deletePermissionByIdService,
  getPermissionListService,
  savePermissionService
} from "@/services/system-service/permissionService";

const User: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.PermissionItemDataType>();

  const [selectedRowsState, setSelectedRows] = useState<APISystem.PermissionItemDataType[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const actionRef = useRef<ActionType>();

  const getList = async (params: API.PageParams) => {
    const response = await getPermissionListService({
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
    // {title: 'permissionId', dataIndex: 'permissionId'},
    {title: 'permissionName', dataIndex: 'permissionName'},
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
    },
    {
      title: 'status',
      dataIndex: 'status',
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
          current: currentPage,
          pageSize: pageSize,
          total: total,
          // showTotal: () => '',
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
