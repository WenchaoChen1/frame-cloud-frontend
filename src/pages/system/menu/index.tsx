import {
  getMenuTreeService,
  createMenuService,
  editMenuService,
  deleteMenuService,
} from '@/services/system-service/menu';
import {PlusOutlined} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormRadio, ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormDigit
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';

const MenuList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [, setSelectedRows] = useState<APISystem.MenuListItemDataType[]>([]);

  /**
   * @en-US Add node
   * @param fields
   */
  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await createMenuService({ ...fields });
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
      await editMenuService(fields);
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
      await deleteMenuService(id);
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
    // {
    //   title: 'Location',
    //   dataIndex: 'location',
    // },
    {
      title: 'Sort',
      dataIndex: 'sort',
    },
    {
      title: "Status",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Disable',
          status: 'Processing',
        },
        1: {
          text: 'Enable',
          status: 'Success',
        }
      },
    },
    {
      title: "Type",
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Menu',
        },
        1: {
          text: 'Button',
        }
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
            setCurrentRow({parentId: record?.id ? record.id : ''});
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
        >Delete</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<APISystem.MenuListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        // pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setIsEdit(false);
              setCurrentRow({parentId: '0'});
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getMenuTreeService}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {
        modalVisible &&
        <ModalForm
          title={ isEdit ? 'Edit' :  'New'}
          width="800px"
          open={modalVisible}
          onOpenChange={handleModalVisible}
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
                  message: "Menu name is required",
                },
              ]}
              label={"Menu name"}
              width="md"
              name="name"
              placeholder={"Menu name"}
            />
            <ProFormText
              name="code"
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
              label={"id"}
              width="md"
              name="id"
              hidden={true}
            />
            <ProFormText
              label={"parentId"}
              width="md"
              name="parentId"
              hidden={true}
            />
          </Space>

          <Space size={20}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "Path is required",
                }
              ]}
              label={"Path"}
              width="md"
              name="path"
              placeholder={"Path"}
            />

            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: "Sort is required",
                },
              ]}
              label={"Sort"}
              width="md"
              name="sort"
              placeholder={"Sort"}
            />
          </Space>

          <Space size={20}>
            <ProFormSelect
              name="type"
              width="md"
              label={"Type"}
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
              initialValue={0}
              options={[
                {
                  value: 1,
                  label: 'Button'
                },
                {
                  value: 0,
                  label: 'Menu'
                }
              ]}
            />

            <ProFormSelect
              name="location"
              label={"Location"}
              width="md"
              rules={[
                {
                  required: true,
                  message: "Location is required",
                },
              ]}
              allowClear={false}
              initialValue={'LEFT-MENU'}
              options={[
                {
                  value: 'LEFT-MENU',
                  label: 'Left Menu'
                },
                {
                  value: 'OTHER',
                  label: 'Other'
                }
              ]}
            />
          </Space>

          <Space size={20}>
            <ProFormTextArea
              name="description"
              width="md"
              label={"Description"}
              placeholder={'Please enter at least five characters'}
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
}

export default MenuList;
