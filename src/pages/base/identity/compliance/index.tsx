import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import { getComplianceManagePageService } from '@/services/base-service/identity-service/complianceService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { formatMessage } from 'umi';
import dayjs from "dayjs";
import styles from './index.less';

const Compliance: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getList = async (params: API.PageParams) => {
    const response = await getComplianceManagePageService({
      pageNumber: params.current || 1,
      pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      principalName: params?.principalName || '',
      clientId: params?.clientId || '',
      osName: params?.osName || '',
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

  const columns: ProColumns<APIIdentity.authorization>[] = [
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
    { title: formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record)=> formatDate(record?.createdDate)},
    { title: formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record)=> formatDate(record?.updatedDate)},
  ];

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  return (
    <PageContainer>
      <ProTable<APIIdentity.authorization, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        className={styles.complianceListStyle}
        rowKey="scopeId"
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
