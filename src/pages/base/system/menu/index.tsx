import Metadata from './Metadata/index'
import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteMenuManageService,
  getMenuManageDetailService,
  getMenuManageTreeService,
  insertMenuManageService,
  updateMenuManageService,
  updateMenuAssignedAttributeService,
} from '@/services/base-service/system-service/menuService';
import { statusConversionType, menuConversionType } from '@/utils/utils';
import { enumsService } from '@/services/base-service/system-service/commService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { message, Button, Row, Col } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useIntl } from "@@/exports";
import {PlusOutlined} from '@ant-design/icons'
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";

const MenuList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [defaultExpanded, setDefaultExpanded] = useState([]);
  const [menuData,setMenuData] = useState([])
  const [showAll,setShowAll] = useState(false)
  const [tableAdd,setTableAdd] = useState<string | undefined>('')
  const [ScopeOpenModal, setScopeOpenModal] = useState<boolean>(false);
  const [menuId, setMenuId] = useState<any>('');
  const [selectMetadataList, setSelectMetadataList] = useState<any>([]);
  const [menuType, setMenuType] = useState<any>([]);
  const [menuLocation, setMenuLocation] = useState<any>([]);
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'updatedDate': { show: false },
    'sort': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

  const getMenuInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getMenuManageDetailService(currentRow?.id || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }
    return {
      parentId:tableAdd,
      menuName: '',
      code: '',
      id: '',
      sort: '',
      type: '',
      status: '',
      name:'',
      path:''
    };
  };

  const handleAdd = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('add');
    delete fields.id;

    try {
      await insertMenuManageService({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: APISystem.TenantItemDataType) => {
    const hide = message.loading('Update');
    try {
      await updateMenuManageService(fields);
      hide();
      message.success('Update successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const deleteRow = async (id: string) => {
    const hide = message.loading('delete...');
    try {
      await deleteMenuManageService(id);
      hide();
      message.success('Deleted successfully and will refresh soon');

      actionRef.current?.reloadAndRest?.();

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const columns: ProColumns<APISystem.MenuListItemDataType>[] = [
    {
      title: 'Menu name',
      dataIndex: 'menuName',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: 'Path',
      dataIndex: 'path',
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
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
            {...rest}
            fieldProps={{
              mode: 'multiple',
            }}
          />
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      valueType: 'select',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Catalogue',
        },
        1: {
          text: 'Page',
        },
        2: {
          text: 'Button',
        },
      },
    },
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key={record?.id}
          onClick={() => {
            setScopeOpenModal(true);
            setMenuId(record?.id);
          }}
        >
          Metadata
        </a>,
        <a
          key="EditBtn"
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            handleModalVisible(true);
          }}
        >
          Edit
        </a>,
        <a
          key="NewBtn"
          onClick={() => {
            setIsEdit(false);
            setCurrentRow({ parentId: record?.id ? record.id : '' });
            setTableAdd(record?.id ? record.id : '')
            handleModalVisible(true);
          }}
        >
          Add
        </a>,
        <div key='Delete'>
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRow(record?.id || '');
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </div>
      ],
    },
  ];

  const getList = async (params: APISystem.MenuListItemDataType) => {
    if (params?.status?.length > 0) {
      const list = await statusConversionType(params.status, dataItemStatus)
      params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
    }

    if (params?.type) {
      params.type = await menuConversionType(params?.type, menuType)
    }

    const parameters = {
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      menuName: params?.menuName,
      path: params?.path,
      status: params?.status,
      type: params?.type || '',
    }
    const response = await getMenuManageTreeService(parameters);

    let dataSource: any = [];
    let dataTotal = 0;
    if (response?.success === true) {
      dataSource = response?.data || [];
    }
    setMenuData(dataSource)
    setTotal(dataTotal);

    return {
      data: dataSource,
      success: true,
      total: dataTotal,
    };
  };

  const openTreeData = async () =>{
    const treeDataMap = menuData
    let treeDataId: any[];
    treeDataId = [];
    if (!showAll){
      const renderData = (ele: any) =>{
        ele.forEach((item: any) => {
          treeDataId?.push(item.id)
          if (item?.children && item?.children?.length > 0){
            renderData(item?.children)
          }
        })
      }
      renderData(treeDataMap)
    }
    setDefaultExpanded(treeDataId)
  }

  const editMetadataList = async () => {
    const params = {
      menuId: menuId,
      attributeIds: selectMetadataList,
    };
    try {
      await updateMenuAssignedAttributeService(params);
      message.success('Added successfully');
      return true;
    } catch (error) {
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleSelectedMetadata = (scope: any) => {
    setSelectMetadataList(scope);
  };

  const initType = async () => {
    const response = await enumsService();
    if (response?.success === true) {
      setMenuType(response?.data?.sysMenuType);
      setMenuLocation(response?.data?.sysMenuLocation);
      setDataItemStatus(response?.data?.sysDataItemStatus);
    }
  };

  useEffect(() => {
    initType();
  }, []);

  return (
    <PageContainer>
      <ProTable<APISystem.MenuListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed:false,
        }}
        request={getList}
        columns={columns}
        scroll={{ x: 'max-content' }}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        expandable={{expandedRowKeys: defaultExpanded}}
        onExpand={(b, r) => {
          const newExp: any = b ? [...defaultExpanded, r.id] : defaultExpanded.filter(i => i !== r.id);
          setDefaultExpanded(newExp);
        }}
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowAll(!showAll)
              openTreeData()
            }}
            type="primary"
          >
            全部{
            showAll?'收起':'展开'
          }
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEdit(false)
              setTableAdd('')
              handleModalVisible(true)
            }}
            type="primary"
          >
            新建
          </Button>
        ]}
      />

      {modalVisible && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          open={modalVisible}
          request={getMenuInfoRequest}
          onOpenChange={handleModalVisible}
          onFinish={async (record: any) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType)
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType)
            }
            console.log('onFinish response', response);

            if (response) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <ProFormTreeSelect
                label={'Parent Menu'}
                name="parentId"
                placeholder="Please select"
                allowClear
                secondary
                request={async () => menuData}
                // tree-select args
                fieldProps={{
                  treeDefaultExpandAll:true,
                  suffixIcon: null,
                  filterTreeNode: true,
                  showSearch: true,
                  popupMatchSelectWidth: false,
                  autoClearSearchValue: true,
                  multiple: false,
                  treeNodeFilterProp: 'title',
                  fieldNames: {
                    label: 'menuName',
                    value:'id'
                  },
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Menu name is required',
                  },
                ]}
                label={'Menu name'}
                name="menuName"
                placeholder={'Menu name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="code"
                label={'Code'}
                placeholder={'Code'}
                rules={[
                  {
                    required: true,
                    message: 'Code is required',
                  },
                ]}
              />
            </Col>
            <Col span={12} hidden={true}><ProFormText label={'id'} name="id"/></Col>
            <Col span={12} hidden={true}><ProFormText label={'parentId'} name="parentId"/></Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Name is required',
                  },
                ]}
                label={'Name'}
                name="name"
                placeholder={'Name'}
              />
            </Col>
            <Col span={12}><ProFormText label={'Icon'} name="icon" placeholder={'Icon'} /></Col>
            <Col span={12}>
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Path is required',
                  },
                ]}
                label={'Path'}
                name="path"
                placeholder={'Path'}
              />
            </Col>
            <Col span={12}>
              <ProFormDigit
                rules={[
                  {
                    required: true,
                    message: 'Sort is required',
                  },
                ]}
                label={'Sort'}
                name="sort"
                placeholder={'Sort'}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="type"
                label={'Type'}
                rules={[
                  {
                    required: true,
                    message: 'Type is required',
                  },
                ]}
                request={async () => {
                  return menuType?.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="location"
                label={'Location'}
                rules={[
                  {
                    required: true,
                    message: 'Location is required',
                  },
                ]}
                allowClear={false}
                request={async () => {
                  return menuLocation?.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'Status is required',
                  },
                ]}
                name="status"
                label={'Status'}
                request={async () => {
                  return dataItemStatus?.map((item: any) => {
                    return {
                      label: item?.name,
                      value: item?.value,
                    };
                  });
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormTextArea
                name="description"
                label={'Description'}
                placeholder={'Please enter at least five characters'}
              />
            </Col>
          </Row>
        </ModalForm>
      )}

      {ScopeOpenModal && (
        <ModalForm
          title={'Scope'}
          width="70%"
          open={ScopeOpenModal}
          onOpenChange={setScopeOpenModal}
          onFinish={async () => {
            let response = await editMetadataList();
            if (response) {
              setScopeOpenModal(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <Metadata
            onSelectedMetadata={handleSelectedMetadata}
            Id={menuId}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default MenuList;
