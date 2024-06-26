import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { getToken, removeToken } from '@/utils/utils';
import { history } from '@umijs/max';
import {LOGIN_PATH} from "@/pages/common/constant";
// TODO
// import { message, notification } from 'antd';
// import {oauth2RefreshTokenService} from "@/services/base-service/identity-service/login";
// const axios = require('axios');

// TODO
// 错误处理方案： 错误类型
// enum ErrorShowType {
  // SILENT = 0,
  // WARN_MESSAGE = 1,
  // ERROR_MESSAGE = 2,
  // NOTIFICATION = 3,
  // REDIRECT = 9,
// }

// 与后端约定的响应数据格式
// TODO
// interface ResponseStructure {
//   success: boolean;
//   data: any;
//   errorCode?: number;
//   errorMessage?: string;
//   showType?: ErrorShowType;
// }

const authHeaderInterceptor = (config: RequestOptions) => {
  const filter = [
    '/api/gstdev-system/user/login',
    '/api/gstdev-identity/oauth2/token',
    '/api/gstdev-system/v1/user/update-customer-user-password',
  ];
  const url = config?.url || '';
  if (!filter.includes(url)) {
    const token = getToken();

    if (token && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      removeToken();
      return history.replace(LOGIN_PATH);
    }
  }

  return { ...config, url };
};

// TODO
// 全局拦截请求 token无限续期
// let isRefreshing = false;
// const responseInterceptorsForAuth = async (error: any) => {
//
//   if (error.response.status === 401 && !isRefreshing && getRefreshToken()) {
//     const data: APIIdentity.Oauth2TokenParamsDataType = {
//       grant_type: 'refresh_token',
//       refresh_token: getRefreshToken(),
//     }
//
//     if (!isRefreshing) {
//       isRefreshing = true;
//       const refreshTokenResponse = await oauth2RefreshTokenService(data);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${refreshTokenResponse.access_token}`;
//
//       setToken(refreshTokenResponse.access_token);
//       setRefreshToken(refreshTokenResponse.refresh_token);
//
//       window.location.href = window.location.href;
//     }
//   }
// }

export const errorConfig: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {}
};
