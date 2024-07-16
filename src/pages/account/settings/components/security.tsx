import { List } from 'antd';
import React, {useRef, useState} from 'react';
import {ModalForm, ProFormText,ProFormInstance} from "@ant-design/pro-components";
import {resetPasswordService} from '@/services/base-service/system-service/userService'

type Unpacked<T> = T extends (infer U)[] ? U : T;

  const passwordStrength = {
    strong: <span className="strong">强</span>,
    medium: <span className="medium">中</span>,
    weak: <span className="weak">弱 Weak</span>,
  };

  const SecurityView: React.FC = () => {
    const [modalFlag,setModalFlag] = useState(false)
    const modalForm = useRef<ProFormInstance>();
    const getData = () => [
      {
        title: '账户密码',
        description: (
          <>
            当前密码强度：
            {passwordStrength.strong}
          </>
        ),
        actions: [<a key="Modify" onClick={()=>setModalFlag(true)}>修改</a>],
      },
      {
        title: '密保手机',
        description: `已绑定手机：138****8293`,
        actions: [<a key="Modify">修改</a>],
      },
      {
        title: '密保问题',
        description: '未设置密保问题，密保问题可有效保护账户安全',
        actions: [<a key="Set">设置</a>],
      },
      {
        title: '备用邮箱',
        description: `已绑定邮箱：ant***sign.com`,
        actions: [<a key="Modify">修改</a>],
      },
      {
        title: 'MFA 设备',
        description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
        actions: [<a key="bind">绑定</a>],
      },
    ];
    const onOpenChangeModal = (e: any) =>{
      if (!e){
        setModalFlag(false)
        if (modalForm?.current){
          modalForm.current.resetFields()
        }
      }
    }

  const changeValidator = (rule: any, value: any, callback: any) =>{
    let newPassword = ''
    if (modalForm?.current){
      newPassword = modalForm?.current?.getFieldFormatValue('newPassword')
    }
    if (value && value !== newPassword){
      callback('two passwords do not match!')
    }
    callback();
  }

  const submitForm = async (e: any) =>{
    const {originalPassword,newPassword} = e
    const res = resetPasswordService({originalPassword,newPassword})
    console.log(res)
  }

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="重置密码"
        open={modalFlag}
        width={'30%'}
        formRef={modalForm}
        onFinish={submitForm}
        onOpenChange={onOpenChangeModal}
      >
        <ProFormText.Password
          name="originalPassword"
          label="初始密码"
          rules={[
            {
              required: true,
              message: 'original password is required',
            },
          ]}
        />
        <ProFormText.Password
          name="newPassword"
          label="新密码"
          rules={[
            {
              required: true,
              message: 'new password is required',
            },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="确认密码"
          rules={[
            {
              required: true,
              message: 'confirm password is required',
            },
            {validator: changeValidator}
          ]}
        />
      </ModalForm>
    </>
  );
};

export default SecurityView;
