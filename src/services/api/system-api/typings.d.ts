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
}
