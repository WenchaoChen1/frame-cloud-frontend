import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteMenuManageService,
  getMenuManageDetailService,
  getMenuManageTreeService,
  insertMenuManageService,
  updateMenuManageService,
} from '@/services/base-service/system-service/menuService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { message, Space } from 'antd';
import React, { useRef, useState } from 'react';

const MenuList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [defaultExpanded, setDefaultExpanded] = useState([]);

  const getMenuInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getMenuManageDetailService(currentRow?.id || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }

    return {
      menuName: '',
      code: '',
      id: '',
      sort: '',
      type: '',
      status: '',
    };
  };

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertMenuManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updateMenuManageService(fields);
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
      await deleteMenuManageService(id);
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

  const columns: ProColumns<APISystem.MenuListItemDataType>[] = [
    {
      title: 'Menu name',
      dataIndex: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: 'Path',
      dataIndex: 'path',
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
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
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
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
      title: 'Type',
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Menu',
        },
        1: {
          text: 'Button',
        },
      },
    },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="EditBtn"
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            console.log('Edit record', record);
            handleModalVisible(true);
          }}
        >
          Edit
        </a>,
        <a
          key="NewBtn"
          onClick={() => {
            setIsEdit(false);
            setCurrentRow({ parentId: record?.id ? record.id : '' });
            handleModalVisible(true);
          }}
        >
          Add
        </a>,
        <a
          key="deleteRow"
          onClick={async () => {
            await deleteRow(record?.id || '');
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  const getList = async (params: API.PageParams) => {
    params.status = params?.status?.map((item: any) => {
      if (item === '1') {
        return (item = 'FORBIDDEN');
      } else if (item === '2') {
        return (item = 'LOCKING');
      } else if (item === '3') {
        return (item = 'EXPIRED');
      } else {
        return (item = 'ENABLE');
      }
    });

    const response = await getMenuManageTreeService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      name: params?.name,
      path: params?.path,
      status: params?.status?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      type: params?.type || '',
    });

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data || [];
    }

    setTotal(total);

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  return (
    <PageContainer>
      <ProTable<APISystem.MenuListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        request={getList}
        columns={columns}
        expandable={{ defaultExpandedRowKeys: defaultExpanded }}
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

      {modalVisible && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={modalVisible}
          request={getMenuInfoRequest}
          onOpenChange={handleModalVisible}
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType);
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType);
            }
            console.log('onFinish response', response);

            if (response) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          initialValues={{
            id: currentRow?.id,
            name: currentRow?.name,
            parentId: currentRow?.parentId,
            code: currentRow?.code,
            path: currentRow?.path,
            location: currentRow?.location,
            permission: currentRow?.permission,
            sort: currentRow?.sort,
            status: currentRow?.status,
            hidden: currentRow?.hidden,
            usageType: currentRow?.usageType,
            platformUse: currentRow?.platformUse,
            tenantEnable: currentRow?.tenantEnable,
            type: currentRow && currentRow.type,
            url: currentRow?.url,
            description: currentRow?.description,
          }}
        >
          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Menu name is required',
                },
              ]}
              label={'Menu name'}
              width="md"
              name="menuName"
              placeholder={'Menu name'}
            />
            <ProFormText
              name="code"
              label={'Code'}
              width="md"
              placeholder={'Code'}
              rules={[
                {
                  required: true,
                  message: 'Code is required',
                },
              ]}
            />

            <ProFormText label={'id'} width="md" name="id" hidden={true} />
            <ProFormText label={'parentId'} width="md" name="parentId" hidden={true} />
          </Space>

          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Name is required',
                },
              ]}
              label={'Name'}
              width="md"
              name="name"
              placeholder={'Name'}
            />
            <ProFormText label={'Icon'} width="md" name="icon" placeholder={'Icon'} />
          </Space>

          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'Path is required',
                },
              ]}
              label={'Path'}
              width="md"
              name="path"
              placeholder={'Path'}
            />

            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: 'Sort is required',
                },
              ]}
              label={'Sort'}
              width="md"
              name="sort"
              placeholder={'Sort'}
            />
          </Space>

          <Space size={20}>
            <ProFormSelect
              name="type"
              width="md"
              label={'Type'}
              rules={[
                {
                  required: true,
                  message: 'Type is required',
                },
              ]}
              initialValue={0}
              options={[
                {
                  value: 1,
                  label: 'Button',
                },
                {
                  value: 0,
                  label: 'Menu',
                },
              ]}
            />

            <ProFormSelect
              name="location"
              label={'Location'}
              width="md"
              rules={[
                {
                  required: true,
                  message: 'Location is required',
                },
              ]}
              allowClear={false}
              initialValue={'LEFT-MENU'}
              options={[
                {
                  value: 'LEFT-MENU',
                  label: 'Left Menu',
                },
                {
                  value: 'OTHER',
                  label: 'Other',
                },
              ]}
            />
          </Space>

          <Space size={20} style={{ alignItems: 'baseline' }}>
            <ProFormSelect
              width="md"
              rules={[
                {
                  required: true,
                  message: 'Status is required',
                },
              ]}
              name="status"
              label={'Status'}
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

            <ProFormTextArea
              name="description"
              width="md"
              label={'Description'}
              placeholder={'Please enter at least five characters'}
            />
          </Space>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default MenuList;
