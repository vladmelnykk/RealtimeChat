import {client} from '../api';

const Authorization = {
  signIn: async ({username, password}: ISignInData) => {
    try {
      const response = await client.post<AuthResponse>('/chat/signin/', {
        username,
        password,
      });

      return response.data;
    } catch (error) {
      console.log('error ' + error);
    }
  },

  signUp: async ({firstName, lastName, username, password}: ISignUpData) => {
    try {
      const response = await client.post<AuthResponse>('/chat/signup/', {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      return response.data;
    } catch (error) {
      console.log('error ' + error);
      return null;
    }
  },

  refreshToken: async (refresh: string) => {
    try {
      const response = await client.post<AuthResponse>('/chat/token/refresh/', {
        refresh: refresh,
      });
      return response.data;
    } catch (error) {
      console.log('error ' + error);
    }
  },

  getUserDataWithToken: async () => {
    try {
      const response = await client.get<AuthResponse>('/chat/token/');
      return response.data;
    } catch (error) {
      console.log('error ' + error);
    }
  },
};

export default Authorization;
