import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import { getComplianceManagePageService } from '@/services/base-service/identity-service/complianceService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, ProFormText } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import {useIntl} from "@@/exports";
import dayjs from "dayjs";
import FilterQuery from '@/pages/base/components/filterQuery/index';

const Compliance: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [OptionSelect, setOptionSelect] = useState<any>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'createdDate': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };


  const getList = async (params: APIIdentity.complianceItemType) => {
    if (OptionSelect?.length > 0) {
      const directions = [];
      const properties = [];
      OptionSelect?.forEach((item: any) => {
        directions.push(item.order);
        properties.push(item.field);
      });
      params.directions = directions?.map((param: any) => encodeURIComponent(param)).join(',') || [];
      params.properties = properties?.map((param: any) => encodeURIComponent(param)).join(',') || [];
    }
    const response = await getComplianceManagePageService(params);

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
    { title: 'Principal Name', dataIndex: 'principalName',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
     },
    { title: 'Client ID', dataIndex: 'clientId',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
     },
    { title: 'IP', dataIndex: 'ip', search: false },
    { title: 'OS Name', dataIndex: 'osName',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
     },
    {
      title: 'Android',
      dataIndex: 'android',
      search: false,
      render: (value) => {
        return <div>{!value ? 'false' : ''}</div>;
      },
    },
    { title: 'Operation', dataIndex: 'operation', search: false },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate)},
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate)},
  ];

  const selectSubmit = (value: any)=> {
    setOptionSelect(value);
  };

  return (
    <PageContainer>
      <ProTable<APIIdentity.complianceItemType, API.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="scopeId"
        scroll={{ x: 'max-content' }}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        toolBarRender={() => [
          <FilterQuery fields={columns} selectSubmit={selectSubmit} />,
        ]}
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
