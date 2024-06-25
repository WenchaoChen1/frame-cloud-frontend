import React from 'react';
import {Popconfirm} from 'antd';
interface paramsType {
  children:any,
  onConfirm:any,
  okText:string,
  cancelText:string,
  title:string,
  description:string
}
function Index({
     children,
     onConfirm,
     okText="Yes",
     cancelText="No",
     title="Delete the task",
     description="Are you sure to delete this task?",
   }:paramsType) {
  return (
    <Popconfirm
      okText={okText}
      cancelText={cancelText}
      title={title}
      description={description}
      onConfirm={onConfirm}
    >
      {children}
    </Popconfirm>
  );
}

export default Index;
