import Metadata from './Metadata/index'
import { FormattedMessage} from '@umijs/max';
import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteMenuManageService,
  getMenuManageDetailService,
  getMenuManageTreeService,
  insertMenuManageService,
  updateMenuManageService,
  updateMenuAssignedAttributeService,
  downloadMenuManageService,
  downloadMenuManageAssignedAttributeService
} from '@/services/base-service/system-service/menuService';
import { statusConversionType,generateRandomLetters, filterDate } from '@/utils/utils';
import { enumsService } from '@/services/base-service/system-service/commService';
import type { ActionType, ProColumns,ProFormInstance } from '@ant-design/pro-components';
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
import {PlusOutlined,DownloadOutlined} from '@ant-design/icons'
import dayjs from "dayjs";
import PopconfirmPage from "@/pages/base/components/popconfirm";
import FileSaver from 'file-saver'
import FunctionPermission from '@/pages/base/components/functionPermission/index'


const MenuList: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [hiddenFormItem,setHiddenFormItem] = useState(false)
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState({
    'createdDate': { show: false },
    'sort': { show: false },
  });

  const handleColumnsStateChange = (map: any) => {
    setColumnsStateMap(map);
  };

  const getMenuInfoRequest = async () => {
    if (isEdit) {
      const accountDetailResponse = await getMenuManageDetailService(currentRow?.id || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        if (accountDetailResponse?.data?.type === 2){
          setHiddenFormItem(true)
        }
        accountDetailResponse.data.code = generateRandomLetters(5)
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
      setHiddenFormItem(false)
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
      await updateMenuManageService({
        ...fields,
        id:currentRow?.id
      });
      hide();
      setHiddenFormItem(false)
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
      title: 'Menu Name',
      dataIndex: 'menuName',
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
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
      renderFormItem: () => {
        return (
          <ProFormText
            placeholder={'Please Enter'}
          />
        )
      }
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
    {
      title: 'Type',
      dataIndex: 'type',
      valueType: 'select',
      hideInForm: true,
      valueEnum: menuType?.reduce((result: any, type: any) => {
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
    { title: intl.formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record: any)=> formatDate(record?.createdDate) },
    { title: intl.formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record: any)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record: any) => [
        <FunctionPermission code="MetadataMenu" key={'MetadataMenu'}>
          <a
            key={record?.id}
            onClick={() => {
              setScopeOpenModal(true);
              setMenuId(record?.id);
            }}
          >
            Metadata
          </a>
        </FunctionPermission>,
        <FunctionPermission code="EditMenu" key={'EditMenu'}>
          <a
            onClick={() => {
              setIsEdit(true);
              setCurrentRow(record);
              handleModalVisible(true);
            }}
          >
            Edit
          </a>
        </FunctionPermission>,
        <FunctionPermission code="AddMenu" key={'AddMenu'}>
            <a
              onClick={() => {
                setIsEdit(false);
                setCurrentRow({ parentId: record?.id ? record.id : '' });
                setTableAdd(record?.id ? record.id : '')
                handleModalVisible(true);
              }}
            >
              Add
            </a>
        </FunctionPermission>,
        <FunctionPermission code="DeleteMenu" key={'DeleteMenu'}>
          <PopconfirmPage
            onConfirm={async () => {
              await deleteRow(record?.id || '');
            }}>
            <a key="deleteRow">Delete</a>
          </PopconfirmPage>
        </FunctionPermission>
      ],
    },
  ];

  const getList = async (params: APISystem.MenuListItemDataType) => {
    if (params?.status?.length > 0) {
      const list = await statusConversionType(params.status, dataItemStatus)
      params.status = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
    }

    if (params?.type?.length > 0) {
      const list = await statusConversionType(params.type, menuType)
      params.type = list?.map((param: any) => encodeURIComponent(param)).join(',') || []
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

  const downloadMenuAttribute = async () =>{
    const res = await downloadMenuManageAssignedAttributeService()
    if (res && res.length > 0){
      let blob = new Blob([JSON.stringify(res)],{type: 'application/json;charset=utf-8'});
      FileSaver.saveAs(blob,'menu-attribute.json');
    }

  }
  const downloadMenu = async () =>{
    const res = await downloadMenuManageService()
    if (res && res.length > 0){
      let blob = new Blob([JSON.stringify(res)],{type: 'application/json;charset=utf-8'});
      FileSaver.saveAs(blob,'menu.json');
    }
  }
  const changeData = (e: any) =>{
    if (e === 2){
      setHiddenFormItem(true)
      return;
    }
    setHiddenFormItem(false)
  }
  const changeHandle = (e: any) =>{
    if (!e){
      setHiddenFormItem(false)
    }
    handleModalVisible(e)
  }

  const handleRowSelection = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelection,
  };

  return (
    <PageContainer>
      <ProTable<APISystem.MenuListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        rowSelection={rowSelection}
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
        tableAlertRender={()=>{
          return `Selected ${selectedRowKeys.length} ${selectedRowKeys.length > 1 ? 'Items' : 'Item'}`
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<DownloadOutlined />}
            onClick={downloadMenu}
            type="primary"
          >
            下载menu
          </Button>,
          <Button
            key="button"
            icon={<DownloadOutlined />}
            onClick={downloadMenuAttribute}
            type="primary"
          >
            下载menu-attribute
          </Button>,
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
          <FunctionPermission code="AddMenu" key={'AddMenu'}>
            <Button
              key="button"
              onClick={() => {
                setIsEdit(false)
                setTableAdd('')
                handleModalVisible(true)
              }}
              type="primary"
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>
          </FunctionPermission>
        ]}
      />

      {modalVisible && (
        <ModalForm
          title={isEdit ? 'Edit' : 'New'}
          width="800px"
          formRef={formRef}
          open={modalVisible}
          request={getMenuInfoRequest}
          onOpenChange={changeHandle}
          onFinish={async (record: any) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType)
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType)
            }

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
                // request={async () => menuData}
                request={async () => filterDate(menuData, currentRow?.id)}
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
                    message: 'Menu Name is required',
                  },
                ]}
                label={'Menu Name'}
                name="menuName"
                placeholder={'Menu Name'}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="code"
                label={'Code'}
                placeholder={'Code'}
                disabled={isEdit}
                rules={[
                  {
                    required: true,
                    message: 'Code is required',
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="type"
                label={'Type'}
                disabled={isEdit}
                onChange={changeData}
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
            {
              !hiddenFormItem && <Col span={12}>
                <ProFormText
                  label={'Name'}
                  name="name"
                  placeholder={'Name'}
                />
              </Col>
            }

            {
              !hiddenFormItem && <Col span={12}>
                <ProFormText
                  label={'Path'}
                  name="path"
                  placeholder={'Path'}
                />
              </Col>
            }

            <Col span={12}>
              <ProFormDigit
                label={'Sort'}
                name="sort"
                placeholder={'Sort'}
              />
            </Col>
            {
              !hiddenFormItem && <Col span={12}>
                <ProFormSelect
                  name="location"
                  label={'Location'}
                  placeholder={'Please Select'}
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
            }
            <Col span={12}>
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'Status is required',
                  },
                ]}
                name="status"
                placeholder={'Please Select'}
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
                placeholder={'Please Enter Description'}
              />
              <ProFormText name="id" hidden />
            </Col>
          </Row>
        </ModalForm>
      )}

      {ScopeOpenModal && (
        <ModalForm
          title={'Metadata'}
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
