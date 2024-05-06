import {history} from "@umijs/max";
import {RuleObject, StoreValue} from "rc-field-form/lib/interface";
import {ACCESS_TOKEN, CURRENT_ACCOUNT_ID, LOGIN_PATH} from "@/pages/common/constant";

export function getCookie(name: string) {
  let arr;
  const reg1 = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if (document.cookie.match(reg1)) {
    arr = document.cookie.match(reg1);
    if (arr) {
      return unescape(arr[2]);
    }
  }
  return null;
}

export function setCookie(name: string, value: string, expire: number) {
  const exp = new Date();
  exp.setTime(exp.getTime() + expire);
  document.cookie = `${name}=${escape(value)};expires=${exp.toUTCString()}`;
}

export function delCookie(key: string) {
  const exp = new Date();
  exp.setTime(-1);
  document.cookie = `${key}=''};expires=${exp.toUTCString()}`;
}

export function getLocalStorage(key: string) {
  return localStorage.getItem(key);
}

export function setLocalStorage(key: string, data: any) {
  localStorage.setItem(key, data);
}

export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}

// token
export function getToken() {
  const item = localStorage.getItem(ACCESS_TOKEN);
  return item === null ? '' : item;
}

export function setToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(CURRENT_ACCOUNT_ID);
}

export function logOut() {
  history.push(LOGIN_PATH);
  removeToken();
}

export const setQueryParams = (params: any): string => {
  return '?' + new URLSearchParams(Object.entries(params)).toString();
}

// get router params
export const getQueryParams = (url = window.location.toString()): object => {
  const queryString = new URL(url).searchParams.entries();
  const queryParams: {[key: string]: any} = {};
  for (const [key, value] of queryString) {
    queryParams[key] = value;
  }
  return queryParams;
}

export const numberToFloat = (val: string): string => {
  const value: number = Math.round(parseFloat(val) * 100) / 100;
  const s = value.toString().split(".");
  if (s.length === 1) {
    return value.toString() + ".00";
  }

  if (s.length > 1) {
    if (s[1].length < 2) {
      return value.toString() + "0";
    }
  }

  return value.toString();
}

const trimValidator = (_: RuleObject, value: StoreValue) => {
  if (value?.length > 0 && value.trim().length === 0) {
    return Promise.reject('This field cannot be all spaces');
  } else {
    return Promise.resolve();
  }
}

export const requiredRules = [
  {
    required: true,
    message: "This field is required",
  },
  {
    validator: trimValidator
  }
]
