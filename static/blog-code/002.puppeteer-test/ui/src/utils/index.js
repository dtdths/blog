import axios from 'axios';
import qs from 'qs';

export const backEndURL = 'http://localhost:10086';

const Http = axios.create({
  baseURL: `${backEndURL}/api`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000,
  // withCredentials: true
});

const httpPost = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    Http.post(url, qs.stringify(params))
      .then(res => res.data && res.data.code === 200
        ? resolve(res.data)
        : reject(res.data))
      .catch(err => reject(err));
  });
}

export const getAllApiByUrl = (params) => httpPost('/getAllApiByUrl', params);

export const getApiErrorScreenshot =(params) => httpPost('/getApiErrorScreenshot', params);

/**
 * 获取uuid
 * @returns {string}
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // eslint-disable-line
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16);
  });
}
