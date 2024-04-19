// @ts-ignore
/* eslint-disable */

declare namespace APISystem {
  type GetAccountInfoBody = {
    currentAccountId?: string;
  }
  type UserResponseDataType = {
    data?: UserResponseListDataType;
    code?: string;
    success?: boolean;
    message?: string;
  };
  type PageParams = {
    current?: number;
    pageSize?: number;
  };
  type AllUserResponseDataType = {
    data?: UserItemDataType[];
    code?: string;
    success?: boolean;
    message?: string;
  };
  type UserItemDataType = {
    id?: string;
    username?: string;
    mobile?: string;
    email?: string,
    gender?: number,
    avatar?: string;
    status?: number,
    lastLoginTime?: string,
    description?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
  };

  type moveMenuDataType = {
    id: string|undefined;
    moveOperation: string;
  }
  type MenuListDataType = {
    total?: number;
    success?: boolean;
    data?: MenuListItemDataType[];
  };
  type TenantListResponseDataType = {
    data?: TenantItemDataType[];
    code?: string;
    success?: boolean;
    message?: string;
  };
  type MenuListItemDataType = {
    id?: string;
    parentId?: string;
    name?: string;
    parentName?: string;
    code?: string;
    path?: string;
    location?: number;
    description?: string;
    sort?: number;
    status?: number;
    type?: number;
    hidden?: number;
    usageType?: number;
    platformUse?: number;
    icon?: string;
    url?: string;
    permission?: string;
    tenantEnable?: number;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    children?: MenuListItemDataType[];
    checked?: number;
    checkedMenuId?: string[];
    halfCheckedMenuId?: string[];
  };
  type TenantItemDataType = {
    id?: string;
    tenantName?: string;
    description?: string;
    status?: number;
    type?: number;
    parentId?: string;
    tenantCode?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    children?: TenantItemDataType[];
  };
}
