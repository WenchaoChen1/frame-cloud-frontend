import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import {useEffect, useRef, useState} from 'react';
import {getAccountSettingsDetailService,updateAccountSettingsDetailService} from '@/services/base-service/system-service/userService'
import { enumsService } from '@/services/base-service/system-service/commService';
import React from 'react';
import {message} from "antd";
type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  accountId: string;
};

function Account() {
  const modalFormData = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [accountType,setAccountType] = useState([])
  const [modalDatas,setModalDatas] = useState({accountId: ''})
  const [modalFlag,setModalFlag] = useState(false)
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'name',
      title: 'name',
    },
    {
      title: 'tenantName',
      dataIndex: 'tenantName',
      copyable: true,
      ellipsis: true,
    },
    {
      disable: true,
      title: 'type',
      dataIndex: 'type',
      ellipsis: true,
      valueType: 'select',
      valueEnum: accountType?.reduce((result: any, type: any) => {
        result[type?.value] = {
          text: type?.name,
          status: type?.value,
        };
        return result;
      }, {}),
    },
    {
      title: 'operation',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setModalDatas(record)
            setModalFlag(true)
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  const getTableDatas = async () =>{
    let data = []
    const res = await getAccountSettingsDetailService()
    if (res.success){
      data = res.data
    }
    return {
      data,
      success: true,
    }
  }
  const initType = async () => {
    const response = await enumsService();
    if (response?.success === true) {
      setAccountType(response?.data?.sysAccountType);
    }
  };
  useEffect(()=>{
    initType()
  },[])

  const submitForm = async (e: any) =>{
    const {name} = e
    const {accountId} = modalDatas
    const res = await updateAccountSettingsDetailService({
      accountId,
      name
    })
    if (res.success){
      message.success('update successfully!')
      actionRef?.current?.reload()
      setModalFlag(false)
      if (modalFormData?.current){
        modalFormData.current.resetFields()
      }
    }
  }
  const onOpenChangeModal = (e: any) =>{
    if (!e){
      setModalFlag(false)
      if (modalFormData?.current){
        modalFormData.current.resetFields()
      }
    }
  }
  return (
    <>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={getTableDatas}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
      />
      {
        modalFlag && <ModalForm<{
          name: string;
          company: string;
        }>
          title="Edit"
          open={modalFlag}
          width={'30%'}
          formRef={modalFormData}
          onFinish={submitForm}
          onOpenChange={onOpenChangeModal}
          initialValues={{...modalDatas}}
        >
          <ProFormText
            name="name"
            label="name"
            rules={[
              {
                required: true,
                message: 'name is required',
              },
            ]}
          />
        </ModalForm>
      }

    </>
  );
}

export default Account;
