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
    const decoded = jwtDecode(token);
    if (decoded.exp) {
      return decoded.exp < Date.now() / 1000;
    }
  } catch (error) {
    console.log('error: ' + error);
    return true;
  }
  return false;
};

const formatTime = (date: string) => {
  const now = new Date().getTime();
  const s = Math.abs(now - new Date(date).getTime()) / 1000;
  // Seconds
  if (s < 60) {
    return 'now';
  }
  // Minutes
  if (s < 60 * 60) {
    let m = Math.floor(s / 60);
    return `${m}m ago`;
  }
  // Hours
  if (s < 60 * 60 * 24) {
    let h = Math.floor(s / (60 * 60));
    return `${h}h ago`;
  }
  // Days
  if (s < 60 * 60 * 24 * 30) {
    let d = Math.floor(s / (60 * 60 * 24));
    return `${d}d ago`;
  }
  // Months
  if (s < 60 * 60 * 24 * 30 * 12) {
    let m = Math.floor(s / (60 * 60 * 24 * 30));
    return `${m}m ago`;
  }
  // Years
  let y = Math.floor(s / (60 * 60 * 24 * 30 * 12));
  return `${y}y ago`;
};

export default {thumbnail, debounce, isTokenExpired, formatTime};
