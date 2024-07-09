import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet, ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
  ProFormInstance
} from '@ant-design/pro-components';
import { Button, message, Upload,Row,Col } from 'antd';
import React, {useState,useRef} from 'react';
import {getUserSettingsDetailService,updateUserSettingsDetailService} from '@/services/base-service/system-service/userService'
import useStyles from './index.style';
import {enumsService} from "@/services/base-service/system-service/commService";
import {getAccountSettingsDetailService} from '@/services/base-service/system-service/userService'

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const [userInfo,setUserInfo] = useState({})
  const modalForm = useRef<ProFormInstance>();
  const [dataItemStatus, setDataItemStatus] = useState<any>([]);
  const [modalFlag,setModalFlag] = useState(false)
  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
  // const { data: currentUser } = useRequest(() => {
  //   return getUserSettingsDetailService();
  // });
  const getAvatarURL = () => {
    // if (currentUser) {
    //   if (currentUser.avatar) {
    //     return currentUser.avatar;
    //   }
    //   const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    //   return url;
    // }
    return '';
  };
  const handleFinish = async (e) => {
    const params = {...userInfo,...e}
    const res = await updateUserSettingsDetailService(params)
    if (res.success){
      message.success('update successfully!')
      getUserInfo()
    }
  };

  const getUserInfo = async () =>{
    let data = {}
    const res = await getUserSettingsDetailService()
    if (res.success){
      setUserInfo(res.data)
      data = res.data
    }
    return data
  }

  const initType = async () => {
    const response = await enumsService();
    let data = []
    if (response?.success === true) {
      setDataItemStatus(response?.data?.sysDataItemStatus);
      data = response?.data?.sysDataItemStatus?.map(item=>{
        return{
          label:item.name,
          value:item.value
        }
      })
    }
    return data
  }

  const changeValidator = (rule, value, callback) =>{
    let newPassword = ''
    if (modalForm?.current){
      newPassword = modalForm?.current?.getFieldFormatValue('newPassword')
    }
    if (value && value !== newPassword){
      callback('two passwords do not match!')
    }
    callback();
  }
  const onOpenChangeModal = (e) =>{
    if (!e){
      setModalFlag(false)
      if (modalForm?.current){
        modalForm.current.resetFields()
      }
    }
  }

  return (
    <div className={styles.baseView}>
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              grid={true}
              rowProps={{gutter: 16}}
              onFinish={handleFinish}
              request={getUserInfo}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                password:dataItemStatus.password ? dataItemStatus.password:'******'
              }}
              hideRequiredMark
            >
              <ProFormText
                name="username"
                label="User Name"
                disabled
                colProps={{
                  span: 12,
                }}
                rules={[
                  {
                    required: true,
                    message: 'User Name is required!',
                  },
                ]}
              />
              <ProFormText
                name="phoneNumber"
                label="PhoneNumber"
                disabled
                colProps={{
                  span: 12,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Phone Number is required!',
                  },
                ]}
              />
              <ProFormText
                label={'First Name'}
                name="firstName"
                colProps={{
                  span: 12,
                }}
                rules={[
                  {
                    required: true,
                    message: 'First Name is required',
                  },
                ]}
                placeholder={'First Name'}
              />
              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Last Name is required',
                  },
                ]}
                colProps={{
                  span: 12,
                }}
                label={'Last Name'}
                name="lastName"
                placeholder={'Last Name'}
              />

              <ProFormText
                rules={[
                  {
                    required: true,
                    message: 'Email is required',
                  },
                ]}
                colProps={{
                  span: 12,
                }}
                label={'Email'}
                name="email"
                placeholder={'Email'}
              />
              <ProFormText
                label={'Avatar'}
                name="avatar"
                colProps={{
                  span: 12,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Avatar is required',
                  },
                ]}
                placeholder={'Avatar'}
              />
              <ProFormText
                label={'Nickname'}
                colProps={{
                  span: 12,
                }}
                rules={[
                  {
                    required: true,
                    message: 'Nickname is required',
                  },
                ]}
                name="nickname"
                placeholder={'Nickname'}
              />
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: 'Status is required',
                  },
                ]}
                disabled
                colProps={{
                  span: 12,
                }}
                name="status"
                label={'Status'}
                request={initType}
              />
              <ProFormTextArea
                colProps={{
                  span: 12,
                }}
                name="description"
                label={'Description'}
                placeholder={'Please enter description'}
              />
              <ProFormRadio.Group
                rules={[
                  {
                    required: true,
                    message: 'Gender is required',
                  },
                ]}
                initialValue={1}
                colProps={{
                  span: 12,
                }}
                name="gender"
                label={'Gender'}
                options={[
                  {
                    value: 0,
                    label: 'male',
                  },
                  {
                    value: 1,
                    label: 'female',
                  },
                ]}
              />
            </ProForm>
          </div>
          {/*<div className={styles.right}>*/}
          {/*  <AvatarView avatar={getAvatarURL()} />*/}
          {/*</div>*/}
        </>
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="重置密码"
        open={modalFlag}
        width={'30%'}
        formRef={modalForm}
        onOpenChange={onOpenChangeModal}
      >
        <ProFormText.Password
          name="initialPassword"
          label="初始密码"
          rules={[
            {
              required: true,
              message: 'initial password is required',
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
    </div>
  );
};
export default BaseView;
