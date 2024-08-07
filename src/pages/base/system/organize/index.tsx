import RightContainer from '@/pages/base/system/organize/components/rightContainer';
import styles from '@/pages/base/system/organize/index.less';
import commonStyle from '@/pages/common/index.less';
import { getOrganizeTreeService } from '@/services/base-service/system-service/organize';
import { getTenantManageTreeService } from '@/services/base-service/system-service/tenantService';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Row, Space, Tree, TreeSelect } from 'antd';
import React, { Key, useEffect, useState } from 'react';

const Organize: React.FC = () => {
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [tenantTreeData, setTenantTreeData] = useState<APISystem.TenantItemDataType[]>([]);
  const [organTreeData, setOrganTreeData] = useState<APISystem.OrganizeListItemDataType[]>([]);
  const [selectOrganizeId, setSelectOrganizeId] = useState('');
  const [isEdit, setIsEdit] = useState(true);

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

  const getOrganizeTreeRequest = async (getTenantId: string) => {
    const organizeTreeResponse = await getOrganizeTreeService(getTenantId);
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
  };

  const onChangeTenant = (getTenantId: string) => {
    setTenantId(getTenantId);
    setIsEdit(true);
  };

  const onSelectOrganize = (selectedKeysValue: React.Key[], info: any) => {
    setSelectOrganizeId(info.node.key);
    setIsEdit(true);
  };

  const onAddBtn = () => {
    setIsEdit(false);
  };

  useEffect(() => {
    getTenantTreeRequest();
  }, []);

  useEffect(() => {
    if (tenantId) {
      getOrganizeTreeRequest(tenantId);
    }
  }, [tenantId]);

  return (
    <PageContainer className={[commonStyle.pageContainer, styles.container].join(' ')} title={' '}>
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

          {organTreeData.length > 0 && (
            <Tree
              treeData={organTreeData}
              onSelect={onSelectOrganize}
              defaultSelectedKeys={[selectOrganizeId]}
              blockNode
              defaultExpandAll
            />
          )}
        </Col>

        <Col className={styles.colRightBox} span={16}>
          {selectOrganizeId &&
            <RightContainer
              isEdit={isEdit}
              tenantId={tenantId}
              organTreeData={organTreeData}
              selectOrganizeId={selectOrganizeId}
            />
          }
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Organize;
