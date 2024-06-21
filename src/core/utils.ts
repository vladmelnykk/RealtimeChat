import {ADDRESS} from './api';
import {jwtDecode} from 'jwt-decode';
import {decode} from 'base-64';

global.atob = decode;

const thumbnail = (url: string | null) => {
  return url
    ? {uri: `http://${ADDRESS}${url}`}
    : require('../assets/images/profile.png');
};

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const isTokenExpired = (token: string) => {
  try {
    // console.log('token ' + token);
    const decoded = jwtDecode(token);
    console.log(decoded);
    if (decoded.exp) {
      return decoded.exp < Date.now() / 1000;
    }
  } catch (error) {
    console.log('error: ' + error);
    return true;
  }
  return false;
};

export default {thumbnail, debounce, isTokenExpired};
