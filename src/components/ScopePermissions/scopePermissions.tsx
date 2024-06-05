import {
  ProTable
} from '@ant-design/pro-components';
import React, { useState, useEffect} from 'react';
import {DEFAULT_PAGE_SIZE} from "@/pages/common/constant";
import {
  getPermissionListService,
} from "@/services/system-service/permissionService";
import {
  getPermisService,
} from '@/services/identity-service/scope';
import styles from './index.less';

type TypeProp = {
  onSelectedPermissions: (permissions: React.Key[]) => void;
  scopeId: any;
  selectedPermissions: any;
};


const ScopePermissions: React.FC<TypeProp> = ({ onSelectedPermissions, scopeId, selectedPermissions }) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [permisListData, setPermisListData] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);

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
      key: 'permissionType',
    },
  ];

  const getListData = async(currentPage: number, pageSize: number) => {
    const msg = await getPermissionListService({
      pageNumber: currentPage || 1,
      pageSize: pageSize || DEFAULT_PAGE_SIZE,
  });
    setPermisListData(msg?.data?.content || [])
    setTotal(msg?.data?.totalElements)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    const filteredData = permisListData.filter(item => newSelectedRowKeys.includes(item.permissionId));
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedPermissions(filteredData);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initPermissList = async () => {
      const permissionIds = selectedPermissions?.map(permission => permission.permissionId);
      setSelectedRowKeys(permissionIds);
  };

  useEffect(() => {
    initPermissList();
  }, [scopeId])

  useEffect(() => {
    getListData(page, size);
  }, [])

  return (
    <div>
      <ProTable
        className={styles.permission}
        columns={columns}
        dataSource={permisListData}
        rowKey={(e: any) => e?.permissionId}
        rowSelection={rowSelection}
        options={false}
        pagination={{
          current: page,
          pageSize: size, 
          total: total,
          size: "small",
          onChange: (pageNum: number, sizeNum: any) => {
            setPage(pageNum);
            setSize(sizeNum);
            getListData(pageNum, sizeNum);
          }
        }}
      />
    </div>
  );
};

export default ScopePermissions;
