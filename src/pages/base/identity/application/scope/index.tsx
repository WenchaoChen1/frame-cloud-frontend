import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getScopeManagePageService,
} from '@/services/base-service/identity-service/scopeService';
import {
  getApplicationScopeIdByApplicationIdScopeService
} from '@/services/base-service/identity-service/applicationService';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ProFormText } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";

type TypeProp = {
  onSelectedScope: (permissions: React.Key[]) => void;
  Id: any;
};

const ApplicationScope: React.FC<TypeProp> = ({
  onSelectedScope,
  Id,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState<number>(1);

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APIIdentity.scopeItemType>[] = [
    { title: 'Scope Name', dataIndex: 'scopeName',
      renderFormItem: () => {
        return (
          <ProFormText
            label
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { title: 'Scope Code', dataIndex: 'scopeCode',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    { title: 'Created Date',hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate)},
  ];

  const getList = async (params: APIIdentity.scopeItemType) => {
    const response = await getScopeManagePageService({
      pageNumber: params.current || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      scopeName: params?.scopeName || '',
      scopeCode: params?.scopeCode || '',
    });

    let dataSource: APIIdentity.scopeItemType[] = [];
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
    onSelectedScope(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const initSelectChange = async () => {
    const response = await getApplicationScopeIdByApplicationIdScopeService(Id);
    if (response?.data) {
      setSelectedRowKeys(response?.data);
    }
  };

  useEffect(() => {
    initSelectChange()
  }, [Id]);

  return (
    <div>
      <ProTable<APIIdentity.scopeItemType, API.PageParams>
        columns={columns}
        rowKey={(e: any) => e?.scopeId}
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

export default ApplicationScope;
