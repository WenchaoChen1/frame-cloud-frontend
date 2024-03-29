import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoAuthorizedPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>Back Home</Button>
    }
  />
);

export default NoAuthorizedPage;
