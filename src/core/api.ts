import axios from 'axios';
import {Platform} from 'react-native';
import secure from './secure';
import utils from './utils';
import Authorization from './services/Authorization.service';
import useStore from './store/store';

export const ADDRESS = Platform.select({
  ios: 'localhost:8000',
  android: '10.0.2.2:8000',
});

export const client = axios.create({
  baseURL: `http://${ADDRESS}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async config => {
  const protectedRoutes = ['/chat/token/'];

  if (!protectedRoutes.some(route => config.url === route)) {
    return config;
  }

  const logout = useStore.getState().logout;
  const updateUser = useStore.getState().updateUser;

  const tokens = await secure.get('tokens');

  if (tokens?.access && tokens?.refresh) {
    if (utils.isTokenExpired(tokens.access)) {
      console.log('expired token');
      const response = await Authorization.refreshToken(tokens.refresh);

      if (response) {
        const {user, tokens} = response;

        config.headers.Authorization = `Bearer ${tokens.access}`;
        await secure.set('tokens', tokens);
        updateUser(user);
      } else {
        logout();
      }
    } else {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
  } else {
    console.log('No tokens available');
    logout();
  }

  return config;
});
