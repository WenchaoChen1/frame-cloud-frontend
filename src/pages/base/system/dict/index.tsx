import RightContainer from '@/pages/base/system/dict/components/rightContainer';
import styles from '@/pages/base/system/dict/index.less';
import { getDictTreeService } from '@/services/base-service/system-service/dict';
import { getTenantManageTreeService } from '@/services/base-service/system-service/tenantService';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Row, Space, Tree, TreeSelect } from 'antd';
import React, { Key, useEffect, useState } from 'react';

const Dict: React.FC = () => {
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);

  const [dictionaryTreeData, setDictionaryTreeData] = useState<APISystem.DictItemDataType[]>([]);
  const [selectDictionaryId, setSelectDictionaryId] = useState<Key>('');

  const [isEdit, setIsEdit] = useState(true);

  const [isRefresh, setIsRefresh] = useState(false);

  const getTenantTreeRequest = async () => {
    const tenantTreeResponse = await getTenantManageTreeService({});
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
  };

  const getDictionaryTreeRequest = async (getTenantId: string | undefined) => {
    if (!getTenantId) {
      return;
    }

    const dictionaryTreeResponse = await getDictTreeService(getTenantId);
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
  };

  const onChangeTenant = (getTenantId: string) => {
    setTenantId(getTenantId);
    setIsEdit(true);
  };

  const onSelectDictionary = (selectedKeysValue: React.Key[], info: any) => {
    setSelectDictionaryId(info.node.key);
    setIsEdit(true);
  };

  const onAddBtn = async () => {
    setIsEdit(false);
  };

  const refreshParent = () => {
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

  useEffect(() => {
    getDictionaryTreeRequest(tenantId);
  }, [tenantId, isRefresh]);

  return (
    <PageContainer className={styles.container}>
      <Row className={styles.contentBox}>
        <Col className={styles.colLeftBox} span={8}>
          <TreeSelect
            treeData={tenantTreeData}
            value={tenantId}
            onChange={onChangeTenant}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select tenant"
            treeDefaultExpandAll={true}
            allowClear={false}
            filterTreeNode={true}
            fieldNames={{
              value: 'id',
              label: 'tenantName',
            }}
          />

          <Space size={10} className={styles.actionRow}>
            <Button type="primary" onClick={onAddBtn}>
              Add
            </Button>
          </Space>

          {dictionaryTreeData.length > 0 && (
            <Tree
              treeData={dictionaryTreeData}
              onSelect={onSelectDictionary}
              defaultSelectedKeys={[selectDictionaryId]}
              autoExpandParent={true}
              blockNode
              defaultExpandAll={true}
              fieldNames={{ title: 'name', key: 'id' }}
              className={styles.dictTree}
            />
          )}
        </Col>

        <Col className={styles.colRightBox} span={16}>
          {selectDictionaryId ? (
            <RightContainer
              refreshParent={refreshParent}
              isEdit={isEdit}
              tenantId={tenantId}
              dictionaryTreeData={dictionaryTreeData}
              selectDictionaryId={selectDictionaryId}
            />
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dict;
