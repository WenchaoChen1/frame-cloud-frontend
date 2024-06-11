import {
  getApplicationListService,
  addApplicationService,
  getAuthorizationGrantTypesService,
  editPermisService,
} from '@/services/identity-service/application';
import type {ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ModalForm,
  ProFormText,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import type { InputNumberProps } from 'antd';
import {Button, message, Popconfirm, Space, Divider, InputNumber} from 'antd';
import React, {useRef, useState, useEffect} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import ScopePermissions from '@/components/ScopePermissions/scopePermissions';
import styles from './index.less';
import moment from 'moment';

const Application: React.FC = () => {
  const initialData = {
    accessTokenValidity: 'PT3S',
    refreshTokenValidity: 'PT3S',
    authorizationCodeValidity: 'PT3S',
    deviceCodeValidity: 'PT3S',
  };
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [authorTypes, setAuthorTypes] = useState([]);
  const [authenticationMethod, setAuthenticationMethod] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const dayType = [
    {
      label: '天',
      value: 'days',
    },
    {
      label: '小时',
      value: 'hours',
    },
    {
      label: '分钟',
      value: 'minutes',
    },
    {
      label: '秒',
      value: 'seconds',
    }
  ]

  const getList = async (params: API.PageParams) => {
    const response = await getApplicationListService({
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

  // Echoing form data
  const parseAccessTokenValidity = (duration) => {
    const regex = /PT((\d+)D)?((\d+)H)?((\d+)M)?((\d+)S)?/;
    const match = duration.match(regex);
  
    let days = parseInt(match[2]) || 0;
    let hours = parseInt(match[4]) || 0;
    let minutes = parseInt(match[6]) || 0;
    let seconds = parseInt(match[8]) || 0;

    if (hours >= 24) {
      days += Math.floor(hours / 24);
      hours %= 24;
    }
  
    let result = "";
  
    if (days > 0) {
      result += `${days} days`;
    }
  
    if (hours > 0) {
      result += `${hours} hours`;
    }
  
    if (minutes > 0) {
      result += `${minutes} minutes`;
    }
  
    if (seconds > 0) {
      result += `${seconds} seconds`;
    }
  
    return result.trim();
  };
  

  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    // const hide = message.loading('Update');
    fields.accessTokenValidity = mergeAndFormatValidity(fields?.accessTokenValidity, fields?.dayType1);
    fields.refreshTokenValidity = mergeAndFormatValidity(fields?.refreshTokenValidity, fields?.dayType2);
    fields.authorizationCodeValidity = mergeAndFormatValidity(fields?.authorizationCodeValidity, fields?.dayType3);
    fields.deviceCodeValidity = mergeAndFormatValidity(fields?.deviceCodeValidity, fields?.dayType4);

    delete fields.dayType1;
    delete fields.dayType2;
    delete fields.dayType3;
    delete fields.dayType4;
    try {
      await addApplicationService({ ...fields });

      message.success('Update successfully');
      return true;
    } catch (error) {
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const mergeAndFormatValidity = (validity, dayType) => {
    const duration = moment.duration(validity, dayType);
    const iso8601Format = duration.toISOString();
    return iso8601Format;
  };

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    delete fields.id;
    fields.accessTokenValidity = mergeAndFormatValidity(fields?.accessTokenValidity, fields?.dayType1);
    fields.refreshTokenValidity = mergeAndFormatValidity(fields?.refreshTokenValidity, fields?.dayType2);
    fields.authorizationCodeValidity = mergeAndFormatValidity(fields?.authorizationCodeValidity, fields?.dayType3);
    fields.deviceCodeValidity = mergeAndFormatValidity(fields?.deviceCodeValidity, fields?.dayType4);

    delete fields.dayType1;
    delete fields.dayType2;
    delete fields.dayType3;
    delete fields.dayType4;

    try {
      await addApplicationService({ ...fields });
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const columns: ProColumns<APIIdentity.authorization>[] = [
    {title: 'applicationName', dataIndex: 'applicationName'},
    // {title: 'abbreviation', dataIndex: 'abbreviation'},
    {
      title: 'clientAuthenticationMethods',
      dataIndex: 'clientAuthenticationMethods',
      hideInForm: true,
      valueEnum: authenticationMethod.reduce((result, type) => {
        result[type.value] = {
          text: type.text,
          status: type.value,
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
      title: 'authorizationGrantTypes',
      dataIndex: 'authorizationGrantTypes',
      hideInForm: true,
      valueEnum: authorTypes.reduce((result, type) => {
        result[type.value] = {
          text: type.text,
          status: type.value,
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
    { title: 'accessTokenValidity', dataIndex: 'accessTokenValidity', render: (text) => formatDuration(text) },
    { title: 'refreshTokenValidity', dataIndex: 'refreshTokenValidity', render: (text) => formatDuration(text) },
    { title: 'authorizationCodeValidity', dataIndex: 'authorizationCodeValidity', render: (text) => formatDuration(text) },
    { title: 'deviceCodeValidity', dataIndex: 'deviceCodeValidity', render: (text) => formatDuration(text) },
    // {title: 'status', dataIndex: 'status'},
    {
      title: "actions",
      dataIndex: 'actions',
      render: (_, record) =>[
        <a
          key={record?.id}
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record, '数据是啥')
            console.log(parseAccessTokenValidity(record?.accessTokenValidity), '看一看')
            setOpenModal(true);
          }}
        >
          Edit
        </a>
      ]
    },
  ];

  const handleSelectedPermissions = (permissions) => {
    setSelectedPermissions(permissions);
  };

  const formatDuration = (duration) => {
    const momentDuration = moment.duration(duration);
    const hours = momentDuration.hours();
    const minutes = momentDuration.minutes();
    const seconds = momentDuration.seconds();
  
    let formattedDuration = "";
  
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      formattedDuration += `${days}天 `;
      const remainingHours = hours % 24;
      if (remainingHours > 0) {
        formattedDuration += `${remainingHours}小时 `;
      }
    } else if (hours > 0) {
      formattedDuration += `${hours}小时 `;
    }
  
    if (minutes > 0) {
      formattedDuration += `${minutes}分钟 `;
    }
  
    if (seconds > 0) {
      const formattedSeconds = seconds > 0 ? seconds.toFixed(1) : seconds;
      formattedDuration += `${formattedSeconds}秒`;
    }
  
    return formattedDuration.trim();
  };

  const initAuthorizationGrantTypes = async () => {
    const response = await getAuthorizationGrantTypesService();
    if (response?.success === true) {
      console.log(response, '88888')
      setAuthorTypes(response?.data?.grantType);
      setAuthenticationMethod(response?.data?.authenticationMethod);
    }
  };

  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
  };

  useEffect(() => {
    initAuthorizationGrantTypes()
  }, []);

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.scopeListStyle}
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
            id: currentRow?.id,
            applicationName: currentRow?.applicationName,
            abbreviation: currentRow?.abbreviation,
            authorizationGrantTypes: currentRow?.authorizationGrantTypes,
            clientAuthenticationMethods: currentRow?.clientAuthenticationMethods,
            accessTokenValidity: parseAccessTokenValidity(currentRow?.accessTokenValidity)?.split(' ')?.[0],
            dayType1: parseAccessTokenValidity(currentRow?.accessTokenValidity)?.split(' ')?.[1],
            refreshTokenValidity: parseAccessTokenValidity(currentRow?.refreshTokenValidity)?.split(' ')?.[0],
            dayType2: parseAccessTokenValidity(currentRow?.refreshTokenValidity)?.split(' ')?.[1],
            authorizationCodeValidity: parseAccessTokenValidity(currentRow?.authorizationCodeValidity)?.split(' ')?.[0],
            dayType3: parseAccessTokenValidity(currentRow?.authorizationCodeValidity)?.split(' ')?.[1],
            deviceCodeValidity: parseAccessTokenValidity(currentRow?.deviceCodeValidity)?.split(' ')?.[0],
            dayType4: parseAccessTokenValidity(currentRow?.deviceCodeValidity)?.split(' ')?.[1],
          }}
        >
          <Space size={24}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: "applicationName is required",
                },
              ]}
              label={"applicationName"}
              width="md"
              name="applicationName"
              placeholder={"applicationName"}
            />

            <ProFormText
              name="abbreviation"
              label={"abbreviation"}
              width="md"
              placeholder={"abbreviation"}
            />

            <ProFormText
              label={"id"}
              width="md"
              name="id"
              hidden={true}
            />
          </Space>

          <Space size={24}>
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: "authorizationGrantTypes Type is required",
                }
              ]}
              mode="multiple"
              label={"authorizationGrantTypes"}
              width="md"
              name="authorizationGrantTypes"
              placeholder={"authorizationGrantTypes"}
              request={async () => {
                return authorTypes.map((item) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />

            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: "clientAuthenticationMethods Type is required",
                }
              ]}
              mode="multiple"
              label={"clientAuthenticationMethods"}
              width="md"
              name="clientAuthenticationMethods"
              placeholder={"clientAuthenticationMethods"}
              request={async () => {
                return authenticationMethod.map((item) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />
          </Space>

          <Divider plain>令牌设置(Token Settings)</Divider>

          <Space size={24}>
            <ProForm.Item
              label="accessTokenValidity"
              name="accessTokenValidity"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} onChange={onChange} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType1"
              placeholder={"单位"}
              options={dayType}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label="refreshTokenValidity"
              name="refreshTokenValidity"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} onChange={onChange} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType2"
              placeholder={"单位"}
              options={dayType}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label="authorizationCodeValidity"
              name="authorizationCodeValidity"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} onChange={onChange} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType3"
              placeholder={"单位"}
              options={dayType}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label="deviceCodeValidity"
              name="deviceCodeValidity"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} onChange={onChange} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType4"
              placeholder={"单位"}
              options={dayType}
            />
          </Space>
 
        </ModalForm>
      }
    </PageContainer>
  );
};

export default Application;
