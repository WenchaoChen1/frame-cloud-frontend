import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getRoleManageBusinessPermissionTreeService,
  getAllBusinessPermissionIdByRoleIdService,
} from '@/services/base-service/system-service/roleService';
import { useIntl } from "@@/exports";
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

type TypeProp = {
  onSelectedPermissions: (permissions: React.Key[]) => void;
  Id: any;
  tenantId: any;
};

const ScopePermissions: React.FC<TypeProp> = ({ onSelectedPermissions, Id, tenantId }) => {
  const intl = useIntl();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'description', hideInSearch: true, dataIndex: 'description' },
    { title: 'Sort', hideInSearch: true, dataIndex: 'sort' },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
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
    },
    {
      title: intl.formatMessage({ id: 'application.list.createdDate' }),
      key: 'showTime',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createdDate',
    },
    {
      title: intl.formatMessage({ id: 'application.list.updatedDate' }),
      hideInSearch: true,
      dataIndex: 'updatedDate',
      sorter: true,
    },
  ];

  const getList = async () => {
    const response = await getRoleManageBusinessPermissionTreeService(tenantId);
    let dataSource: APISystem.PermissionItemDataType[] = [];
    let dataTotal = 0;
    if (response?.success === true) {
      dataSource = response?.data || [];
    }

    setTotal(dataTotal);

    return {
      data: dataSource,
      success: true,
      total: dataTotal,
    };
  };

  // newSelectedRowKeys: id \ selectedRows:rows
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedPermissions(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initSelectChange = async () => {
    const response = await getAllBusinessPermissionIdByRoleIdService(Id);
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
        rowKey={(e: any) => e?.businessPermissionId}
        rowSelection={rowSelection}
        search={false}
        request={getList}
        options={false}
        scroll={{
          y: 300,
        }}
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

export default ScopePermissions;
