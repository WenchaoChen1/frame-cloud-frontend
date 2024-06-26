import Scope from './scope/index';
import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import { getAuthorizationGrantTypesService } from '@/services/base-service/identity-service/applicationDictionaryService';
import {
  deleteApplicationService,
  getApplicationListService,
  getApplicationManageDetailService,
  insertApplicationManageService,
  updateApplicationManageService,
  updateApplicationManageAssignedScopeScopeService,
} from '@/services/base-service/identity-service/applicationService';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, DatePicker, Divider, InputNumber, message, Space, Switch, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {useIntl} from "@@/exports";
import styles from './index.less';
import dayjs from "dayjs";
import ConfirmPage from "@/pages/base/components/popconfirm";

const Application: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ScopeOpenModal, setScopeOpenModal] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [authorTypes, setAuthorTypes] = useState([]);
  const [applicationTypeData, setApplicationTypeData] = useState([]);
  const [idTokenData, setIdTokenData] = useState([]);
  const [authenticationMethod, setAuthenticationMethod] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectScopesList, setSelectScopesList] = useState([]);

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
    },
  ];

  const getList = async (params: any) => {
    const response = await getApplicationListService({
      pageNumber: params.current || 1,
      abbreviation:params.abbreviation,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      applicationName: params?.applicationName,
      clientAuthenticationMethods:
        params?.clientAuthenticationMethods
          ?.map((param: any) => encodeURIComponent(param))
          .join(',') || [],
      authorizationGrantTypes:
        params?.authorizationGrantTypes?.map((param: any) => encodeURIComponent(param)).join(',') ||
        [],
      status: params?.status,
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
  const parseAccessTokenValidity = (duration: any) => {
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

    let result = '';

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
    fields.accessTokenValidity = mergeAndFormatValidity(
      fields?.accessTokenValidity,
      fields?.dayType1,
    );
    fields.refreshTokenValidity = mergeAndFormatValidity(
      fields?.refreshTokenValidity,
      fields?.dayType2,
    );
    fields.authorizationCodeValidity = mergeAndFormatValidity(
      fields?.authorizationCodeValidity,
      fields?.dayType3,
    );
    fields.deviceCodeValidity = mergeAndFormatValidity(
      fields?.deviceCodeValidity,
      fields?.dayType4,
    );

    if (fields.clientSecretExpiresAt) {
      fields.clientSecretExpiresAt = new Date(fields?.clientSecretExpiresAt).toISOString();
    }

    delete fields.dayType1;
    delete fields.dayType2;
    delete fields.dayType3;
    delete fields.dayType4;
    try {
      await updateApplicationManageService({ ...fields });

      message.success('Update successfully');
      return true;
    } catch (error) {
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const mergeAndFormatValidity = (validity: any, dayType: any) => {
    const duration = moment.duration(validity, dayType);
    return duration.toISOString();
  };

  const handleAdd = async (fields: any) => {
    delete fields.applicationId;
    fields.accessTokenValidity = mergeAndFormatValidity(
      fields?.accessTokenValidity,
      fields?.dayType1,
    );
    fields.refreshTokenValidity = mergeAndFormatValidity(
      fields?.refreshTokenValidity,
      fields?.dayType2,
    );
    fields.authorizationCodeValidity = mergeAndFormatValidity(
      fields?.authorizationCodeValidity,
      fields?.dayType3,
    );
    fields.deviceCodeValidity = mergeAndFormatValidity(
      fields?.deviceCodeValidity,
      fields?.dayType4,
    );

    if (fields.clientSecretExpiresAt) {
      fields.clientSecretExpiresAt = new Date(fields?.clientSecretExpiresAt).toISOString();
    }

    delete fields.dayType1;
    delete fields.dayType2;
    delete fields.dayType3;
    delete fields.dayType4;

    try {
      await insertApplicationManageService({ ...fields });
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const columns: ProColumns<APIIdentity.authorization>[] = [
    {
      title: intl.formatMessage({ id: 'application.list.applicationName' }),
      dataIndex: 'applicationName',
    },
    { title: intl.formatMessage({ id: 'application.list.abbreviation' }), dataIndex: 'abbreviation' },
    {
      title: intl.formatMessage({ id: 'application.list.authorizationGrantTypes' }),
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
        );
      },
      render: (_, record) => {
        const grantTypes = record.authorizationGrantTypes?.split(',');
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
            <div key={record?.applicationId}>
              <Tooltip title={tooltipText}>
                <img src={imageUrl} alt={type} style={{ paddingRight: '8px' }} />
              </Tooltip>
            </div>
          );
        });

        return <div>{images}</div>;
      },
    },
    {
      title: intl.formatMessage({ id: 'application.list.accessTokenValidity' }),
      search: false,
      dataIndex: 'accessTokenValidity',
      render: (text) => formatDuration(text),
    },
    {
      title: intl.formatMessage({ id: 'application.list.refreshTokenValidity' }),
      search: false,
      dataIndex: 'refreshTokenValidity',
      render: (text) => formatDuration(text),
    },
    {
      title: intl.formatMessage({ id: 'application.list.authorizationCodeValidity' }),
      search: false,
      dataIndex: 'authorizationCodeValidity',
      render: (text) => formatDuration(text),
    },
    {
      title: intl.formatMessage({ id: 'application.list.deviceCodeValidity' }),
      search: false,
      dataIndex: 'deviceCodeValidity',
      render: (text) => formatDuration(text),
    },
    {
      title: intl.formatMessage({ id: 'application.list.status' }),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        ENABLE: { text: '启用' },
        FORBIDDEN: { text: '禁用' },
        LOCKING: { text: '锁定' },
        EXPIRED: { text: '过期' },
      },
      render: (value, record) => {
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
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record)=> formatDate(record?.updatedDate) },
    {
      title: intl.formatMessage({ id: 'pages.searchTable.actions' }),
      dataIndex: 'actions',
      search: false,
      render: (_, record) => [
        <a
          key={record?.applicationId}
          onClick={() => {
            setScopeOpenModal(true);
            setApplicationId(record?.applicationId);
          }}
        >
          Scope
        </a>,
        <a
          key={record?.applicationId}
          style={{ marginLeft: 15 }}
          onClick={() => {
            setOpenModal(true);
            setIsEdit(true);
            setCurrentRow(record);
          }}
        >
          Edit
        </a>,
        <div key={record?.applicationId}>
          <ConfirmPage onConfirm={async () => await deleteUserRequest(record?.applicationId || '')}>
            <a style={{ marginLeft: 15 }}>Delete</a>
          </ConfirmPage>
        </div>
      ],
    },
  ];

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

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
  };

  const formatDuration = (duration: any) => {
    const momentDuration = moment.duration(duration);
    const hours = momentDuration.hours();
    const minutes = momentDuration.minutes();
    const seconds = momentDuration.seconds();

    let formattedDuration = '';

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
      setIdTokenData(response?.data?.signatureJwsAlgorithm);
      setApplicationTypeData(response?.data?.applicationType);
      setAuthorTypes(response?.data?.grantType);
      setAuthenticationMethod(response?.data?.authenticationMethod);
    }
  };


  const editScopeList = async () => {
    const params = {
      applicationId: applicationId || '',
      scopeIds: selectScopesList || '',
    };
    try {
      await updateApplicationManageAssignedScopeScopeService(params);
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleSelectedScope = (scope: any) => {
    setSelectScopesList(scope);
  };

  const DataformRequest = async () => {
    if (isEdit && currentRow) {
      const responsePayMethodInfo = await getApplicationManageDetailService(
        currentRow.applicationId,
      );
      if (responsePayMethodInfo.success === true && responsePayMethodInfo.data) {
        let list = { ...responsePayMethodInfo.data };
        list.clientSecretExpiresAt = list?.clientSecretExpiresAt
          ? moment(new Date(list?.clientSecretExpiresAt).toISOString())
          : null;
        (list.dayType1 = list?.accessTokenValidity
          ? parseAccessTokenValidity(list?.accessTokenValidity)?.split(' ')?.[1]
          : null);
          (list.dayType2 = list?.authorizationCodeValidity
            ? parseAccessTokenValidity(list?.authorizationCodeValidity)?.split(' ')?.[1]
            : null);
          (list.dayType3 = list?.deviceCodeValidity
            ? parseAccessTokenValidity(list?.deviceCodeValidity)?.split(' ')?.[1]
            : null);
          (list.dayType4 = list?.refreshTokenValidity
            ? parseAccessTokenValidity(list?.refreshTokenValidity)?.split(' ')?.[1]
            : null);
          (list.accessTokenValidity = list?.accessTokenValidity
            ? parseAccessTokenValidity(list?.accessTokenValidity)?.split(' ')?.[0]
            : null);
        list.authorizationCodeValidity = list?.authorizationCodeValidity
          ? parseAccessTokenValidity(list?.authorizationCodeValidity)?.split(' ')?.[0]
          : null;
        list.deviceCodeValidity = list?.deviceCodeValidity
          ? parseAccessTokenValidity(list?.deviceCodeValidity)?.split(' ')?.[0]
          : null;
        list.refreshTokenValidity = list?.refreshTokenValidity
          ? parseAccessTokenValidity(list?.refreshTokenValidity)?.split(' ')?.[0]
          : null;
        list.authorizationGrantTypes = list?.authorizationGrantTypes
          ? list?.authorizationGrantTypes?.split(',')
          : [];
        list.clientAuthenticationMethods = list?.clientAuthenticationMethods
          ? list?.clientAuthenticationMethods?.split(',')
          : [];

        return list;
      }
    }
    return {
      id: '',
      clientId: '',
      secretCreated: '',
    };
  };

  useEffect(() => {
    initAuthorizationGrantTypes();
  }, []);

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.ApplicationStyle}
        rowKey="applicationId"
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="primary"
            type="primary"
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
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
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
          onFinish={async (record) => {
            let response = undefined
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
          request={DataformRequest}
        >
          <Space size={24} style={{ display: `${isEdit ? '' : 'none'}` }}>
            <ProFormText
              label={'clientId'}
              width="md"
              name="clientId"
              placeholder={'clientId'}
              disabled
              hidden={!isEdit}
            />

            <ProFormText
              name="clientSecret"
              label={'clientSecret'}
              width="md"
              placeholder={'clientSecret'}
              disabled
              hidden={!isEdit}
            />
          </Space>

          <Space size={24}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'applicationName is required',
                },
              ]}
              label={intl.formatMessage({ id: 'application.list.applicationName' })}
              width="md"
              name="applicationName"
              placeholder={'applicationName'}
            />

            <ProFormText
              name="abbreviation"
              label={intl.formatMessage({ id: 'application.list.abbreviation' })}
              width="md"
              placeholder={'abbreviation'}
            />

            <ProFormText label={'applicationId'} width="md" name="applicationId" hidden={true} />
          </Space>

          <Space size={24}>
            <ProFormText
              label={intl.formatMessage({ id: 'application.list.logo' })}
              width="md"
              name="logo"
              placeholder={'logo'}
            />
            <ProFormText
              label={intl.formatMessage({ id: 'application.list.homepage' })}
              width="md"
              name="homepage"
              placeholder={'homepage'}
            />
          </Space>

          <Space size={24}>
            <ProFormSelect
              rules={[
                {
                  required: true,
                  message: 'authorizationGrantTypes Type is required',
                },
              ]}
              mode="multiple"
              label={intl.formatMessage({ id: 'application.list.authorizationGrantTypes' })}
              width="md"
              name="authorizationGrantTypes"
              placeholder={'authorizationGrantTypes'}
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
                  message: 'clientAuthenticationMethods Type is required',
                },
              ]}
              mode="multiple"
              label={intl.formatMessage({ id: 'application.list.clientAuthenticationMethods' })}
              width="md"
              name="clientAuthenticationMethods"
              placeholder={'clientAuthenticationMethods'}
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
              label={intl.formatMessage({ id: 'application.list.applicationType' })}
              width="md"
              name="applicationType"
              placeholder={'applicationType'}
              request={async () => {
                return applicationTypeData.map((item) => {
                  return {
                    label: item?.text,
                    value: item?.value,
                  };
                });
              }}
            />
            <ProForm.Item
              label={intl.formatMessage({ id: 'application.list.clientSecretExpiresAt' })}
              name="clientSecretExpiresAt"
            >
              <DatePicker showTime />
            </ProForm.Item>
          </Space>

          <Space size={24}>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: 'redirectUris is required',
                },
              ]}
              label={intl.formatMessage({ id: 'application.list.redirectUris' })}
              width="md"
              name="redirectUris"
              placeholder={'redirectUris'}
            />
            <ProFormText
              label={intl.formatMessage({ id: 'application.list.postLogoutRedirectUris' })}
              width="md"
              name="postLogoutRedirectUris"
              placeholder={'postLogoutRedirectUris'}
            />
          </Space>

          <Divider plain>{intl.formatMessage({ id: 'application.list.label1' })}</Divider>

          <Space size={24}>
            <ProFormText
              label={intl.formatMessage({ id: 'application.list.jwkSetUrl' })}
              width="md"
              name="jwkSetUrl"
              placeholder={'jwkSetUrl'}
            />
          </Space>

          <Space size={24} className={styles.flexGapStyle}>
            <div className={styles.switchStyle}>
              <ProForm.Item name="requireProofKey">
                <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: 8 }}>
                {intl.formatMessage({ id: 'application.list.requireProofKey' })}
              </div>
            </div>

            <div className={styles.switchStyle}>
              <ProForm.Item name="requireAuthorizationConsent">
                <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: 8 }}>
                {intl.formatMessage({ id: 'application.list.requireAuthorizationConsent' })}
              </div>
            </div>
          </Space>

          <Divider plain>{intl.formatMessage({ id: 'application.list.label2' })}</Divider>

          <Space size={24}>
            <ProForm.Item
              rules={[
                {
                  required: true,
                  message: 'accessTokenValidity is required',
                },
              ]}
              label={intl.formatMessage({ id: 'application.list.accessTokenValidity' })}
              name="accessTokenValidity"
            >
              <InputNumber style={{ width: '328px' }} min={1} defaultValue={0} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType1"
              placeholder={'单位'}
              rules={[
                {
                  required: true,
                  message: 'please select',
                },
              ]}
              options={dayType}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label={intl.formatMessage({ id: 'application.list.refreshTokenValidity' })}
              name="refreshTokenValidity"
              rules={[
                {
                  required: true,
                  message: 'refreshTokenValidity is required',
                },
              ]}
            >
              <InputNumber style={{ width: '328px' }} min={1} defaultValue={0} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType2"
              placeholder={'单位'}
              options={dayType}
              rules={[
                {
                  required: true,
                  message: 'please select',
                },
              ]}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label={intl.formatMessage({ id: 'application.list.authorizationCodeValidity' })}
              name="authorizationCodeValidity"
              rules={[
                {
                  required: true,
                  message: 'authorizationCodeValidity is required',
                },
              ]}
            >
              <InputNumber style={{ width: '328px' }} min={1} defaultValue={0} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType3"
              placeholder={'单位'}
              options={dayType}
              rules={[
                {
                  required: true,
                  message: 'please select',
                },
              ]}
            />
          </Space>

          <Space size={24}>
            <ProForm.Item
              label={intl.formatMessage({ id: 'application.list.deviceCodeValidity' })}
              name="deviceCodeValidity"
              rules={[
                {
                  required: true,
                  message: 'deviceCodeValidity is required',
                },
              ]}
            >
              <InputNumber style={{ width: '328px' }} min={1} defaultValue={0} />
            </ProForm.Item>

            <ProFormSelect
              label=" "
              width="md"
              name="dayType4"
              placeholder={'单位'}
              options={dayType}
              rules={[
                {
                  required: true,
                  message: 'please select',
                },
              ]}
            />
          </Space>

          <Space size={24}>
            <ProFormSelect
              label={intl.formatMessage({ id: 'application.list.idTokenSignatureAlgorithm' })}
              width="md"
              name="idTokenSignatureAlgorithm"
              placeholder={'idTokenSignatureAlgorithm'}
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
              <ProForm.Item label=" " name="reuseRefreshTokens">
                <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: '35px' }}>
                {intl.formatMessage({ id: 'application.list.reuseRefreshTokens' })}
              </div>
            </div>
          </Space>

          <Divider plain>{intl.formatMessage({ id: 'application.list.label3' })}</Divider>

          <Space size={24}>
            <ProFormText
              label={intl.formatMessage({ id: 'application.list.description' })}
              width="md"
              name="description"
              placeholder={'description'}
            />

            <ProForm.Item label={intl.formatMessage({ id: 'application.list.ranking' })} name="ranking">
              <InputNumber style={{ width: '328px' }} min={1} defaultValue={0} />
            </ProForm.Item>
          </Space>

          <Space size={24}>
            <ProFormSelect
              label={intl.formatMessage({ id: 'application.list.status' })}
              width="md"
              name="status"
              placeholder={'status'}
              options={[
                {
                  label: '启用',
                  value: 'ENABLE',
                },
                {
                  label: '禁用',
                  value: 'FORBIDDEN',
                },
                {
                  label: '锁定',
                  value: 'LOCKING',
                },
                {
                  label: '过期',
                  value: 'EXPIRED',
                },
              ]}
            />

            <div className={styles.DivStyle}>
              <ProForm.Item label=" " name="reserved">
                <Switch />
              </ProForm.Item>
              <div style={{ paddingTop: '35px' }}>
                {intl.formatMessage({ id: 'application.list.reserved' })}
              </div>
            </div>
          </Space>
        </ModalForm>
      )}

      {ScopeOpenModal && (
        <ModalForm
          title={'Scope'}
          width="70%"
          open={ScopeOpenModal}
          onOpenChange={setScopeOpenModal}
          onFinish={async () => {
            let response = await editScopeList();
            if (response) {
              setScopeOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <Scope
            onSelectedScope={handleSelectedScope}
            Id={applicationId}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default Application;
