import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getPermissionManagePageService,
  getPermissionTypeService,
} from '@/services/base-service/system-service/comPermissionService';
import {
  getAttributePermissionIdByAttributeIdService,
} from '@/services/base-service/system-service/metadataService';
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

type TypeProp = {
  onSelectedPermissions: (permissions: React.Key[]) => void;
  Id: any;
  selectedPermissions: any;
  type: any;
};

const ScopePermissions: React.FC<TypeProp> = ({
  onSelectedPermissions,
  Id,
  selectedPermissions,
  type,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [permisListData, setPermisListData] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);
  const [permissionTypeList, setPermissionTypeList] = useState([]);

  const columns = [
    {
      title: 'permissionName',
      dataIndex: 'permissionName',
      key: 'permissionName',
    },
    {
      title: 'permissionCode',
      dataIndex: 'permissionCode',
      key: 'permissionCode',
    },
    {
      title: 'permissionType',
      dataIndex: 'permissionType',
      valueType: 'select',
      key: 'permissionType',
      valueEnum: permissionTypeList.reduce((result, type) => {
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

  const getList = async (params: API.PageParams) => {
    const response = await getPermissionManagePageService({
      pageNumber: params.current || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      permissionName: params?.permissionName || '',
      permissionCode: params?.permissionCode || '',
      permissionType: params?.permissionType || '',
    });

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      total = response?.data?.totalElements || 0;
    }

    setTotal(total);
    setPermisListData(response?.data?.content);

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    console.log(newSelectedRowKeys, '*****', selectedRows)
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedPermissions(selectedRows, newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initSelectChange = async () => {
    const response = await getAttributePermissionIdByAttributeIdService(Id);
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
        className={styles.permission}
        columns={columns}
        rowKey={(e: any) => e?.permissionId}
        rowSelection={rowSelection}
        search={{
          defaultCollapsed: true,
          span: 8,
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

export default ScopePermissions;
