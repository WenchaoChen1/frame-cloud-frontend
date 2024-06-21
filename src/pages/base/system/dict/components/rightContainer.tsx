import styles from '@/pages/base/system/dict/index.less';
import commonStyle from '@/pages/common/index.less';
import {
  createDictService,
  deleteDictService,
  editDictService,
  getDictInfoService,
} from '@/services/base-service/system-service/dict';
import {
  ActionType,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { ConfigProvider, Form, message, Row, Space, Tabs } from 'antd';
import React, { Key, useEffect, useRef } from 'react';

const initFormData = {
  id: '',
  key: '',
  tenantId: '',
  parentId: '',
  name: '',
  code: '',
  status: 1,
  sort: 0,
  shortName: '',
  description: '',
};

type propsType = {
  refreshParent: () => void;
  isEdit: boolean;
  tenantId: string | undefined;
  dictionaryTreeData: APISystem.DictItemDataType[];
  selectDictionaryId: Key;
};

const RightContainer: React.FC<propsType> = (props) => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const deleteRequest = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteDictService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const columns: ProColumns<APISystem.DictItemDataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: 'Status',
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
        },
      },
    },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="EditBtn" onClick={() => {}}>
          Edit
        </a>,
        <a key="NewBtn" onClick={() => {}}>
          Add
        </a>,
        <a
          key="deleteRow"
          onClick={async () => {
            await deleteRequest(record?.id || '');
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  const getDetail = async () => {
    console.log('getDetail isEdit', props.selectDictionaryId, props.isEdit);

    if (!props.selectDictionaryId || props.isEdit === false) {
      form.setFieldsValue(initFormData);
      return initFormData;
    }

    const infoResponse = await getDictInfoService(props.selectDictionaryId);
    if (infoResponse.success === true && infoResponse.data) {
      form.setFieldsValue(infoResponse.data);
      return infoResponse.data;
    } else {
      form.setFieldsValue(initFormData);
      return initFormData;
    }
  };

  const onSaveForm = async (fields: APISystem.DictItemDataType) => {
    try {
      let response = undefined;
      if (props.isEdit) {
        response = await editDictService(fields);
      } else {
        fields.tenantId = props.tenantId;
        response = await createDictService(fields);
      }

      if (response.success === true) {
        message.success('Save successfully!');

        props.refreshParent();
      } else {
        message.error('Save failed, please try again!');
      }
    } catch (error) {
      message.error('Save exception, please try again!');
    }
  };

  const FormContent: React.FC = () => {
    return (
      <ProForm<APISystem.DictItemDataType>
        form={form}
        layout={'vertical'}
        onFinish={onSaveForm}
        className={styles.detailForm}
      >
        <Row>
          <ProFormText name="id" hidden={true} />
          <ProFormText name="tenantId" hidden={true} />
        </Row>

        <Space size={20}>
          <ProFormText
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}
            label={'Name'}
            name="name"
            width="md"
            placeholder={'name'}
          />

          <ProFormText
            rules={[
              {
                required: true,
                message: 'Code is required',
              },
            ]}
            label={'Code'}
            name="code"
            width="md"
          />
        </Space>

        <Space size={20}>
          <ProFormTreeSelect
            name="parentId"
            label={'Parent dictionary'}
            fieldProps={{
              treeData: props.dictionaryTreeData,
              filterTreeNode: true,
              showSearch: false,
              popupMatchSelectWidth: false,
              autoClearSearchValue: true,
              treeNodeFilterProp: 'title',
              fieldNames: {
                value: 'id',
                label: 'name',
              },
            }}
            width={'md'}
            placeholder="Please select parent"
            allowClear={false}
            secondary
            rules={[
              {
                required: true,
                message: 'Parent dictionary is required',
              },
            ]}
          />

          <ProFormDigit label={'Sort'} width="md" name="sort" placeholder={'Sort'} />
        </Space>

        <Space size={20}>
          <ProFormTextArea name="description" label={'Description'} width="md" />

          <ProFormRadio.Group
            name="status"
            label={'Status'}
            initialValue={1}
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
            rules={[
              {
                required: true,
                message: 'Status is required',
              },
            ]}
          />
        </Space>
      </ProForm>
    );
  };

  const TableTabItem: React.FC = () => {
    return (
      <ConfigProvider
        renderEmpty={() => (
          <div className={[commonStyle.justifyCenter, commonStyle.emptyList].join(' ')}>
            <p className={commonStyle.noDataListText}>No data were found</p>
          </div>
        )}
      >
        <ProTable<APISystem.DictItemDataType, APISystem.PageParams>
          rowKey="id"
          actionRef={actionRef}
          columns={columns}
          headerTitle={''}
          options={false}
        />
      </ConfigProvider>
    );
  };

  const DetailTabItem: React.FC = () => {
    return (
      <div className={styles.detailTabBox}>
        <FormContent />
      </div>
    );
  };

  useEffect(() => {
    getDetail();
  }, [props.selectDictionaryId, props.isEdit]);

  return (
    <Tabs
      items={[
        {
          label: `${props.isEdit ? 'Detail' : 'Add'}`,
          key: 'detail',
          children: <DetailTabItem />,
        },
        {
          label: `Table`,
          key: 'table',
          children: <TableTabItem />,
        },
      ]}
    />
  );
};

export default RightContainer;
