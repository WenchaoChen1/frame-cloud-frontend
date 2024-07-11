import React from 'react';
import { useAccess, Access } from '@umijs/max';
import permissions from "@/utils/permissions";
const {permissionButton} = permissions
interface Props {
  code:string,
  children:any
}
function Index({code,children}:Props) {
  const access = useAccess();
  return (
    <Access accessible={access?.buttonPermission({name:permissionButton[code]})}>
      {children}
    </Access>
  );
}

export default Index;
