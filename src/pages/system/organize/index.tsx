import React, {Key, useEffect, useState} from 'react';
import {Button, Col, Row, Space, Tree, TreeSelect} from 'antd';
import {PageContainer} from '@ant-design/pro-components';
import {getTenantTreeService} from "@/services/system-service/tenant";
import {getOrganizeTreeService} from '@/services/system-service/organize';
import RightContainer from "@/pages/system/organize/components/rightContainer";
import commonStyle from '@/pages/common/index.less';
import styles from "@/pages/system/organize/index.less";

const Organize: React.FC = () => {
  const [tenantId, setTenantId] = useState<string|undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

  const [organTreeData, setOrganTreeData] = useState<APISystem.OrganizeListItemDataType[]>([]);
  const [selectOrganizeId, setSelectOrganizeId] = useState<Key>('');

  const [isEdit, setIsEdit] = useState(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantTreeService();
    if (tenantTreeResponse.success && tenantTreeResponse.data) {
      if (tenantTreeResponse.data?.length > 0) {
        setTenantId(tenantTreeResponse.data[0].id || undefined);
      }

      setTenantTreeData(tenantTreeResponse.data);
      return tenantTreeResponse.data;
    } else {
      setTenantId(undefined);
      setTenantTreeData([]);
      return [];
    }
  }

  const getOrganizeTreeRequest = async (tenantId: string) => {
    const organizeTreeResponse = await getOrganizeTreeService(tenantId);
    if (organizeTreeResponse.success && organizeTreeResponse.data) {
      setOrganTreeData(organizeTreeResponse.data);
      if (organizeTreeResponse.data.length > 0) {
        setSelectOrganizeId(organizeTreeResponse.data[0]?.key || '');
      } else {
        setSelectOrganizeId('');
      }
    } else {
      setOrganTreeData([]);
      setSelectOrganizeId('');
    }
  }

  const onChangeTenant = (tenantId: string) => {
    setTenantId(tenantId);
    setIsEdit(true);
  };

  const onSelectOrganize = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect01', info.node.key, selectedKeysValue, info);

    setSelectOrganizeId(info.node.key);
    setIsEdit(true);
  };

  const onAddBtn = () => {
    setIsEdit(false);
  }

  const onCancelBtn = () => {
    setIsEdit(true);
  }

  useEffect(() => {
    getTenantTreeRequest();
  }, [])

  useEffect(() => {
    if (tenantId) {
      getOrganizeTreeRequest(tenantId);
    }
  }, [tenantId])

  // @ts-ignore
  return (
    <PageContainer className={[commonStyle.pageContainer, styles.container].join(' ')} title={' '}>
      <Row className={styles.contentBox}>
        <Col className={styles.colLeftBox} span={8}>
          <TreeSelect
            treeData={tenantTreeData}
            value={tenantId}
            onChange={onChangeTenant}
            style={{width: '100%'}}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="Please select tenant"
            treeDefaultExpandAll={true}
            allowClear={false}
            filterTreeNode={true}
            fieldNames={{
              value: 'id',
              label: 'tenantName'
            }}
          />

          <Space size={10} className={styles.actionRow}>
            <Button type="primary" onClick={onAddBtn}>Add</Button>
          </Space>

          {
            organTreeData.length > 0 &&
            <Tree
              treeData={organTreeData}
              onSelect={onSelectOrganize}
              defaultSelectedKeys={[selectOrganizeId]}
              autoExpandParent={autoExpandParent}
              blockNode
              defaultExpandAll
              // expandedKeys={expandedKeys}
              // fieldNames={{ title: 'name', key: 'id'}}
            />
          }
        </Col>

        <Col className={styles.colRightBox} span={16}>
          {
            selectOrganizeId &&
            <RightContainer
              isEdit={isEdit}
              tenantId={tenantId}
              organTreeData={organTreeData}
              selectOrganizeId={selectOrganizeId}
            />
          }
        </Col>
      </Row>

      {/*{*/}
      {/*  openModal &&*/}
      {/*  <Modal*/}
      {/*    title={'Add'}*/}
      {/*    width={780}*/}
      {/*    open={openModal}*/}
      {/*    onCancel={onCancelBtn}*/}
      {/*    getContainer={false}*/}
      {/*    footer={false}*/}
      {/*  >*/}
      {/*    <OrganizeFormContent/>*/}
      {/*  </Modal>*/}
      {/*}*/}
    </PageContainer>
  );
};

export default Organize;
