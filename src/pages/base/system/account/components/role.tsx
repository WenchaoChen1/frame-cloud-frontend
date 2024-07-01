import React, {useEffect, useState} from 'react';
import commonStyle from "@/pages/common/index.less";
import {ModalForm, ProFormText} from "@ant-design/pro-components";
import styles from "@/pages/base/system/tenant/index.less";
import {Tree,message} from "antd";
import {
  getAccountManageRoleTreeService,
  getAllRoleIdByAccountIdService,
  updateAccountAssignedRoleService
} from '@/services/base-service/system-service/accountService';

interface Interface {
  currentRow:any,
  tenantId:string,
  closeRole:()=>void,
  actionRef:any,
  roleModal:boolean
}
function Role({currentRow,tenantId,closeRole,actionRef,roleModal}:Interface) {
  const [modalVisible,setModalVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);
  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue: any) => {
    setSelectedKeys(selectedKeysValue);
  };
  const onOpenChange = (e:boolean) =>{
    if (!e){
      closeRole()
    }
  }
  useEffect( ()=>{
    if (roleModal){
      getTree(tenantId)
    }else{
      clearDatas()
    }
  },[roleModal])

  const clearDatas = () =>{
    setModalVisible(false)
    setCheckedKeys([])
    setSelectedKeys([])
    setAllMenuTree([])
  }

  const getTree = async (tenantId:string) =>{
    const res:any = await getAccountManageRoleTreeService(tenantId)
    if (res.success){
      setAllMenuTree(res?.data)
    }
    await getDetails(currentRow?.accountId)
    setModalVisible(true)
  }
  const getDetails = async (accountId:string) =>{
    const res:any = await getAllRoleIdByAccountIdService(accountId)
    if (res.success){
      setCheckedKeys(res.data || [])
    }
  }

  const onFinish = async () =>{
    const query:any = {
      roleIds:checkedKeys,
      accountId:currentRow?.accountId
    }
    const res = await updateAccountAssignedRoleService(query)
    if (res.success){
      message.success('Update successfully');
      closeRole()
      actionRef?.current.reload()
    }
  }
  return (
    <div>
      <ModalForm
        title={'Role Menu'}
        width="500px"
        open={modalVisible}
        onOpenChange={onOpenChange}
        initialValues={{
          id: currentRow?.id,
        }}
        onFinish={onFinish}
        className={commonStyle.pageContainer}
      >
        <div className={styles.tenantMenuTree}>
          <Tree
            height={500}
            checkable
            defaultExpandAll
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={allMenuTree}
            fieldNames={{ title: 'roleName', key: 'roleId' }}
          />
        </div>
      </ModalForm>
    </div>
  );
}

export default Role;
