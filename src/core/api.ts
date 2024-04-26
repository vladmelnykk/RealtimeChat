import axios from 'axios';
import {Platform} from 'react-native';

const ADDRESS = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

export const client = axios.create({
  baseURL: ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});
