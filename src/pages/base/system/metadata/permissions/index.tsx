import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getPermissionManagePageService,
  getPermissionTypeService,
} from '@/services/base-service/system-service/permissionService';
import {
  getAttributePermissionIdByAttributeIdService,
} from '@/services/base-service/system-service/metadataService';
import {ProFormSelect, ProTable, ProFormText} from '@ant-design/pro-components';
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
      title: 'Permission Name',
      dataIndex: 'permissionName',
      ellipsis: true,
      key: 'permissionName',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Permission Code',
      dataIndex: 'permissionCode',
      ellipsis: true,
      key: 'permissionCode',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Permission Type',
      dataIndex: 'permissionType',
      ellipsis: true,
      valueType: 'select',
      key: 'permissionType',
      valueEnum: permissionTypeList.reduce((result: any, type) => {
        result[type] = {
          text: type,
          status: type,
        };
        return result;
      }, {}),
      renderFormItem: (_, { ...rest }) => {
        return (
          <ProFormSelect
            placeholder={'Please Select'}
            mode="multiple"
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        );
      },
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
    let permissionType = params?.permissionType?.join(',') || ''
    const response = await getPermissionManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      permissionName: params?.permissionName || '',
      permissionCode: params?.permissionCode || '',
      permissionType
    });

    let dataSource: APISystem.PermissionItemDataType[] = [];
    let dataTotal = 0;
    if (response?.success === true) {
      dataSource = response?.data?.content || [];
      dataTotal = response?.data?.totalElements || 0;
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
        columns={columns}
        rowKey={(e: any) => e?.permissionId}
        rowSelection={rowSelection}
        search={{
          span: 6,
          layout: 'vertical',
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        request={getList}
        options={false}
        scroll={{
          y: 300,
        }}
        tableAlertRender={()=>{
          return `Selected ${selectedRowKeys.length} ${selectedRowKeys.length > 1 ? 'Items' : 'Item'}`
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
