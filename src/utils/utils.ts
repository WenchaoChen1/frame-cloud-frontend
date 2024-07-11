import React from "react";
import {history} from "@umijs/max";
import {ACCESS_TOKEN, CURRENT_ACCOUNT_ID, LOGIN_PATH, REFRESH_TOKEN} from "@/pages/common/constant";
import {MenuDataItem} from "@ant-design/pro-components";
import * as allIcons from '@ant-design/icons'

// TODO
// import {RuleObject, StoreValue} from "rc-field-form/lib/interface";

// export function getCookie(name: string) {
//   let arr;
//   const reg1 = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
//   if (document.cookie.match(reg1)) {
//     arr = document.cookie.match(reg1);
//     if (arr) {
//       return unescape(arr[2]);
//     }
//   }
//   return null;
// }
//
// export function setCookie(name: string, value: string, expire: number) {
//   const exp = new Date();
//   exp.setTime(exp.getTime() + expire);
//   document.cookie = `${name}=${escape(value)};expires=${exp.toUTCString()}`;
// }
//
// export function delCookie(key: string) {
//   const exp = new Date();
//   exp.setTime(-1);
//   document.cookie = `${key}=''};expires=${exp.toUTCString()}`;
// }
//
// export const setQueryParams = (params: any): string => {
//   return '?' + new URLSearchParams(Object.entries(params)).toString();
// }
//
// // get router params
// export const getQueryParams = (url = window.location.toString()): object => {
//   const queryString = new URL(url).searchParams.entries();
//   const queryParams: {[key: string]: any} = {};
//   for (const [key, value] of queryString) {
//     queryParams[key] = value;
//   }
//   return queryParams;
// }
//
// export const numberToFloat = (val: string): string => {
//   const value: number = Math.round(parseFloat(val) * 100) / 100;
//   const s = value.toString().split(".");
//   if (s.length === 1) {
//     return value.toString() + ".00";
//   }
//
//   if (s.length > 1) {
//     if (s[1].length < 2) {
//       return value.toString() + "0";
//     }
//   }
//
//   return value.toString();
// }
//
// export const requiredRules = [
//   {
//     required: true,
//     message: "This field is required",
//   },
//   {
//     validator: trimValidator
//   }
// ]
//
// const trimValidator = (_: RuleObject, value: StoreValue) => {
//   if (value?.length > 0 && value.trim().length === 0) {
//     return Promise.reject('This field cannot be all spaces');
//   } else {
//     return Promise.resolve();
//   }
// }


export function getLocalStorage(key: string) {
  return localStorage.getItem(key);
}

export function setLocalStorage(key: string, data: any) {
  localStorage.setItem(key, data);
}

export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function getButtonPermissions(key: string) {
  return localStorage.getItem(key);
}

export function setButtonPermissions(key: string, data: any) {
  localStorage.setItem(key, data);
}

// token
export function getToken() {
  const item = localStorage.getItem(ACCESS_TOKEN);
  return item === null ? '' : item;
}

export function setToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  return refreshToken === null ? '' : refreshToken;
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(CURRENT_ACCOUNT_ID);
}

export function logOut() {
  history.push(LOGIN_PATH);
  removeToken();
  localStorage.clear()
}

export const fixMenuItemIcon = (menus:MenuDataItem[]):MenuDataItem[]=>{
  menus.forEach((item)=>{
    const {icon,children} = item;
    if (typeof icon === 'string'){
      const fixIconName = icon?.slice(0,1)?.toLocaleUpperCase() + icon?.slice(1)
      const IconComponent = allIcons[fixIconName] || allIcons[icon]
      if (IconComponent) {
        item.icon = React.createElement(IconComponent)
      } else {
        item.icon = null // 或其他处理逻辑
      }
    }
    if (children && children.length > 0) {
      item.children = fixMenuItemIcon(children)
    }
  })
  return menus
}

// 全局处理 status 类型 value 转 name 的值（0、1、2、3）
export const statusConversionType = async (arr:any, data: any) => {
  return arr?.map((value: any) => {
    const item = data.find((item: any) => item.value === Number(value));
    return item ? item.key : undefined;
  });
}

export const menuConversionType = async (value:any, data: any) => {
  const item = data.find((item: any) => item.value === Number(value));
  return item ? item.key : undefined;
}

// 处理父子级关系的Edit显示问题
export const filterDate = async (menuData: any, Id: any) => {
  // 父级
  for (let i = 0; i < menuData.length; i++) {
    const item = menuData[i];
    if (item.id === Id) {
      menuData.splice(i, 1)
      continue;
    }
    // 子集
    if (item?.children?.length > 0 && Array.isArray(item?.children)) {
      for (let i = 0; i < item?.children?.length; i++) {
        const list = item?.children[i];
        if (list.id === Id) {
          item?.children?.splice(i, 1)
          continue;
        }

        // 孙子集
        if (list?.children?.length > 0 && Array.isArray(list?.children)) {
          for (let i = 0; i < list?.children?.length; i++) {
            const sunList = list?.children[i];
            if (list.id === Id) {
              sunList?.children?.splice(i, 1)
              continue;
            }
          }
        }
      }
    }
  }
  return menuData;
}


// 随机生成字母
export const generateRandomLetters = (length:number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const charactersLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + '-' + Date.now();
}
