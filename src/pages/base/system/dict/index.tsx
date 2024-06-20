import React, {Key, useEffect, useState} from 'react';
import {Button, Col, Modal, Row, Space, Tree, TreeSelect} from 'antd';
import {
  PageContainer,
} from '@ant-design/pro-components';
import {getTenantManageTreeService} from "@/services/base-service/system-service/tenantService";
import {getDictTreeService} from "@/services/base-service/system-service/dict";
import RightContainer from "@/pages/base/system/dict/components/rightContainer";
import styles from "@/pages/base/system/dict/index.less";

const Dict: React.FC = () => {
  const [tenantId, setTenantId] = useState<string|undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

  const [dictionaryTreeData, setDictionaryTreeData] = useState<APISystem.DictItemDataType[]>([]);
  const [selectDictionaryId, setSelectDictionaryId] = useState<Key>('');

  const [isEdit, setIsEdit] = useState(true);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const [isRefresh, setIsRefresh] = useState(false);

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantManageTreeService();
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

  const getDictionaryTreeRequest = async (tenantId: string|undefined) => {
    if (!tenantId) {
      return;
    }

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
  }

  const refreshParent = () => {
    setIsRefresh(!isRefresh);
  }

  useEffect(() => {
    getTenantTreeRequest();
  }, [])

  useEffect(() => {
      getDictionaryTreeRequest(tenantId);
  }, [tenantId, isRefresh])

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
                refreshParent={refreshParent}
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
    </PageContainer>
  );
};

export default Dict;
