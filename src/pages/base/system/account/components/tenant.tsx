import React, {useEffect, useState} from 'react';
import commonStyle from "@/pages/common/index.less";
import {ModalForm} from "@ant-design/pro-components";
import styles from "@/pages/base/system/tenant/index.less";
import {Tree,message} from "antd";
import {
  getAccountManageTenantMenuTreeService,
  updateAccountAssignedTenantMenuService,
  getAllTenantMenuIdByAccountIdService
} from '@/services/base-service/system-service/accountService';

interface Interface {
  currentRow:any,
  tenantId:string,
  closeRole:()=>void,
  actionRef:any,
  tenantModal:boolean
}
function Tenant({currentRow,tenantId,closeRole,actionRef,tenantModal}:Interface) {
  const [modalVisible,setModalVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [allMenuTree, setAllMenuTree] = useState<APISystem.MenuListItemDataType[]>([]);


  // 根据 ID 在树形结构中查找节点
  const findNodeById = (id, treeData) => {
    for (let i = 0; i < treeData?.length; i++) {
      const node = treeData[i];
      if (node.tenantMenuId === id) {
        return node;
      }
      if (node?.children && node?.children?.length > 0) {
        const foundNode = findNodeById(id, node?.children);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };

  // 获取节点及其所有子节点的 ID
  const getAllChildIds = (node: any) => {
    let childIds = [];
    if (node?.children && node?.children?.length > 0) {
      for (let i = 0; i < node?.children?.length; i++) {
        const childNode = node?.children[i];
        childIds.push(childNode.tenantMenuId);
        childIds = [...childIds, ...getAllChildIds(childNode)];
      }
    }
    return childIds;
  };

  const onCheck = (checkedKeysValue: any, info: any) => {
    // 当前点击的节点的id
    const currentCheckedKey = info.node.tenantMenuId;
    const node = findNodeById(currentCheckedKey, allMenuTree);
    if (node) {
      // 当前点击节点的所有子节点
      const childIds = getAllChildIds(node);
      const isChecked = checkedKeysValue?.checked?.includes(currentCheckedKey);
      let updatedCheckedKeys = [];
      // 判断当前点击节点是选中(isChecked)还是取消勾选(!isChecked)的状态
      if (!isChecked) {
        updatedCheckedKeys = checkedKeysValue?.checked?.filter(
          key => !childIds.includes(key)
        );
      } else {
        updatedCheckedKeys = [...checkedKeysValue?.checked, ...childIds];
      }
      setCheckedKeys(updatedCheckedKeys);
    } else {
      setCheckedKeys(checkedKeysValue?.checked);
    }
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
    if (tenantModal){
      getTree(currentRow?.tenantId)
    }else{
      clearDatas()
    }
  },[tenantModal])

  const clearDatas = () =>{
    setModalVisible(false)
    setCheckedKeys([])
    setSelectedKeys([])
    setAllMenuTree([])
  }

  const getTree = async (tenantId:string) =>{
    const res:any = await getAccountManageTenantMenuTreeService(tenantId)
    if (res.success){
      setAllMenuTree(res?.data)
    }
    await getDetails(currentRow?.accountId)
    setModalVisible(tenantModal)
  }
  const getDetails = async (accountId:string) =>{
    const res:any = await getAllTenantMenuIdByAccountIdService(accountId)
    if (res.success){
      setCheckedKeys(res.data || [])
    }
  }

  const onFinish = async () =>{
    const query:any = {
      tenantMenuIds:checkedKeys,
      accountId:currentRow?.accountId
    }
    const res = await updateAccountAssignedTenantMenuService(query)
    if (res.success){
      message.success('Update successfully');
      closeRole()
      actionRef?.current.reload()
    }
  }
  return (
    <div>
      <ModalForm
        title={'Menu'}
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
            checkStrictly
            defaultExpandAll
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={allMenuTree}
            fieldNames={{ title: 'menuName', key: 'tenantMenuId' }}
          />
        </div>
      </ModalForm>
    </div>
  );
}

export default Tenant;
