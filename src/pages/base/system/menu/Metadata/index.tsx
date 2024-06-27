import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getMenuManageAttributePageService,
  getAllAttributeIdByMenuIdService,
} from '@/services/base-service/system-service/menuService';
import { Tooltip } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useIntl } from "@@/exports";

type TypeProp = {
  onSelectedMetadata: (permissions: React.Key[]) => void;
  Id: any;
};

const ApplicationScope: React.FC<TypeProp> = ({ onSelectedMetadata, Id }) => {
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);

  const columns: ProColumns<APISystem.MetadataListItemDataType>[] = [
    { title: intl.formatMessage({ id: 'metadata.list.interfaceName' }), dataIndex: 'requestMethod' },
    { title: 'Url', dataIndex: 'url', ellipsis: true, },
    { title: 'Description', dataIndex: 'description', ellipsis: true, },
    { title: intl.formatMessage({ id: 'metadata.list.default' }), dataIndex: 'attributeCode', ellipsis: true, },
    {
      title: intl.formatMessage({ id: 'metadata.list.expression' }),
      dataIndex: 'webExpression',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'application.list.status' }),
      dataIndex: 'status',
      valueType: 'select',
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
      render: (value: any, record: any) => {
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
  ];

  const getList = async (params: APISystem.MetadataListItemDataType) => {
    if (params?.status) {
      if (params?.status === '1') {
        params.status = 'FORBIDDEN';
      } else if (params?.status === '2') {
        params.status = 'LOCKING';
      } else if (params?.status === '3') {
        params.status = 'EXPIRED';
      } else {
        params.status = 'ENABLE';
      }
    }
    const response = await getMenuManageAttributePageService({
      pageNumber: params.current || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      requestMethod: params?.requestMethod || '',
      url: params?.url || '',
      description: params?.description || '',
      attributeCode: params?.attributeCode || '',
      webExpression: params?.webExpression || '',
      status: params?.status,
    });

    let dataSource: APISystem.MetadataListItemDataType[] = [];
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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedMetadata(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initSelectChange = async () => {
    const response = await getAllAttributeIdByMenuIdService(Id);
    if (response?.data) {
      setSelectedRowKeys(response?.data);
    }
  };

  useEffect(() => {
    initSelectChange()
  }, [Id]);

  return (
    <div>
      <ProTable
        columns={columns}
        rowKey={(e: any) => e?.attributeId}
        rowSelection={rowSelection}
        search={{
          defaultCollapsed: true,
          span: 5,
          labelWidth: 'auto',
        }}
        request={getList}
        options={false}
        pagination={{
          current: page,
          pageSize: size,
          total: total,
          size: 'small',
          onChange: (pageNum: number, sizeNum: any) => {
            setPage(pageNum);
            setSize(sizeNum);
          },
        }}
      />
    </div>
  );
};

export default ApplicationScope;
