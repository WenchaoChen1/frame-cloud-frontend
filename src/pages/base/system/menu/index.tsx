import { DEFAULT_PAGE_SIZE } from '@/pages/common/constant';
import {
  deleteMenuManageService,
  getMenuManageDetailService,
  getMenuManageTreeService,
  insertMenuManageService,
  updateMenuManageService,
} from '@/services/base-service/system-service/menuService';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormTreeSelect, ProFormInstance
} from '@ant-design/pro-components';
import { message, Space,Button,Row,Col } from 'antd';
import React, { useRef, useState } from 'react';
import {formatMessage} from "@umijs/max";
import {PlusOutlined} from '@ant-design/icons'
import dayjs from "dayjs";

const MenuList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const tableRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<APISystem.MenuListItemDataType>();
  const [defaultExpanded, setDefaultExpanded] = useState([]);
  const [menuData,setMenuData] = useState([])
  const [showAll,setShowAll] = useState(false)
  const [tableAdd,setTableAdd] = useState<string | undefined>('0')

  const getMenuInfoRequest = async () => {
    let parentId = tableAdd
    if (isEdit) {
      const accountDetailResponse = await getMenuManageDetailService(currentRow?.id || '');
      if (accountDetailResponse.success === true && accountDetailResponse.data) {
        return accountDetailResponse.data;
      }
    }
    return {
      parentId,
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

  const columns: ProColumns<APISystem.MenuListItemDataType>[] = [
    {
      title: 'Menu name',
      dataIndex: 'menuName',
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
      valueEnum: {
        0: {
          text: '启用',
          status: 'ENABLE',
        },
        1: {
          text: '禁用',
          status: 'FORBIDDEN',
        },
        2: {
          text: '锁定',
          status: 'LOCKING',
        },
        3: {
          text: '过期',
          status: 'EXPIRED',
        },
      },
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
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
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Menu',
        },
        1: {
          text: 'Button',
        },
      },
    },
    { title: formatMessage({ id: 'application.list.createdDate' }),hideInSearch: true, dataIndex: 'createdDate',render:(_,record)=> formatDate(record?.createdDate) },
    { title: formatMessage({ id: 'application.list.updatedDate' }),hideInSearch: true, dataIndex: 'updatedDate',render:(_,record)=> formatDate(record?.updatedDate) },
    {
      title: 'Operating',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="EditBtn"
          onClick={() => {
            setIsEdit(true);
            setCurrentRow(record);
            console.log('Edit record', record);
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
            setTableAdd(record?.parentId)
            handleModalVisible(true);
          }}
        >
          Add
        </a>,
        <a
          key="deleteRow"
          onClick={async () => {
            await deleteRow(record?.id || '');
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  const formatDate = (time:string):string =>{
    let times = '_'
    if (time){
      times = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return times
  }

  const getList = async (params: API.PageParams) => {
    let menuLists = [{menuName:'root-Directory',id:'0'}]

    params.status = params?.status?.map((item: any) => {
      if (item === '1') {
        return (item = 'FORBIDDEN');
      } else if (item === '2') {
        return (item = 'LOCKING');
      } else if (item === '3') {
        return (item = 'EXPIRED');
      } else {
        return (item = 'ENABLE');
      }
    });

    const parameters = {
      pageNumber: params?.current || 1,
      pageSize: params?.pageSize || DEFAULT_PAGE_SIZE,
      menuName: params?.menuName,
      path: params?.path,
      status: params?.status?.map((param: any) => encodeURIComponent(param)).join(',') || [],
      type: params?.type || '',
    }
    const response = await getMenuManageTreeService(parameters);

    let dataSource: APISystem.UserItemDataType[] = [];
    let total = 0;
    if (response?.success === true) {
      menuLists[0].children = [...response?.data]
      dataSource = response?.data || [];
    }
    setMenuData(menuLists)
    setTotal(total);

    return {
      data: dataSource,
      success: true,
      total: total,
    };
  };

  const openTreeData = async () =>{
    const treeDataMap = menuData[0].children
    let treeDataId = []
    if (!showAll){
      const renderData = (ele) =>{
        ele.forEach(item=>{
          treeDataId.push(item.id)
          if (item?.children && item?.children?.length > 0){
            renderData(item?.children)
          }
        })
      }
      renderData(treeDataMap)
    }
    setDefaultExpanded(treeDataId)
  }
  return (
    <PageContainer>
      <ProTable<APISystem.MenuListItemDataType, APISystem.PageParams>
        headerTitle={'List'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        request={getList}
        columns={columns}
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
              setTableAdd('0')
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
          onFinish={async (record) => {
            let response = undefined;
            if (isEdit) {
              response = await handleUpdate(record as APISystem.MenuListItemDataType);
            } else {
              response = await handleAdd(record as APISystem.MenuListItemDataType);
            }
            console.log('onFinish response', response);

            if (response) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          initialValues={{
            id: currentRow?.id,
            name: currentRow?.name,
            parentId: currentRow?.parentId,
            code: currentRow?.code,
            path: currentRow?.path,
            location: currentRow?.location,
            permission: currentRow?.permission,
            sort: currentRow?.sort,
            status: currentRow?.status,
            hidden: currentRow?.hidden,
            usageType: currentRow?.usageType,
            platformUse: currentRow?.platformUse,
            tenantEnable: currentRow?.tenantEnable,
            type: currentRow && currentRow.type,
            url: currentRow?.url,
            description: currentRow?.description,
          }}
        >
            <Row gutter={16}>
              <Col span={24}>
                <ProFormTreeSelect
                  label={'previousMenu'}
                  name="parentId"
                  placeholder="Please select"
                  allowClear
                  secondary
                  request={async () => {
                    return menuData
                  }}
                  // tree-select args
                  fieldProps={{
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
                  rules={[
                    {
                      required: true,
                      message: 'Previous menu is required',
                    },
                  ]}
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
                  initialValue={0}
                  options={[
                    {
                      value: 1,
                      label: 'Button',
                    },
                    {
                      value: 0,
                      label: 'Menu',
                    },
                  ]}
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
                  initialValue={'LEFT-MENU'}
                  options={[
                    {
                      value: 'LEFT-MENU',
                      label: 'Left Menu',
                    },
                    {
                      value: 'OTHER',
                      label: 'Other',
                    },
                  ]}
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
                  options={[
                    {
                      label: '启用',
                      value: 0,
                    },
                    {
                      label: '禁用',
                      value: 1,
                    },
                    {
                      label: '锁定',
                      value: 2,
                    },
                    {
                      label: '过期',
                      value: 3,
                    },
                  ]}
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
    </PageContainer>
  );
};

export default MenuList;
