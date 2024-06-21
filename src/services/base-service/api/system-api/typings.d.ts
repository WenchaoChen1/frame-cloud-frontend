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
    tenantId?: string;
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
    phoneNumber?: string;
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

  type AccountResponseDataType = {
    data?: AccountResponseListDataType;
    code?: string;
    success?: boolean;
    message?: string;
  };
  type AccountResponseListDataType = {
    content?: AccountItemDataType[];
    totalElements?: number;
  }
  type AccountDetailResponseDataType = {
    data?: AccountItemDataType;
    code?: string;
    success?: boolean;
    message?: string;
  };
  type AccountItemDataType = {
    id?: string;
    identity?: string;
    name?: string;
    type?: string;
    accountTypeConstants?: string;
    email?: string;
    tenantId?: string;
    role?: string;
    user?: UserItemDataType;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
  };
  type AccountListResponseDataType = {
    data?: AccountItemDataType[];
    code?: string;
    success?: boolean;
    message?: string;
  };

  type PermissionItemDataType = {
    permissionId?: string;
    permissionName?: string;
    permissionCode?: string;
    permissionType?: string;
    status?: number;
  };

  type onSaveRelationMenuResponseDataType = {
    code?: string;
    data?: any
    success?: boolean;
    message?: string;
  };
  type SelectedRelationMenuDataType = {
    total?: number;
    success?: boolean;
    data?: MenuListItemDataType;
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
  type onSaveMenuInTenantDataType = {
    tenantId: string;
    menuIds: React.Key[];
  }
  type RoleItemDataType = {
    id?: string;
    roleName?: string;
    parentId?: string;
    code?: string;
    status?: number,
    sort?: number,
    description?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
  };

  type RoleDetailResponseDataType = {
    data?: RoleItemDataType;
    code?: string;
    success?: boolean;
    message?: string;
  };

  type RoleResponseDataType = {
    data?: RoleItemDataType[];
    code?: string;
    success?: boolean;
    message?: string;
  };

  type RoleByTenantIdResponseDataType = {
    data?: RoleItemDataType[];
    code?: string;
    success?: boolean;
    message?: string;
  };
  type onSaveMenuInRoleDataType = {
    roleId: string;
    checkedMenuId: React.Key[];
    halfCheckedMenuId: React.Key[];
  }
  type RoleTableSearchParams = {
    current?: number;
    pageSize?: number;
    status?: string;
    roleName?: string;
    tenantId?: string;
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

  type MenuListDataType = {
    total?: number;
    success?: boolean;
    data?: MenuListItemDataType[];
  };

  type MenuIconDataType = {
    [key: string]: string;
  };

  type SelectedRelationMenuDataType = {
    total?: number;
    success?: boolean;
    data?: MenuListItemDataType;
  };

  type OrganizeListItemDataType = {
    id?: string;
    key: string;
    tenantId?: string;
    parentId?: string;
    name?: string;
    code?: string;
    shortName?: string;
    status?: number;
    sort?: number;
    description?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    children?: OrganizeListItemDataType[];
  };

  type OrganizeListResponseDataType = {
    success?: boolean;
    code?: string;
    message?: string;
    data?: OrganizeListItemDataType[];
  };

  type OrganizeInfoResponseDataType = {
    success?: boolean;
    code?: string;
    message?: string;
    data?: OrganizeListItemDataType;
  };

  type DictItemDataType = {
    id?: string;
    name?: string;
    key: string;
    parentId?: string;
    tenantId?: string;
    code?: string;
    status?: number,
    sort?: number,
    description?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    children?: DictItemDataType[];
  };

  type DictListResponseDataType = {
    code?: string;
    success?: boolean;
    message?: string;
    data?: DictItemDataType[];
  };

}