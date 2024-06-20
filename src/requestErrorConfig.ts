import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { useLocation } from 'react-router-dom';
import {getRefreshToken, getToken, logOut, removeToken, setRefreshToken, setToken} from '@/utils/utils';
import { history } from '@umijs/max';
import {LOGIN_PATH} from "@/pages/common/constant";
import {oauth2RefreshToken} from "@/services/api/identity-api/oauth2";
import React, { useState, useEffect} from 'react';
import {oauth2RefreshTokenService} from "@/services/base-service/identity-service/login";
const axios = require('axios');

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

const authHeaderInterceptor = (config: RequestOptions) => {
  const filter = [
    '/api/gstdev-system/user/login',
    // login
    '/api/gstdev-identity/oauth2/token',
    '/api/gstdev-system/v1/user/update-customer-user-password',
  ];

  const url = config?.url || '';

  if (!filter.includes(url)) {
    const token = getToken();

    if (token && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('authHeaderInterceptor token is empty', url, window.location.href);
      removeToken();
      return history.replace(LOGIN_PATH);
    }
  }

  return { ...config, url };
};

// 全局拦截请求 token无限续期
let isRefreshing = false;
const responseInterceptorsForAuth = async (error: any) => {
  // debugger

  if (error.response.status === 401 && !isRefreshing) {

    const data: APIIdentity.Oauth2TokenParamsDataType = {
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken(),
    }

    if (!isRefreshing) {
      isRefreshing = true;
      const refreshTokenResponse = await oauth2RefreshTokenService(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${refreshTokenResponse.access_token}`;

      setToken(refreshTokenResponse.access_token);
      setRefreshToken(refreshTokenResponse.refresh_token);

      window.location.href = window.location.href;
    }
  }
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],
  // responseInterceptors: [responseInterceptors],

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      // console.log('Interceptors===========01', res);

      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success ) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // console.log('Interceptors===========02', error, opts);

      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // message.error(`Response status:${error.response.status}`);

        responseInterceptorsForAuth(error);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  }
};
