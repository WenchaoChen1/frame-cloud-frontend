import {
  getApplicationListService,
  addApplicationService,
  getAuthorizationGrantTypesService,
  deleteApplicationService,
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
import {Button, message, Space, Divider, InputNumber, Tooltip, Switch, DatePicker, Popconfirm } from 'antd';
import React, {useRef, useState, useEffect} from 'react';
import {PlusOutlined} from "@ant-design/icons";
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import styles from './index.less';
import moment from 'moment';

const Application: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [authorTypes, setAuthorTypes] = useState([]);
  const [applicationTypeData, setApplicationTypeData] = useState([]);
  const [idTokenData, setIdTokenData] = useState([]);
  const [authenticationMethod, setAuthenticationMethod] = useState([]);

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
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
        applicationName: params?.applicationName,
        clientAuthenticationMethods: params?.clientAuthenticationMethods?.map((param: any) => encodeURIComponent(param)).join(',') || [],
        authorizationGrantTypes: params?.authorizationGrantTypes?.map((param: any) => encodeURIComponent(param)).join(',') || [],
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
    const match = duration?.match(regex);
  
    let days = parseInt(match?.[2]) || 0;
    let hours = parseInt(match?.[4]) || 0;
    let minutes = parseInt(match?.[6]) || 0;
    let seconds = parseInt(match?.[8]) || 0;

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
    fields.accessTokenValidity = mergeAndFormatValidity(fields?.accessTokenValidity, fields?.dayType1);
    fields.refreshTokenValidity = mergeAndFormatValidity(fields?.refreshTokenValidity, fields?.dayType2);
    fields.authorizationCodeValidity = mergeAndFormatValidity(fields?.authorizationCodeValidity, fields?.dayType3);
    fields.deviceCodeValidity = mergeAndFormatValidity(fields?.deviceCodeValidity, fields?.dayType4);

    fields.clientSecretExpiresAt = new Date(fields?.clientSecretExpiresAt).toISOString();

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

  const handleAdd = async (fields: any) => {
    delete fields.applicationId;
    fields.accessTokenValidity = mergeAndFormatValidity(fields?.accessTokenValidity, fields?.dayType1);
    fields.refreshTokenValidity = mergeAndFormatValidity(fields?.refreshTokenValidity, fields?.dayType2);
    fields.authorizationCodeValidity = mergeAndFormatValidity(fields?.authorizationCodeValidity, fields?.dayType3);
    fields.deviceCodeValidity = mergeAndFormatValidity(fields?.deviceCodeValidity, fields?.dayType4);
    
    fields.clientSecretExpiresAt = new Date(fields?.clientSecretExpiresAt).toISOString();

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
    {title: 'abbreviation', dataIndex: 'abbreviation'},
    {
      title: 'authorizationGrantTypes',
      dataIndex: 'authorizationGrantTypes',
      hideInForm: true,
      width: '270px',
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
      render: (_, record) => {
        const grantTypes = record.authorizationGrantTypes;
        const images = grantTypes.map((type: any) => {
          let imageUrl;
          let tooltipText;
          if (type === 'authorization_code') {
            imageUrl = require('@/images/application_4.png');
            tooltipText = '授权码认证';
          } else if (type === 'refresh_token') {
            imageUrl = require('@/images/application_5.png');
            tooltipText = '刷新令牌认证';
          } else if (type === 'client_credentials') {
            imageUrl = require('@/images/application_6.png');
            tooltipText = '客户端凭证认证';
          } else if (type === 'urn:ietf:params:oauth:grant-type:device_code') {
            imageUrl = require('@/images/application_3.png');
            tooltipText = '设备激活码认证';
          } else if (type === 'urn:ietf:params:oauth:grant-type:jwt-bearer') {
            imageUrl = require('@/images/application_7.png');
            tooltipText = 'JWT bearer 认证';
          } else if (type === 'password') {
            imageUrl = require('@/images/application_1.png');
            tooltipText = '密码认证';
          } else if (type === 'social_credentials') {
            imageUrl = require('@/images/application_2.png');
            tooltipText = '社交化认证';
          }
    
          return (
            <Tooltip title={tooltipText} key={type}>
              <img src={imageUrl} alt={type} style={{ paddingRight: '8px' }} />
            </Tooltip>
          );
        });
    
        return <div>{images}</div>;
      },
    },
    { title: 'accessTokenValidity', search: false, dataIndex: 'accessTokenValidity', render: (text) => formatDuration(text) },
    { title: 'refreshTokenValidity', search: false, dataIndex: 'refreshTokenValidity', render: (text) => formatDuration(text) },
    { title: 'authorizationCodeValidity',search: false, dataIndex: 'authorizationCodeValidity', render: (text) => formatDuration(text) },
    { title: 'deviceCodeValidity', search: false, dataIndex: 'deviceCodeValidity', render: (text) => formatDuration(text) },
    {
      title: 'status',
      dataIndex: 'status',
      render: (value, record) => {
        if (value === 0) {
          return (
            <Tooltip title={'启用'} key={value}>
              <img src={require('@/images/status_1.png')} alt={value} />
            </Tooltip>
          );
        }
      },
    },
    {
      title: "actions",
      dataIndex: 'actions',
      search: false,
      render: (_, record) =>[
        <a
          key={record?.applicationId}
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            setOpenModal(true);
          }}
        >
          Edit
        </a>,
        <a
          style={{ marginLeft: 20 }}
          key={record?.applicationId}
          onClick={async () => await deleteUserRequest(record?.applicationId || '')}
        >
          Delete
        </a>
      ]
    },
  ];

  const deleteUserRequest = async (id: string) => {
    const hide = message.loading('delete...');

    try {
      await deleteApplicationService(id);
      hide();
      message.success('Deleted successfully!');
      actionRef.current?.reloadAndRest?.();

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  }

  const formatDuration = (duration: any) => {
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
      setIdTokenData(response?.data?.signatureJwsAlgorithm)
      setApplicationTypeData(response?.data?.applicationType)
      setAuthorTypes(response?.data?.grantType);
      setAuthenticationMethod(response?.data?.authenticationMethod);
    }
  };

  useEffect(() => {
    initAuthorizationGrantTypes()
  }, []);

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.ApplicationStyle}
        rowKey="applicationId"
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
            applicationId: currentRow?.applicationId,
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
            requireProofKey: currentRow?.requireProofKey,
            requireAuthorizationConsent: currentRow?.requireAuthorizationConsent,
            logo: currentRow?.logo,
            status: currentRow?.status,
            homepage: currentRow?.homepage,
            jwkSetUrl: currentRow?.jwkSetUrl,
            reserved: currentRow?.reserved,
            reuseRefreshTokens: currentRow?.reuseRefreshTokens,
            ranking: currentRow?.ranking,
            idTokenSignatureAlgorithm: currentRow?.idTokenSignatureAlgorithm,
            postLogoutRedirectUris: currentRow?.postLogoutRedirectUris,
            redirectUris: currentRow?.redirectUris,
            applicationType: currentRow?.applicationType,
            description: currentRow?.description,
            clientSecretExpiresAt: moment(new Date(currentRow?.clientSecretExpiresAt).toISOString())
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
              label={"applicationId"}
              width="md"
              name="applicationId"
              hidden={true}
            />
          </Space>

          <Space size={24}>
            <ProFormText
              label={"logo"}
              width="md"
              name="logo"
              placeholder={"logo"}
            />
            <ProFormText
              label={"homepage"}
              width="md"
              name="homepage"
              placeholder={"homepage"}
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

          <Space size={24}>
            <ProFormSelect
              label={"applicationType"}
              width="md"
              name="applicationType"
              placeholder={"applicationType"}
              request={async () => {
                return applicationTypeData.map((item) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />
            <ProForm.Item label={"clientSecretExpiresAt"} name="clientSecretExpiresAt">
              <DatePicker
                showTime
              />
            </ProForm.Item>
          </Space>

          <Space size={24}>
            <ProFormText
              label={"redirectUris"}
              width="md"
              name="redirectUris"
              placeholder={"redirectUris"}
            />
            <ProFormText
              label={"postLogoutRedirectUris"}
              width="md"
              name="postLogoutRedirectUris"
              placeholder={"postLogoutRedirectUris"}
            />
          </Space>

          <Divider plain>客户端设置(Client Settings)</Divider>

          <Space size={24}>
            <ProFormText
              label={"jwkSetUrl"}
              width="md"
              name="jwkSetUrl"
              placeholder={"jwkSetUrl"}
            />
          </Space>

          <Space size={24} className={styles.flexGapStyle}>
            <div className={styles.switchStyle}>
              <ProForm.Item name="requireProofKey">
                  <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: 8 }}>是否需要 Proof Key</div>
            </div>

            <div className={styles.switchStyle}>
              <ProForm.Item name="requireAuthorizationConsent" >
                  <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: 8 }}>是否需要认证确认</div>
            </div>
          </Space>
          

          <Divider plain>令牌设置(Token Settings)</Divider>

          <Space size={24}>
            <ProForm.Item
              label="accessTokenValidity"
              name="accessTokenValidity"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} />
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
                min={0} defaultValue={0} />
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
                min={0} defaultValue={0} />
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
                min={0} defaultValue={0} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType4"
              placeholder={"单位"}
              options={dayType}
            />
          </Space>

          <Space size={24}>
            <ProFormSelect
              label={"idTokenSignatureAlgorithm"}
              width="md"
              name="idTokenSignatureAlgorithm"
              placeholder={"idTokenSignatureAlgorithm"}
              request={async () => {
                return idTokenData.map((item) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />

            <div className={styles.DivStyle}>
              <ProForm.Item label=' ' name="reuseRefreshTokens" >
                  <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: '35px' }}>是否允许重用刷新令牌</div>
            </div>
          </Space>

          <Divider plain>数据条目设置</Divider>

          <Space size={24}>
            <ProFormText
              label={"description"}
              width="md"
              name="description"
              placeholder={"description"}
            />

            <ProForm.Item
              label="ranking"
              name="ranking"
            >
              <InputNumber
                style={{ width: '328px' }}
                min={0} defaultValue={0} />
            </ProForm.Item>
          </Space>

          <Space size={24}>
            <ProFormSelect
              label={"status"}
              width="md"
              name="status"
              placeholder={"status"}
              options={[
                {
                  label: '启用',
                  value: '0',
                },
                {
                  label: '禁用',
                  value: '1',
                },
                {
                  label: '锁定',
                  value: '2',
                },
                {
                  label: '过期',
                  value: '3',
                }
              ]}
            />

            <div className={styles.DivStyle}>
              <ProForm.Item label=' ' name="reserved" >
                  <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: '35px' }}>是否为保留数据</div>
            </div>
          </Space>
 
        </ModalForm>
      }
    </PageContainer>
  );
};

export default Application;
