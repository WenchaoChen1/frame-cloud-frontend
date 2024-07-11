import React, {useEffect, useState} from 'react';
import commonStyle from "@/pages/common/index.less";
import {ModalForm} from "@ant-design/pro-components";
import styles from "@/pages/base/system/tenant/index.less";
import {Tree,message} from "antd";
import {
  getAccountManageBusinessPermissionTreeService,
  getAllBusinessPermissionIdByAccountIdService,
  updateAccountAssignedBusinessPermissionService
} from '@/services/base-service/system-service/accountService';

interface Interface {
  currentRow:any,
  tenantId:string,
  closeRole:()=>void,
  actionRef:any,
  binessModal:boolean
}
function Biness({currentRow,tenantId,closeRole,actionRef,binessModal}:Interface) {
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
    if (binessModal){
      getTree(currentRow?.tenantId)
    }else{
      clearDatas()
    }
  },[binessModal])

  const clearDatas = () =>{
    setModalVisible(false)
    setCheckedKeys([])
    setSelectedKeys([])
    setAllMenuTree([])
  }

  const getTree = async (tenantId:string) =>{
    const res:any = await getAccountManageBusinessPermissionTreeService(tenantId)
    if (res.success){
      setAllMenuTree(res?.data)
    }
    await getDetails(currentRow?.accountId)
    setModalVisible(true)
  }
  const getDetails = async (accountId:string) =>{
    const res:any = await getAllBusinessPermissionIdByAccountIdService(accountId)
    if (res.success){
      setCheckedKeys(res.data || [])
    }
  }

  const onFinish = async () =>{
    const query:any = {
      businessPermissionIds:checkedKeys,
      accountId:currentRow?.accountId
    }
    const res = await updateAccountAssignedBusinessPermissionService(query)
    if (res.success){
      message.success('Update successfully');
      closeRole()
      actionRef?.current.reload()
    }
  }
  return (
    <div>
      <ModalForm
        title={'Business Menu'}
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
            fieldNames={{ title: 'name', key: 'businessPermissionId' }}
          />
        </div>
      </ModalForm>
    </div>
  );
}

export default Biness;
