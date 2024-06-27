import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import { getComplianceManagePageService } from '@/services/base-service/identity-service/complianceService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import {useIntl} from "@@/exports";
import dayjs from "dayjs";

const Compliance: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: APIIdentity.complianceItemType) => {
    const response = await getComplianceManagePageService({
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      principalName: params?.principalName || '',
      clientId: params?.clientId || '',
      osName: params?.osName || '',
    });

    let dataSource: APIIdentity.complianceItemType[] = [];
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

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APIIdentity.complianceItemType>[] = [
    { title: 'principalName', dataIndex: 'principalName' },
    { title: 'clientId', dataIndex: 'clientId' },
    { title: 'ip', dataIndex: 'ip', search: false },
    { title: 'osName', dataIndex: 'osName' },
    {
      title: 'android',
      dataIndex: 'android',
      search: false,
      render: (value) => {
        return <div>{!value ? 'false' : ''}</div>;
      },
    },
    { title: 'operation', dataIndex: 'operation', search: false },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate)},
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate)},
  ];

  return (
    <PageContainer>
      <ProTable<APIIdentity.complianceItemType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="scopeId"
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        request={getList}
        columns={columns}
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
    </PageContainer>
  );
};

export default Compliance;
