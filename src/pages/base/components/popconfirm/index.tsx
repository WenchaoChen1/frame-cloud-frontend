import React from 'react';
import {Popconfirm} from 'antd';
interface paramsType {
  children:any,
  onConfirm:any,
}
function Index({
     children,
     onConfirm,
   }:paramsType) {
  return (
    <Popconfirm
      okText='Yes'
      cancelText='No'
      title='Delete the task'
      description='Are you sure to delete this task?'
      onConfirm={onConfirm}
    >
      {children}
    </Popconfirm>
  );
}

export default Index;
