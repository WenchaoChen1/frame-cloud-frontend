import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getPermissionManagePageService,
  getPermissionTypeService,
} from '@/services/base-service/system-service/permissionService';
import {
  getScopePermissionIdByScopeIdService,
} from '@/services/base-service/identity-service/scopeService';
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

type TypeProp = {
  onSelectedPermissions: (permissions: React.Key[]) => void;
  Id: any;
};

const ScopePermissions: React.FC<TypeProp> = ({
  onSelectedPermissions,
  Id,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [permissionTypeList, setPermissionTypeList] = useState([]);

  const columns = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      key: 'permissionName',
      ellipsis: true,
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
      ellipsis: true,
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      valueType: 'select',
      ellipsis: true,
      key: 'permissionType',
      valueEnum: permissionTypeList.reduce((result: any, type: any) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
    },
  ];

  const initPermissionTypeChange = async () => {
    const response = await getPermissionTypeService();
    if (response?.success === true) {
      setPermissionTypeList(response?.data);
    }
  };
  useEffect(() => {
    initPermissionTypeChange();
  }, []);

  const getList = async (params: APISystem.PermissionItemDataType) => {
    const response = await getPermissionManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize,
      permissionName: params?.permissionName || '',
      permissionCode: params?.permissionCode || '',
      permissionType: params?.permissionType || '',
    });

    let dataSource: APISystem.PermissionItemDataType[] = [];
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

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedPermissions(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initSelectChange = async () => {
    const response = await getScopePermissionIdByScopeIdService(Id);
    if (response?.data) {
      setSelectedRowKeys(response?.data);
    }
  };

  useEffect(() => {
    initSelectChange();
  }, [Id]);

  return (
    <div>
      <ProTable
        columns={columns}
        rowKey={(e: any) => e?.permissionId}
        rowSelection={rowSelection}
        search={{
          defaultCollapsed: true,
          span: 8,
          labelWidth: 'auto',
        }}
        scroll={{
          y: 300,
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

export default ScopePermissions;
