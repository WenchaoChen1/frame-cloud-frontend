import React, {Key, useEffect, useState} from 'react';
import {Button, Col, Modal, Row, Space, Tree, TreeSelect} from 'antd';
import {
  PageContainer,
} from '@ant-design/pro-components';
import {getTenantTreeService} from "@/services/system-service/tenant";
import {getDictTreeService} from "@/services/system-service/dict";
import RightContainer from "@/pages/system/dict/components/rightContainer";
import styles from "@/pages/system/dict/index.less";

const Dict: React.FC = () => {
  const [tenantId, setTenantId] = useState<string|undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

  const [dictionaryTreeData, setDictionaryTreeData] = useState<APISystem.DictItemDataType[]>([]);
  const [selectDictionaryId, setSelectDictionaryId] = useState<Key>('');

  const [isEdit, setIsEdit] = useState(true);
  const [isCreate, setIsCreate] = useState(true);

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
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

  const getDictionaryTreeRequest = async (tenantId: string) => {
    const dictionaryTreeResponse = await getDictTreeService(tenantId);
    if (dictionaryTreeResponse.success && dictionaryTreeResponse.data) {
      setDictionaryTreeData(dictionaryTreeResponse.data);
      if (dictionaryTreeResponse.data.length > 0) {
        setSelectDictionaryId(dictionaryTreeResponse.data[0]?.id || '');

        setIsEdit(true);
      } else {
        setSelectDictionaryId('');
      }
    } else {
      setDictionaryTreeData([]);
      setSelectDictionaryId('');
    }
  }

  const onChangeTenant = (tenantId: string) => {
    setTenantId(tenantId);
    setIsEdit(true);
  };

  const onSelectDictionary = (selectedKeysValue: React.Key[], info: any) => {
    setSelectDictionaryId(info.node.key);
    setIsEdit(true);
  };

  const onAddBtn = async () => {
    setIsEdit(false);
    // setIsCreate(true);
  }

  const onCancelBtn = () => {
    setIsEdit(true);
    // setIsCreate(false);
  }

  useEffect(() => {
    getTenantTreeRequest();
  }, [])

  useEffect(() => {
    if (tenantId) {
      getDictionaryTreeRequest(tenantId);
    }
  }, [tenantId])

  return (
    <PageContainer className={styles.container}>
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
            dictionaryTreeData.length > 0 &&
            <Tree
              treeData={dictionaryTreeData}
              onSelect={onSelectDictionary}
              defaultSelectedKeys={[selectDictionaryId]}
              autoExpandParent={autoExpandParent}
              blockNode
              defaultExpandAll={true}
              // expandedKeys={expandedKeys}
              fieldNames={{ title: 'name', key: 'id'}}
              // className={styles.colLeftBox}
              className={styles.dictTree}
            />
          }
        </Col>

        <Col className={styles.colRightBox} span={16}>
          {
            selectDictionaryId ?
              <RightContainer
                isCreate={isCreate}
                isEdit={isEdit}
                tenantId={tenantId}
                dictionaryTreeData={dictionaryTreeData}
                selectDictionaryId={selectDictionaryId}
              />
              :
              <></>
          }
        </Col>
      </Row>

      {/*{*/}
      {/*  openAddModal &&*/}
      {/*  <Modal*/}
      {/*    title={'Add'}*/}
      {/*    width={780}*/}
      {/*    open={openAddModal}*/}
      {/*    onCancel={onCancelBtn}*/}
      {/*    getContainer={false}*/}
      {/*    footer={false}*/}
      {/*  >*/}
      {/*  </Modal>*/}
      {/*}*/}
    </PageContainer>
  );
};

export default Dict;
