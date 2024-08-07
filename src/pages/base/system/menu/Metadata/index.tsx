import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  getMenuManageAttributePageService,
  getAllAttributeIdByMenuIdService,
} from '@/services/base-service/system-service/menuService';
import {Button, Tooltip} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import {ProFormSelect, ProTable, ProFormText } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useIntl } from "@@/exports";
import {enumsService} from "@/services/base-service/system-service/commService";
import {statusConversionType} from "@/utils/utils";
import FunctionPermission from "@/pages/base/components/functionPermission";
import {FormattedMessage} from "@umijs/max";

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
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);

  const columns: ProColumns<APISystem.MetadataListItemDataType>[] = [
    {
      title: intl.formatMessage({ id: 'metadata.list.interfaceName' }),
      dataIndex: 'requestMethod',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Url',
      dataIndex: 'url',
      // ellipsis: true,
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      // ellipsis: true,
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: intl.formatMessage({ id: 'metadata.list.default' }),
      dataIndex: 'attributeCode',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
    },
    {
      title: intl.formatMessage({ id: 'metadata.list.expression' }),
      dataIndex: 'webExpression',
      hideInSearch: true,
    },
    {

      title: intl.formatMessage({ id: 'application.list.status' }),
      dataIndex: 'status',
      width: '100px',
      valueType: 'select',
      valueEnum: dataItemStatus?.reduce((result: any, type: any) => {
        result[type?.value] = {
          text: type?.name,
          status: type?.value,
        };
        return result;
      }, {}),
      renderFormItem: (_, { ...rest }) => {
        return (
          <ProFormSelect
            mode="multiple"
            placeholder={'Please Select'}
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        );
      },
    },
    {

      title: intl.formatMessage({ id: 'application.list.showSelect' }),
      dataIndex: 'showSelect',
      width: '100px',
      valueType: 'select',
      valueEnum: {
        all: {text: '全部'},
        selected: { text: '已选中'},
      },
      renderFormItem: (_, { ...rest }) => {
        return (
          <ProFormSelect
            placeholder={'Please Select'}
            {...rest}
          />
        );
      },
    },
  ];

  const getList = async (params: APISystem.MetadataListItemDataType) => {
    // if (params?.status?.length > 0) {
    //   const list = await statusConversionType(params.status, dataItemStatus)
    //   params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
    // }
    const response = await getMenuManageAttributePageService({
      page: {
        pageNumber: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      },
      requestMethod: params?.requestMethod || '',
      url: params?.url || '',
      description: params?.description || '',
      attributeCode: params?.attributeCode || '',
      webExpression: params?.webExpression || '',
      status: params?.status,
      attributeId:params?.showSelect === "selected" ? selectedRowKeys :[]
    });

    let dataSource: any = [];
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

  const initType = async () => {
    const response = await enumsService();
    if (response?.success === true) {
      setDataItemStatus(response?.data?.sysDataItemStatus);
    }
  };

  useEffect(() => {
    initType();
  }, []);

  return (
    <div>
      <ProTable
        columns={columns}
        rowKey={(e: any) => e?.attributeId}
        rowSelection={rowSelection}
        search={{
          span: 8,
          layout: 'vertical',
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        scroll={{
          y: 300,
        }}
        tableAlertRender={()=>{
          return `Selected ${selectedRowKeys.length} ${selectedRowKeys.length > 1 ? 'Items' : 'Item'}`
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
